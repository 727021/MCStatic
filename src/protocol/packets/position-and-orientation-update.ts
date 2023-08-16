import { ServerPacket, ServerPacketConstructorOptions } from '.'
import { Byte, FByte, SByte } from '..'

type PositionAndOrientationUpdateConstructorOptions = ServerPacketConstructorOptions<{
  playerId: number
  dX: number
  dY: number
  dZ: number
  yaw: number
  pitch: number
}>

/**
 * Sent with changes in player position and rotation.
 * Sent when both position and orientation is changed at the same time.
 *
 * Not required for server operation.
 */
export class PositionAndOrientationUpdate extends ServerPacket {
  #playerId!: number
  get playerId() {
    return this.#playerId
  }
  #dX!: number
  get dX() {
    return this.#dX
  }
  #dY!: number
  get dY() {
    return this.#dY
  }
  #dZ!: number
  get dZ() {
    return this.#dZ
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
    dX,
    dY,
    dZ,
    yaw,
    pitch
  }: PositionAndOrientationUpdateConstructorOptions) {
    super()
    if (playerId === undefined || !SByte.isValid(playerId)) {
      throw new Error('Invalid playerId')
    }
    this.#playerId = playerId
    if (dX === undefined || !FByte.isValid(dX)) {
      throw new Error('Invalid dX')
    }
    this.#dX = dX
    if (dY === undefined || !FByte.isValid(dY)) {
      throw new Error('Invalid dY')
    }
    this.#dY = dY
    if (dZ === undefined || !FByte.isValid(dZ)) {
      throw new Error('Invalid dZ')
    }
    this.#dZ = dZ
    if (yaw === undefined || !Byte.isValid(yaw)) {
      throw new Error('Invalid yaw')
    }
    this.#yaw = yaw
    if (pitch === undefined || !Byte.isValid(pitch)) {
      throw new Error('Invalid pitch')
    }
    this.#pitch = pitch
  }

  id(): number {
    return 0x09
  }
  size(): number {
    return (
      Byte.SIZE +
      SByte.SIZE +
      FByte.SIZE +
      FByte.SIZE +
      FByte.SIZE +
      Byte.SIZE +
      Byte.SIZE
    )
  }
  toBytes(): Buffer {
    return this.writer
      .writeByte(this.id())
      .writeSByte(this.playerId)
      .writeFByte(this.dX)
      .writeFByte(this.dY)
      .writeFByte(this.dZ)
      .writeByte(this.yaw)
      .writeByte(this.pitch)
      .build()
  }
}
