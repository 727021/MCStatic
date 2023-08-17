import { ServerPacket } from '.'
import { Byte } from '..'
import { PacketType } from '../../constants'

/**
 * Notifies the player of incoming level data.
 */
export class LevelInitialize extends ServerPacket {
  constructor() {
    super()
  }

  id() {
    return PacketType.LEVEL_INITIALIZE
  }
  size() {
    return Byte.SIZE
  }
  toBytes() {
    return this.writer.writeByte(this.id()).build()
  }
}
