import { ServerPacket } from '.'
import { Byte } from '..'

/**
 * Notifies the player of incoming level data.
 */
export class LevelInitialize extends ServerPacket {
  constructor() {
    super()
  }

  id(): number {
    return 0x02
  }
  size(): number {
    return Byte.SIZE
  }
  toBytes(): Buffer {
    return this.writer.writeByte(this.id()).build()
  }
}
