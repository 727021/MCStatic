import { Socket } from 'node:net'
import { DespawnPlayer, DisconnectPlayer, LevelDataChunk, LevelFinalize, LevelInitialize, Message, PacketReader, Ping, PlayerIdentification, ServerIdentification, SetBlockServer, SetPositionAndOrientation, SpawnPlayer, UpdateUserType } from '../protocol'
import { Server } from '../server'
import { PacketType, PlayerType } from '../constants'
import { Level } from '../levels'
import { Block } from '../blocks'
import * as log from '../utils/debug'

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
  static #connected: Map<string, Player> = new Map()
  static get connected(): ReadonlySet<Player> {
    return new Set(this.#connected.values())
  }

  // TODO
  key!: string
  name!: string
  id!: number
  x!: number
  y!: number
  z!: number
  yaw!: number
  pitch!: number
  level!: Level

  constructor(private readonly socket: Socket) {
    log.info(`New connection from ${socket.remoteAddress ?? '(unknown)'}`)
    socket.on('data', data => {
      // TODO: error handling
      this.handleRawPacket(data)
    })
    socket.on('end', () => {
      log.info(`${socket.remoteAddress ?? '(unknown)'} disconnected`)
      // TODO: Player disconnected
    })
    // this.sendDisconnectPlayer('nope!')
    // socket.end(() => console.log('socket closed'))
  }

  async kick(message: string) {
    this.sendDisconnectPlayer(message)
    // TODO despawn this player for other players, send chat message
    return new Promise<void>(resolve => {
      this.socket.end(() => resolve())
    })
  }

  //#region Send raw packets
  sendPing() {
    const packet = new Ping()
    this.socket.write(packet.toBytes())
  }

  sendServerIdentification() {
    const packet = new ServerIdentification({
      serverName: Server.s.name,
      serverMotd: Server.s.motd,
      playerType: PlayerType.NORMAL // TODO: figure out where to store ops
    })
    this.socket.write(packet.toBytes())
  }

  sendMessage(message: string) {
    const packet = new Message({ message })
    this.socket.write(packet.toBytes())
  }

  sendDisconnectPlayer(reason: string) {
    const packet = new DisconnectPlayer({ disconnectReason: reason })
    this.socket.write(packet.toBytes())
  }

  sendDespawnPlayer(player: Player) {
    const packet = new DespawnPlayer({ playerId: player.id })
    this.socket.write(packet.toBytes())
  }

  sendLevelInitialize() {
    const packet = new LevelInitialize()
    this.socket.write(packet.toBytes())
  }

  sendLevelDataChunk(chunk: Block[], percent: number) {
    const packet = new LevelDataChunk({
      chunkData: chunk.map(c => c.shownAs.id),
      chunkLength: chunk.length,
      percentComplete: percent
    })
    this.socket.write(packet.toBytes())
  }

  sendLevelFinalize(level: Level) {
    const packet = new LevelFinalize({ xSize: level.width, ySize: level.height, zSize: level.depth })
    this.socket.write(packet.toBytes())
  }

  sendSpawnPlayer(player: Player) {
    const packet = new SpawnPlayer({
      playerId: player === this ? 0xff : player.id,
      playerName: player.name,
      x: player.x,
      y: player.y,
      z: player.z,
      yaw: player.yaw,
      pitch: player.pitch
    })
    this.socket.write(packet.toBytes())
  }

  sendSetBlock(blockType: Block, x: number, y: number, z: number) {
    const packet = new SetBlockServer({ blockType, x, y, z })
    this.socket.write(packet.toBytes())
  }

  sendUpdateUserType(playerType: PlayerType) {
    const packet = new UpdateUserType({ playerType })
    this.socket.write(packet.toBytes())
  }

  sendPositionAndOrientation(player: Player) {
    const packet = new SetPositionAndOrientation({
      playerId: player === this ? 0xff : player.id,
      x: player.x,
      y: player.y,
      z: player.z,
      yaw: player.yaw,
      pitch: player.pitch
    })
    this.socket.write(packet.toBytes())
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
    const isLegit = this.socket.remoteAddress === this.socket.localAddress || Server.s.authenticatePlayer(this)
    if (!isLegit) {
      this.kick('authentication failed').catch(err => console.error(err))
      return
    }
    this.sendServerIdentification()
    this.sendLevelInitialize()
  }
  //#endregion
}
