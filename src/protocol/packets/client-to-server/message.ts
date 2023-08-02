import { Packet, PacketConstructorOptions } from "..";
import { Byte, SByte, String } from "../..";

type MessageConstructorOptions = PacketConstructorOptions<{
  message?: string
}>

/**
 * Contain chat messages sent by player. Player ID is always -1, referring to itself.
 * (See [how chat works](https://wiki.vg/Chat#Old_system) - note that Classic **only** supports color codes.)
 */
export class Message extends Packet {
  #message!: string
  get message() {
    return this.#message
  }

  constructor({ raw, message }: MessageConstructorOptions) {
    super({ raw })
    if (!raw) {
      if (message === undefined || !String.isValid(message)) {
        throw new Error('Invalid message')
      }
      this.#message = message
    } else {
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
      .writeSByte(0xff) // player id
      .writeString(this.message)
      .build()
  }
}