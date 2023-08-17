import { ClientPacket, ClientPacketConstructorOptions } from '.'
import { Byte, Short } from '..'
import { Block } from '../../blocks'
import { BlockChangeMode, PacketType } from '../../constants'

/**
 * Sent when a user changes a block. The mode field indicates whether a block was created (0x01) or destroyed (0x00).
 *
 * Block type is always the type player is holding, even when destroying.
 *
 * Client assumes that this command packet always succeeds, and so draws the new block immediately.
 * To disallow block creation, server must send back Set Block packet with the old block type.
 */
export class SetBlockClient extends ClientPacket {
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

  constructor({ raw }: ClientPacketConstructorOptions) {
    super({ raw })
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

  id() {
    return PacketType.SET_BLOCK_CLIENT
  }
  size() {
    return (
      Byte.SIZE + Short.SIZE + Short.SIZE + Short.SIZE + Byte.SIZE + Byte.SIZE
    )
  }
  toBytes() {
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
