import { ClientPacket, ClientPacketConstructorOptions } from '.'
import { Byte, Short } from '..'
import { Block } from '../../blocks'
import { BlockPos } from '../../blocks/block-pos'
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
  readonly blockPos: BlockPos
  readonly mode: BlockChangeMode
  readonly blockType: Block

  constructor({ raw }: ClientPacketConstructorOptions) {
    super({ raw })
    const x = this.reader.readShort(Byte.SIZE)
    const y = this.reader.readShort(Byte.SIZE + Short.SIZE)
    const z = this.reader.readShort(Byte.SIZE + Short.SIZE + Short.SIZE)
    this.blockPos = new BlockPos(x, y, z)
    const mode = this.reader.readByte(
      Byte.SIZE + Short.SIZE + Short.SIZE + Short.SIZE
    )
    if (!(mode in BlockChangeMode)) {
      throw new Error(`Invalid block change mode (${mode})`)
    }
    this.mode = mode
    const blockId = this.reader.readByte(
      Byte.SIZE + Short.SIZE + Short.SIZE + Short.SIZE + Byte.SIZE
    )
    const block = Block.find(blockId)
    if (!block) {
      throw new Error(`Invalid block type (${blockId})`)
    }
    this.blockType = block
  }

  id() {
    return PacketType.SET_BLOCK_CLIENT
  }
  size() {
    return (
      Byte.SIZE + Short.SIZE + Short.SIZE + Short.SIZE + Byte.SIZE + Byte.SIZE
    )
  }
}
