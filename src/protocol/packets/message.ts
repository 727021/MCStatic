import { Packet, PacketConstructorOptions } from '.'
import { Byte, SByte, String } from '..'
import { PacketDirection, PacketType } from '../../constants'

type MessageConstructorOptions = PacketConstructorOptions<{
  message: string
}>

/**
 * Contain chat messages sent by player. Player ID is always -1, referring to itself.
 * (See [how chat works](https://wiki.vg/Chat#Old_system) - note that Classic **only** supports color codes.)
 */
export class Message extends Packet {
  readonly playerId: number
  readonly message: string

  constructor({ raw, message }: MessageConstructorOptions) {
    super({ raw })
    if (this.direction === PacketDirection.SERVER_TO_CLIENT) {
      if (message === undefined || !String.isValid(message)) {
        throw new Error('Invalid message')
      }
      this.message = message
      this.playerId = 0xff
    } else {
      this.playerId = this.reader.readSByte(Byte.SIZE)
      this.message = this.reader.readString(Byte.SIZE + SByte.SIZE)
    }
  }

  id() {
    return PacketType.MESSAGE
  }
  size() {
    return Byte.SIZE + SByte.SIZE + String.SIZE
  }
  toBytes() {
    return this.writer
      .writeByte(this.id())
      .writeSByte(this.playerId)
      .writeString(this.message)
      .build()
  }
}
