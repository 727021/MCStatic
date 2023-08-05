import { Packet, PacketConstructorOptions } from '..'
import { Byte, Short } from '../..'

type LevelFinalizeConstructorOptions = PacketConstructorOptions<{
  xSize: number
  ySize: number
  zSize: number
}>

/**
 * Sent after level data is complete and gives map dimensions.
 * The y coordinate is how tall the map is.
 */
export class LevelFinalize extends Packet {
  #xSize!: number
  get xSize() {
    return this.#xSize
  }
  #ySize!: number
  get ySize() {
    return this.#ySize
  }
  #zSize!: number
  get zSize() {
    return this.#zSize
  }

  constructor({ raw, xSize, ySize, zSize }: LevelFinalizeConstructorOptions) {
    super({ raw })
    if (!raw) {
      if (xSize === undefined || !Short.isValid(xSize)) {
        throw new Error('Invalid xSize')
      }
      this.#xSize = xSize
      if (ySize === undefined || !Short.isValid(ySize)) {
        throw new Error('Invalid ySize')
      }
      this.#ySize = ySize
      if (zSize === undefined || !Short.isValid(zSize)) {
        throw new Error('Invalid zSize')
      }
      this.#zSize = zSize
    } else {
      this.#xSize = this.reader.readShort(Byte.SIZE)
      this.#ySize = this.reader.readShort(Byte.SIZE + Short.SIZE)
      this.#zSize = this.reader.readShort(Byte.SIZE + Short.SIZE + Short.SIZE)
    }
  }

  id(): number {
    return 0x04
  }
  size(): number {
    return Byte.SIZE + Short.SIZE + Short.SIZE + Short.SIZE
  }
  toBytes(): Buffer {
    return this.writer
      .writeByte(this.id())
      .writeShort(this.xSize)
      .writeShort(this.ySize)
      .writeShort(this.zSize)
      .build()
  }
}
