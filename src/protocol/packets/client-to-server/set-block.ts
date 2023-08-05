import { Packet, PacketConstructorOptions } from '..'
import { Byte, Short } from '../..'
import { Block } from '../../../blocks'

enum BlockChangeMode {
  DESTROY = 0x00,
  CREATE = 0x01
}

type SetBlockConstructorOptions = PacketConstructorOptions<{
  x?: number
  y?: number
  z?: number
  mode?: BlockChangeMode
  blockType?: Block
}>

/**
 * Sent when a user changes a block. The mode field indicates whether a block was created (0x01) or destroyed (0x00).
 *
 * Block type is always the type player is holding, even when destroying.
 *
 * Client assumes that this command packet always succeeds, and so draws the new block immediately.
 * To disallow block creation, server must send back Set Block packet with the old block type.
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
  #mode!: BlockChangeMode
  get mode() {
    return this.#mode
  }
  #blockType!: Block
  get blockType() {
    return this.#blockType
  }

  constructor({ raw, x, y, z, mode, blockType }: SetBlockConstructorOptions) {
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
      if (mode === undefined || !(mode in BlockChangeMode)) {
        throw new Error(`Invalid block change mode (${mode ?? ''})`)
      }
      this.#mode = mode
      if (!blockType) {
        throw new Error('Missing block type')
      }
      this.#blockType = blockType
    } else {
      this.#x = this.reader.readShort(Byte.SIZE)
      this.#y = this.reader.readShort(Byte.SIZE + Short.SIZE)
      this.#z = this.reader.readShort(Byte.SIZE + Short.SIZE + Short.SIZE)
      const mode = this.reader.readByte(
        Byte.SIZE + Short.SIZE + Short.SIZE + Short.SIZE
      )
      if (!(mode in BlockChangeMode)) {
        throw new Error(`Invalid block change mode (${mode})`)
      }
      this.#mode = mode
      const blockId = this.reader.readByte(
        Byte.SIZE + Short.SIZE + Short.SIZE + Short.SIZE + Byte.SIZE
      )
      const block = Block.find(blockId)
      if (!block) {
        throw new Error(`Invalid block type (${blockId})`)
      }
      this.#blockType = block
    }
  }

  id(): number {
    return 0x05
  }
  size(): number {
    return (
      Byte.SIZE + Short.SIZE + Short.SIZE + Short.SIZE + Byte.SIZE + Byte.SIZE
    )
  }
  toBytes(): Buffer {
    return this.writer
      .writeByte(this.id())
      .writeShort(this.x)
      .writeShort(this.y)
      .writeShort(this.z)
      .writeByte(this.mode)
      .writeByte(this.blockType.id)
      .build()
  }
}
