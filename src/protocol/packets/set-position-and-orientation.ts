import { Packet, PacketConstructorOptions } from '.'
import { Byte, FShort, SByte } from '..'
import { PacketDirection, PacketType } from '../../constants'

type SetPositionAndOrientationConstructorOptions = PacketConstructorOptions<{
  playerId: number
  x: number
  y: number
  z: number
  yaw: number
  pitch: number
}>

/**
 * Sent with changes in player position and rotation.
 * Used for sending initial position on the map, and teleportation.
 *
 * Some servers don't send relative packets, opting to only use this one.
 */
export class SetPositionAndOrientation extends Packet {
  #playerId!: number
  get playerId() {
    return this.#playerId
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
    raw,
    playerId,
    x,
    y,
    z,
    yaw,
    pitch
  }: SetPositionAndOrientationConstructorOptions) {
    super({ raw })
    if (this.direction === PacketDirection.SERVER_TO_CLIENT) {
      if (playerId === undefined || !SByte.isValid(playerId)) {
        throw new Error('Invalid playerId')
      }
      this.#playerId = playerId
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
    } else {
      this.#playerId = this.reader.readSByte(Byte.SIZE)
      this.#x = this.reader.readFShort(Byte.SIZE + SByte.SIZE)
      this.#y = this.reader.readFShort(Byte.SIZE + SByte.SIZE + FShort.SIZE)
      this.#z = this.reader.readFShort(
        Byte.SIZE + SByte.SIZE + FShort.SIZE + FShort.SIZE
      )
      this.#yaw = this.reader.readByte(
        Byte.SIZE + SByte.SIZE + FShort.SIZE + FShort.SIZE + FShort.SIZE
      )
      this.#pitch = this.reader.readByte(
        Byte.SIZE +
          SByte.SIZE +
          FShort.SIZE +
          FShort.SIZE +
          FShort.SIZE +
          Byte.SIZE
      )
    }
  }

  id() {
    return PacketType.SET_POSITION_AND_ORIENTATION
  }
  size() {
    return (
      Byte.SIZE +
      SByte.SIZE +
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
      .writeFShort(this.x)
      .writeFShort(this.y)
      .writeFShort(this.z)
      .writeByte(this.yaw)
      .writeByte(this.pitch)
      .build()
  }
}
