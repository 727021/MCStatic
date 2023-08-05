import { Packet, PacketConstructorOptions } from '..'
import { Byte, Short } from '../..'
import { Block } from '../../../blocks'

type SetBlockConstructorOptions = PacketConstructorOptions<{
  x: number
  y: number
  z: number
  blockType: Block
}>

/**
 * Sent to indicate a block change by physics or by players.
 * In the case of a player change, the server will also echo the block change back to the player who initiated it.
 */
export class SetBlock extends Packet {
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
  #blockType!: Block
  get blockType() {
    return this.#blockType
  }

  constructor({ raw, x, y, z, blockType }: SetBlockConstructorOptions) {
    super({ raw })
    if (!raw) {
      if (x === undefined || !Short.isValid(x)) {
        throw new Error('Invalid x')
      }
      this.#x = x
      if (y === undefined || !Short.isValid(y)) {
        throw new Error('Invalid y')
      }
      this.#y = y
      if (z === undefined || !Short.isValid(z)) {
        throw new Error('Invalid z')
      }
      this.#z = z
      const block = Block.find(blockType?.id)
      if (!block) {
        throw new Error('Invalid blockType')
      }
      this.#blockType = block
    } else {
      this.#x = this.reader.readShort(Byte.SIZE)
      this.#y = this.reader.readShort(Byte.SIZE + Short.SIZE)
      this.#z = this.reader.readShort(Byte.SIZE + Short.SIZE + Short.SIZE)
      const blockId = this.reader.readByte(
        Byte.SIZE + Short.SIZE + Short.SIZE + Short.SIZE
      )
      const block = Block.find(blockId)
      if (!block) {
        throw new Error('Invalid blockType')
      }
      this.#blockType = block
    }
  }

  id(): number {
    return 0x06
  }
  size(): number {
    return Byte.SIZE + Short.SIZE + Short.SIZE + Short.SIZE + Byte.SIZE
  }
  toBytes(): Buffer {
    return this.writer
      .writeByte(this.id())
      .writeShort(this.x)
      .writeShort(this.y)
      .writeShort(this.z)
      .writeByte(this.blockType.shownAs.id)
      .build()
  }
}
