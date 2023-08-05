import { PacketReader, PacketWriter } from '..'

type DefaultPacketConstructorOptions = { raw?: Buffer }
export type PacketConstructorOptions<
  T extends { [key: string]: unknown } = { [key: string]: unknown }
> = DefaultPacketConstructorOptions & T

export abstract class Packet {
  protected reader: PacketReader
  protected writer: PacketWriter

  constructor({ raw }: PacketConstructorOptions = {}) {
    this.reader = new PacketReader(raw)
    this.writer = new PacketWriter()

    if (raw) {
      const id = this.reader.readByte(0)
      if (raw.length !== this.size()) {
        throw new Error(`Incorrect packet length (${raw.length})`)
      }
      if (id !== this.id()) {
        throw new Error(`Incorrect packet id (${id})`)
      }
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
