import { Packet, PacketConstructorOptions } from '.'
import { Byte, SByte, String } from '..'
import { PacketDirection } from '../../constants'

type MessageConstructorOptions = PacketConstructorOptions<{
  message: string
}>

/**
 * Contain chat messages sent by player. Player ID is always -1, referring to itself.
 * (See [how chat works](https://wiki.vg/Chat#Old_system) - note that Classic **only** supports color codes.)
 */
export class Message extends Packet {
  #playerId!: number
  get playerId() {
    return this.#playerId
  }
  #message!: string
  get message() {
    return this.#message
  }

  constructor({ raw, message }: MessageConstructorOptions) {
    super({ raw })
    if (this.direction === PacketDirection.SERVER_TO_CLIENT) {
      if (message === undefined || !String.isValid(message)) {
        throw new Error('Invalid message')
      }
      this.#message = message
      this.#playerId = 0xff
    } else {
      this.#playerId = this.reader.readSByte(Byte.SIZE)
      this.#message = this.reader.readString(Byte.SIZE + SByte.SIZE)
    }
  }

  id(): number {
    return 0x0d
  }
  size(): number {
    return Byte.SIZE + SByte.SIZE + String.SIZE
  }
  toBytes(): Buffer {
    return this.writer
      .writeByte(this.id())
      .writeSByte(this.playerId)
      .writeString(this.message)
      .build()
  }
}
