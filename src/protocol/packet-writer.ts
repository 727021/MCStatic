export class PacketWriter {
  private buf: Buffer

  constructor() {
    this.buf = Buffer.allocUnsafe(0)
  }

  clear() {
    this.buf = Buffer.allocUnsafe(0)
  }

  build() {
    const result = this.buf
    this.clear()
    return result
  }

  writeByte(value: number) {
    const raw = Buffer.allocUnsafe(1)
    raw.writeUInt8(value)
    this.buf = Buffer.concat([this.buf, raw])
    return this
  }

  writeSByte(value: number) {
    const raw = Buffer.allocUnsafe(1)
    raw.writeInt8(value)
    this.buf = Buffer.concat([this.buf, raw])
    return this
  }

  writeFByte(value: number): typeof this {
    const raw = Buffer.allocUnsafe(1)
    raw.writeUInt8(value)
    this.buf = Buffer.concat([this.buf, raw])
    return this
  }

  writeShort(value: number) {
    const raw = Buffer.allocUnsafe(2)
    raw.writeInt16BE(value)
    this.buf = Buffer.concat([this.buf, raw])
    return this
  }

  writeFShort(value: number): typeof this {
    const raw = Buffer.allocUnsafe(2)
    raw.writeUInt16BE(value)
    this.buf = Buffer.concat([this.buf, raw])
    return this
  }

  writeString(value: string) {
    const str = value.substring(0, 64).padEnd(64)
    const raw = Buffer.from(str, 'ascii')
    this.buf = Buffer.concat([this.buf, raw])
    return this
  }

  writeByteArray(value: number[]) {
    const arr = new Array(Math.max(0, 1024 - value.length)).fill(0x00)
    arr.unshift(...value.slice(0, 1024))
    const raw = Buffer.from(arr)
    this.buf = Buffer.concat([this.buf, raw])
    return this
  }
}
