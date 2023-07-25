export class PacketReader {
  constructor(private readonly buf = Buffer.allocUnsafe(0)) {}

  readByte(offset = 0) {
    return this.buf.readUInt8(offset)
  }

  readSByte(offset = 0) {
    return this.buf.readInt8(offset)
  }

  readFByte(offset = 0): number {
    // TODO
    throw new Error('Method not implemented.')
  }

  readShort(offset = 0) {
    return this.buf.readInt16BE(offset)
  }

  readFShort(offset = 0): number {
    // TODO
    throw new Error('Method not implemented.')
  }

  readString(offset = 0, keepPadding = false) {
    const str = this.buf.subarray(offset, offset + 64).toString('ascii')
    if (keepPadding) {
      return str.padEnd(64)
    }
    return str.trimEnd()
  }

  readByteArray(offset = 0, keepPadding = false) {
    const bytes = this.buf.subarray(offset, offset + 1024)
    if (keepPadding) {
      const arr = new Array(1024 - bytes.length).fill(0x00) as number[]
      arr.unshift(...bytes)
      return arr
    }
    const endIndex = bytes.findLastIndex(x => x !== 0x00) + 1
    return [...bytes.subarray(0, endIndex)]
  }
}
