import { Socket } from 'node:net'
import { promisify } from 'node:util'
import { gzip as _gzip } from 'node:zlib'

import { Block } from '../blocks'
import { BlockPos } from '../blocks/block-pos'
import { PacketType, PlayerType } from '../constants'
import { Level } from '../levels'
import {
  ByteArray,
  DespawnPlayer,
  DisconnectPlayer,
  LevelDataChunk,
  LevelFinalize,
  LevelInitialize,
  Message,
  Packet,
  PacketReader,
  Ping,
  PlayerIdentification,
  ServerIdentification,
  SetBlockServer,
  SetPositionAndOrientation,
  SpawnPlayer,
  UpdateUserType
} from '../protocol'
import { Server } from '../server'
import * as log from '../utils/debug'
import { PlayerPos } from './player-pos'

const gzip = promisify(_gzip)

// Server -> Client
// [X] despawn-player
// [X] disconnect-player
// [X] level-data-chunk
// [X] level-finalize
// [X] level-initialize
// [X] ping
// [X] server-identification
// [X] spawn-player
// [X] set-block-server
// [X] update-user-type
// [ ] orientation-update
// [ ] position-and-orientation-update
// [ ] position-update
// Server <- Client
// [X] player-identification
// [ ] set-block-client
// Server <--> Client
// [X] message (send)
// [ ] message (receive)
// [X] set-position-and-orientation (send)
// [ ] set-position-and-orientation (receive)

export class Player {
  static #connections = new Set<Socket>()
  static get connections(): ReadonlySet<Socket> {
    return this.#connections
  }

  static #players = new Set<Player>()
  static get players(): ReadonlySet<Player> {
    return this.#players
  }

  static async kickAll(message: string) {
    return Promise.all([
      Promise.allSettled([...this.players].map(player => player.kick(message))),
      Promise.allSettled(
        [...this.connections].map(
          socket => new Promise<void>(resolve => socket.end(() => resolve()))
        )
      )
    ])
  }

  // TODO
  key!: string
  name!: string
  id!: number
  pos!: PlayerPos
  level!: Level

  constructor(private readonly socket: Socket) {
    log.info(`New connection from ${socket.remoteAddress ?? '(unknown)'}`)
    Player.#connections.add(socket)
    socket.on('data', data => {
      // TODO: error handling
      this.handleRawPacket(data)
    })
    socket.on('end', () => {
      log.info(`${socket.remoteAddress ?? '(unknown)'} disconnected`)
      Player.#connections.delete(socket)
      Player.#players.delete(this)
      // TODO: despawn player for other players if not already done
    })
  }

  //#region Send raw packets
  private sendPacket(packet: Packet) {
    log.packet(`Sending packet with id 0x${packet.id().toString(16)}`)
    log.raw(packet)
    this.socket.write(packet.toBytes())
  }

  sendPing() {
    this.sendPacket(new Ping())
  }

  sendServerIdentification() {
    this.sendPacket(
      new ServerIdentification({
        serverName: Server.s.name,
        serverMotd: Server.s.motd,
        playerType: PlayerType.NORMAL // TODO: figure out where to store ops
      })
    )
  }

  sendMessage(message: string) {
    this.sendPacket(new Message({ message }))
  }

  sendDisconnectPlayer(reason: string) {
    this.sendPacket(new DisconnectPlayer({ disconnectReason: reason }))
  }

  sendDespawnPlayer(player: Player) {
    this.sendPacket(new DespawnPlayer({ playerId: player.id }))
  }

  sendLevelInitialize() {
    this.sendPacket(new LevelInitialize())
  }

  sendLevelDataChunk(chunk: number[] | Buffer, percent: number) {
    this.sendPacket(
      new LevelDataChunk({
        chunkData: Buffer.isBuffer(chunk) ? [...chunk] : chunk,
        chunkLength: chunk.length,
        percentComplete: percent
      })
    )
  }

  sendLevelFinalize(level: Level) {
    this.sendPacket(
      new LevelFinalize({
        xSize: level.width,
        ySize: level.height,
        zSize: level.depth
      })
    )
  }

  sendSpawnPlayer(player: Player) {
    this.sendPacket(
      new SpawnPlayer({
        playerId: player === this ? -1 : player.id,
        playerName: player.name,
        playerPos: player.pos
      })
    )
  }

  sendSetBlock(blockType: Block, blockPos: BlockPos) {
    this.sendPacket(new SetBlockServer({ blockType, blockPos }))
  }

  sendUpdateUserType(playerType: PlayerType) {
    this.sendPacket(new UpdateUserType({ playerType }))
  }

  sendPositionAndOrientation(player: Player) {
    this.sendPacket(
      new SetPositionAndOrientation({
        playerId: player === this ? -1 : player.id,
        playerPos: player.pos
      })
    )
  }
  //#endregion

  //#region Receive raw packets
  private handleRawPacket(data: Buffer) {
    const reader = new PacketReader(data)
    const packetId = reader.readByte() as PacketType
    log.packet(`Handling packet with id 0x${packetId?.toString(16)}`)

    switch (packetId) {
      case PacketType.IDENTIFICATION: {
        const packet = new PlayerIdentification({ raw: data })
        this.handlePlayerIdentification(packet)
        return
      }
      case PacketType.SET_BLOCK_CLIENT:
        break
      case PacketType.SET_POSITION_AND_ORIENTATION:
        break
      case PacketType.MESSAGE:
        break
      default:
        log.warn(`Invalid packet type 0x${packetId?.toString(16)}`)
        return
    }
  }

  handlePlayerIdentification(packet: PlayerIdentification) {
    this.name = packet.username
    this.key = packet.verificationKey
    const isLegit =
      this.socket.remoteAddress === this.socket.localAddress ||
      Server.s.authenticatePlayer(this)
    if (!isLegit) {
      this.kick('authentication failed').catch(err => console.error(err))
      return
    }
    this.sendServerIdentification()
    Player.#players.add(this)
    Player.#connections.delete(this.socket)
    this.sendLevel(Server.s.level).catch(log.error)
  }
  //#endregion

  async kick(message: string) {
    this.sendDisconnectPlayer(message)
    // TODO despawn this player for other players, send chat message
    return new Promise<void>(resolve => {
      this.socket.end(() => resolve())
    })
  }

  async sendLevel(level: Level) {
    this.sendLevelInitialize()
    const size = Buffer.allocUnsafe(4)
    size.writeInt32BE(level.blocks.length)
    const levelData = Buffer.concat([
      size,
      Buffer.from(level.blocks.map(block => block.shownAs.id))
    ])
    const gzipped = await gzip(levelData)
    const chunks = Math.ceil(gzipped.length / ByteArray.SIZE)
    for (let i = 0; i < chunks; ++i) {
      this.sendLevelDataChunk(
        gzipped.subarray(
          ByteArray.SIZE * i,
          ByteArray.SIZE * i + ByteArray.SIZE
        ),
        Math.ceil(((i + 1) / chunks) * 100)
      )
    }
    this.sendLevelFinalize(level)
    this.pos = level.spawn
    Player.sendSpawn(this)
  }

  static sendSpawn(spawned: Player) {
    Player.#players.forEach(player => {
      player.sendSpawnPlayer(spawned)
    })
  }
}
