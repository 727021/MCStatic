import { PacketReader, PacketWriter } from '..'
import { PacketDirection } from '../../constants'

type DefaultPacketConstructorOptions = { raw?: Buffer }
export type PacketConstructorOptions<
  T extends { [key: string]: unknown } = { [key: string]: unknown }
> = DefaultPacketConstructorOptions & Partial<T>

export abstract class Packet {
  protected reader: PacketReader
  protected writer: PacketWriter
  readonly direction: PacketDirection

  constructor({ raw }: PacketConstructorOptions = {}) {
    this.reader = new PacketReader(raw)
    this.writer = new PacketWriter()

    if (raw) {
      this.direction = PacketDirection.CLIENT_TO_SERVER
      const id = this.reader.readByte(0)
      if (raw.length !== this.size()) {
        throw new Error(`Incorrect packet length (${raw.length})`)
      }
      if (id !== this.id()) {
        throw new Error(`Incorrect packet id (${id})`)
      }
    } else {
      this.direction = PacketDirection.SERVER_TO_CLIENT
    }
  }

  /**
   * Single-byte id for this type of packet
   */
  abstract id(): number
  /**
   * The size of this packet in bytes, including the id
   */
  abstract size(): number
  abstract toBytes(): Buffer
}
