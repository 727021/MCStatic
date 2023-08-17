import { PacketReader, PacketWriter } from '..'
import { PacketDirection, PacketType } from '../../constants'

type DefaultPacketConstructorOptions = { raw?: Buffer }
export type PacketConstructorOptions<
  T extends { [key: string]: unknown } = { [key: string]: unknown }
> = DefaultPacketConstructorOptions & Partial<T>

export abstract class Packet {
  protected reader: PacketReader
  protected writer: PacketWriter
  protected _direction: PacketDirection
  get direction() {
    return this._direction
  }

  constructor({ raw }: PacketConstructorOptions = {}) {
    this.reader = new PacketReader(raw)
    this.writer = new PacketWriter()

    if (raw) {
      this._direction = PacketDirection.CLIENT_TO_SERVER
      const id = this.reader.readByte(0)
      if (raw.length !== this.size()) {
        throw new Error(`Incorrect packet length (${raw.length})`)
      }
      if (id !== this.id()) {
        throw new Error(`Incorrect packet id (${id})`)
      }
    } else {
      this._direction = PacketDirection.SERVER_TO_CLIENT
    }
  }

  /**
   * Single-byte id for this type of packet
   */
  abstract id(): PacketType
  /**
   * The size of this packet in bytes, including the id
   */
  abstract size(): number
  abstract toBytes(): Buffer
}

export type ServerPacketConstructorOptions<
  T extends { [key: string]: unknown } = { [key: string]: unknown }
> = T
export abstract class ServerPacket extends Packet {
  constructor(options: ServerPacketConstructorOptions = {}) {
    super()
  }
}

export type ClientPacketConstructorOptions =
  Required<DefaultPacketConstructorOptions>
export abstract class ClientPacket extends Packet {
  constructor({ raw }: ClientPacketConstructorOptions) {
    super({ raw })
  }
}
