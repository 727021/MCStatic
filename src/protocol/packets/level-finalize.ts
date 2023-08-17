import { ServerPacket, ServerPacketConstructorOptions } from '.'
import { Byte, Short } from '..'
import { PacketType } from '../../constants'

type LevelFinalizeConstructorOptions = ServerPacketConstructorOptions<{
  xSize: number
  ySize: number
  zSize: number
}>

/**
 * Sent after level data is complete and gives map dimensions.
 * The y coordinate is how tall the map is.
 */
export class LevelFinalize extends ServerPacket {
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

  constructor({ xSize, ySize, zSize }: LevelFinalizeConstructorOptions) {
    super()
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
  }

  id() {
    return PacketType.LEVEL_FINALIZE
  }
  size() {
    return Byte.SIZE + Short.SIZE + Short.SIZE + Short.SIZE
  }
  toBytes() {
    return this.writer
      .writeByte(this.id())
      .writeShort(this.xSize)
      .writeShort(this.ySize)
      .writeShort(this.zSize)
      .build()
  }
}
