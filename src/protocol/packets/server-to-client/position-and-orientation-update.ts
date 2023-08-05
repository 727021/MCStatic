import { Packet, PacketConstructorOptions } from '..'
import { Byte, FByte, SByte } from '../..'

type PositionAndOrientationUpdateConstructorOptions = PacketConstructorOptions<{
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
export class PositionAndOrientationUpdate extends Packet {
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
    raw,
    playerId,
    dX,
    dY,
    dZ,
    yaw,
    pitch
  }: PositionAndOrientationUpdateConstructorOptions) {
    super({ raw })
    if (!raw) {
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
    } else {
      this.#playerId = this.reader.readSByte(Byte.SIZE)
      this.#dX = this.reader.readFByte(Byte.SIZE + SByte.SIZE)
      this.#dY = this.reader.readFByte(Byte.SIZE + SByte.SIZE + FByte.SIZE)
      this.#dZ = this.reader.readFByte(
        Byte.SIZE + SByte.SIZE + FByte.SIZE + FByte.SIZE
      )
      this.#yaw = this.reader.readByte(
        Byte.SIZE + SByte.SIZE + FByte.SIZE + FByte.SIZE + FByte.SIZE
      )
      this.#pitch = this.reader.readByte(
        Byte.SIZE +
          SByte.SIZE +
          FByte.SIZE +
          FByte.SIZE +
          FByte.SIZE +
          Byte.SIZE
      )
    }
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
