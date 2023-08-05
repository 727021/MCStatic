import { Packet, PacketConstructorOptions } from '..'
import { Byte, SByte, String } from '../..'

type MessageConstructorOptions = PacketConstructorOptions<{
  playerId: number
  message: string
}>

/**
 * Messages sent by chat or from the console.
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

  constructor({ raw, playerId, message }: MessageConstructorOptions) {
    super({ raw })
    if (!raw) {
      if (playerId === undefined || !SByte.isValid(playerId)) {
        throw new Error('Invalid playerId')
      }
      this.#playerId = playerId
      if (message === undefined || !String.isValid(message)) {
        throw new Error('Invalid message')
      }
      this.#message = message
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
