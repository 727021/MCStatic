import { ServerPacket, ServerPacketConstructorOptions } from '.'
import { Byte, ByteArray, Short } from '..'
import { PacketType } from '../../constants'

type LevelDataChunkConstructorOptions = ServerPacketConstructorOptions<{
  chunkLength: number
  chunkData: number[]
  percentComplete: number
}>

/**
 * Contains a chunk of the [gzipped level data](https://wiki.vg/Classic_ProtocolLevel_Data), to be concatenated with the rest.
 * Chunk Data is up to 1024 bytes, padded with `0x00`s if less.
 */
export class LevelDataChunk extends ServerPacket {
  readonly chunkLength: number
  readonly chunkData: number[]
  readonly percentComplete: number

  constructor({
    chunkLength,
    chunkData,
    percentComplete
  }: LevelDataChunkConstructorOptions) {
    super()
    if (
      chunkLength === undefined ||
      !Short.isValid(chunkLength) ||
      chunkLength > ByteArray.SIZE
    ) {
      throw new Error('Invalid chunkLength')
    }
    this.chunkLength = chunkLength
    if (chunkData === undefined || !ByteArray.isValid(chunkData)) {
      throw new Error('Invalid chunkData')
    }
    this.chunkData = [...chunkData]
    if (percentComplete === undefined || !Byte.isValid(percentComplete)) {
      throw new Error('Invalid percentComplete')
    }
    this.percentComplete = percentComplete
  }

  id() {
    return PacketType.LEVEL_DATA_CHUNK
  }
  size() {
    return Byte.SIZE + Short.SIZE + ByteArray.SIZE + Byte.SIZE
  }
  toBytes() {
    return this.writer
      .writeByte(this.id())
      .writeShort(this.chunkLength)
      .writeByteArray(this.chunkData)
      .writeByte(this.percentComplete)
      .build()
  }
}
