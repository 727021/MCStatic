import { Packet, PacketConstructorOptions } from '..'
import { Byte } from '../..'

/**
 * Notifies the player of incoming level data.
 */
export class LevelInitialize extends Packet {
  constructor(options: PacketConstructorOptions) {
    super(options)
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
