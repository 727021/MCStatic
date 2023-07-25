/**
 * Sent frequently (even while not moving) by the player with the player's current location and orientation.
 * Player ID is always -1 (255), referring to itself.
 */
import { Packet, PacketConstructorOptions } from ".."
import { Byte, FShort, SByte } from "../.."

type PositionAndOrientationConstructorOptions = PacketConstructorOptions<{
  playerId?: number,
  x?: number,
  y?: number,
  z?: number,
  yaw?: number,
  pitch?: number
}>

export class PositionAndOrientation extends Packet {
  #playerId!: number // Maybe make this a Player instead of a number?
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

  constructor({ raw, playerId, x, y, z, yaw, pitch }: PositionAndOrientationConstructorOptions) {
    super({ raw })
    if (!raw) {
      //
    } else {
      this.#playerId = this.reader.readByte(Byte.SIZE)
      this.#x = this.reader.readFShort(Byte.SIZE + Byte.SIZE)
      this.#y = this.reader.readFShort(Byte.SIZE + Byte.SIZE + FShort.SIZE)
      this.#z = this.reader.readFShort(Byte.SIZE + Byte.SIZE + FShort.SIZE + FShort.SIZE)
      this.#yaw = this.reader.readByte(Byte.SIZE + Byte.SIZE + FShort.SIZE + FShort.SIZE + FShort.SIZE)
      this.#pitch = this.reader.readByte(Byte.SIZE + Byte.SIZE + FShort.SIZE + FShort.SIZE + FShort.SIZE + Byte.SIZE)
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
      .writeByte(this.playerId)
      .writeFShort(this.x)
      .writeFShort(this.y)
      .writeFShort(this.z)
      .writeByte(this.yaw)
      .writeByte(this.pitch)
      .build()
  }

}