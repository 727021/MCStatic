import { Packet, PacketConstructorOptions } from '..'
import { Byte, SByte } from '../..'

type OrientationUpdateConstructorOptions = PacketConstructorOptions<{
  playerId: number
  yaw: number
  pitch: number
}>

/**
 * Sent with changes in player rotation.
 *
 * Not required for server operation.
 */
export class OrientationUpdate extends Packet {
  #playerId!: number
  get playerId() {
    return this.#playerId
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
    yaw,
    pitch
  }: OrientationUpdateConstructorOptions) {
    super({ raw })
    if (!raw) {
      if (playerId === undefined || !SByte.isValid(playerId)) {
        throw new Error('Invalid playerId')
      }
      this.#playerId = playerId
      if (yaw === undefined || !Byte.isValid(yaw)) {
        throw new Error('Invalid yaw')
      }
      this.#yaw = yaw
      if (pitch === undefined || !Byte.isValid(pitch)) {
        throw new Error('invalid pitch')
      }
      this.#pitch = pitch
    } else {
      this.#playerId = this.reader.readSByte(Byte.SIZE)
      this.#yaw = this.reader.readByte(Byte.SIZE + SByte.SIZE)
      this.#pitch = this.reader.readByte(Byte.SIZE + SByte.SIZE + Byte.SIZE)
    }
  }

  id(): number {
    return 0x0b
  }
  size(): number {
    return Byte.SIZE + SByte.SIZE + Byte.SIZE + Byte.SIZE
  }
  toBytes(): Buffer {
    return this.writer
      .writeByte(this.id())
      .writeSByte(this.playerId)
      .writeByte(this.yaw)
      .writeByte(this.pitch)
      .build()
  }
}
