import { ServerPacket } from '.'
import { Byte } from '..'
import { PacketType } from '../../constants'

/**
 * Sent to clients periodically.
 * The only way a client can disconnect at the moment is to force it closed, which does not let the server know.
 * The ping packet is used to determine if the connection is still open.
 */
export class Ping extends ServerPacket {
  constructor() {
    super()
  }

  id() {
    return PacketType.PING
  }
  size() {
    return Byte.SIZE
  }
  toBytes() {
    return this.writer.writeByte(this.id()).build()
  }
}
