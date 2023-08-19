import { ServerPacket, ServerPacketConstructorOptions } from '.'
import { Byte, Short } from '..'
import { Block } from '../../blocks'
import { BlockPos } from '../../blocks/block-pos'
import { PacketType } from '../../constants'

type SetBlockConstructorOptions = ServerPacketConstructorOptions<{
  blockPos: BlockPos
  blockType: Block
}>

/**
 * Sent to indicate a block change by physics or by players.
 * In the case of a player change, the server will also echo the block change back to the player who initiated it.
 */
export class SetBlockServer extends ServerPacket {
  readonly blockPos: BlockPos
  readonly blockType: Block

  constructor({ blockPos, blockType }: SetBlockConstructorOptions) {
    super()
    this.blockPos = blockPos
    const block = Block.find(blockType?.id)
    if (!block) {
      throw new Error('Invalid blockType')
    }
    this.blockType = block
  }

  id() {
    return PacketType.SET_BLOCK_SERVER
  }
  size() {
    return Byte.SIZE + Short.SIZE + Short.SIZE + Short.SIZE + Byte.SIZE
  }
  toBytes() {
    return this.writer
      .writeByte(this.id())
      .writeShort(this.blockPos.x)
      .writeShort(this.blockPos.y)
      .writeShort(this.blockPos.z)
      .writeByte(this.blockType.shownAs.id)
      .build()
  }
}
