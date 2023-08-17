import { ServerPacket, ServerPacketConstructorOptions } from '.'
import { Byte, FShort, SByte, String } from '..'
import { PacketType } from '../../constants'

type SpawnPlayerConstructorOptions = ServerPacketConstructorOptions<{
  playerId: number
  playerName: string
  x: number
  y: number
  z: number
  yaw: number
  pitch: number
}>

/**
 * Sent to indicate where a new player is spawning in the world.
 * This will set the player's spawn point.
 */
export class SpawnPlayer extends ServerPacket {
  #playerId!: number
  get playerId() {
    return this.#playerId
  }
  #playerName!: string
  get playerName() {
    return this.#playerName
  }
  #x!: number
  get x() {
    return this.#x
  }
  #y!: number
  get y() {
    return this.#y
  }
  #z!: number
  get z() {
    return this.#z
  }
  #yaw!: number
  get yaw() {
    return this.#yaw
  }
  #pitch!: number
  get pitch() {
    return this.#pitch
  }

  constructor({
    playerId,
    playerName,
    x,
    y,
    z,
    yaw,
    pitch
  }: SpawnPlayerConstructorOptions) {
    super()
    if (playerId === undefined || !SByte.isValid(playerId)) {
      throw new Error('Invalid playerId')
    }
    this.#playerId = playerId
    if (playerName === undefined || !String.isValid(playerName)) {
      throw new Error('Invalid playerName')
    }
    this.#playerName = playerName
    if (x === undefined || !FShort.isValid(x)) {
      throw new Error('Invalid x')
    }
    this.#x = x
    if (y === undefined || !FShort.isValid(y)) {
      throw new Error('Invalid y')
    }
    this.#y = y
    if (z === undefined || !FShort.isValid(z)) {
      throw new Error('Invalid z')
    }
    this.#z = z
    if (yaw === undefined || !Byte.isValid(yaw)) {
      throw new Error('Invalid yaw')
    }
    this.#yaw = yaw
    if (pitch === undefined || !Byte.isValid(pitch)) {
      throw new Error('Invalid pitch')
    }
    this.#pitch = pitch
  }

  id() {
    return PacketType.SPAWN_PLAYER
  }
  size() {
    return (
      Byte.SIZE +
      SByte.SIZE +
      String.SIZE +
      FShort.SIZE +
      FShort.SIZE +
      FShort.SIZE +
      Byte.SIZE +
      Byte.SIZE
    )
  }
  toBytes() {
    return this.writer
      .writeByte(this.id())
      .writeSByte(this.playerId)
      .writeString(this.playerName)
      .writeFShort(this.x)
      .writeFShort(this.y)
      .writeFShort(this.z)
      .writeByte(this.yaw)
      .writeByte(this.pitch)
      .build()
  }
}
