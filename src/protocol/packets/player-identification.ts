import { ClientPacketConstructorOptions, ClientPacket } from '.'
import { Byte, String } from '..'
import { PROTOCOL_VERSION, PacketType } from '../../constants'

/**
 * Sent by a player joining a server with relevant information.
 * The protocol version is 0x07, unless you're using a client below 0.28.
 */
export class PlayerIdentification extends ClientPacket {
  #username!: string
  get username() {
    return this.#username
  }
  #verificationKey!: string
  get verificationKey() {
    return this.#verificationKey
  }

  constructor({
    raw
  }: ClientPacketConstructorOptions) {
    super({ raw })
    const protocolVersion = this.reader.readByte(Byte.SIZE)
    if (protocolVersion !== PROTOCOL_VERSION) {
      throw new Error('Invalid protocol version')
    }
    this.#username = this.reader.readString(Byte.SIZE + Byte.SIZE)
    this.#verificationKey = this.reader.readString(
      Byte.SIZE + Byte.SIZE + String.SIZE
    )
  }

  id() {
    return PacketType.IDENTIFICATION
  }
  size() {
    return Byte.SIZE + Byte.SIZE + String.SIZE + String.SIZE + Byte.SIZE
  }
  toBytes() {
    return this.writer
      .writeByte(this.id())
      .writeByte(PROTOCOL_VERSION)
      .writeString(this.username)
      .writeString(this.verificationKey)
      .writeByte(0x00) // unused
      .build()
  }
}
