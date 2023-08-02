import { Packet, PacketConstructorOptions } from ".."
import { Byte, FShort, SByte } from "../.."

type PositionAndOrientationConstructorOptions = PacketConstructorOptions<{
  x?: number,
  y?: number,
  z?: number,
  yaw?: number,
  pitch?: number
}>

/**
 * Sent frequently (even while not moving) by the player with the player's current location and orientation.
 * Player ID is always -1, referring to itself.
 */
export class PositionAndOrientation extends Packet {
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

  constructor({ raw, x, y, z, yaw, pitch }: PositionAndOrientationConstructorOptions) {
    super({ raw })
    if (!raw) {
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
      this.#x = this.reader.readFShort(Byte.SIZE + SByte.SIZE)
      this.#y = this.reader.readFShort(Byte.SIZE + SByte.SIZE + FShort.SIZE)
      this.#z = this.reader.readFShort(Byte.SIZE + SByte.SIZE + FShort.SIZE + FShort.SIZE)
      this.#yaw = this.reader.readByte(Byte.SIZE + SByte.SIZE + FShort.SIZE + FShort.SIZE + FShort.SIZE)
      this.#pitch = this.reader.readByte(Byte.SIZE + SByte.SIZE + FShort.SIZE + FShort.SIZE + FShort.SIZE + Byte.SIZE)
    }
  }

  id(): number {
    return 0x08
  }
  size(): number {
    return Byte.SIZE + SByte.SIZE + FShort.SIZE + FShort.SIZE + FShort.SIZE + Byte.SIZE + Byte.SIZE
  }
  toBytes(): Buffer {
    return this.writer
      .writeByte(this.id())
      .writeSByte(0xff) // player id
      .writeFShort(this.x)
      .writeFShort(this.y)
      .writeFShort(this.z)
      .writeByte(this.yaw)
      .writeByte(this.pitch)
      .build()
  }

}