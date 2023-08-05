import { Packet, PacketConstructorOptions } from '..'
import { Byte, FByte, SByte } from '../..'

type PositionUpdateConstructorOptions = PacketConstructorOptions<{
  playerId: number
  dX: number
  dY: number
  dZ: number
}>

/**
 * Sent with changes in player position.
 *
 * Not required for server operation.
 */
export class PositionUpdate extends Packet {
  #playerId!: number
  get playerId() {
    return this.#playerId
  }
  #dX!: number
  get dX() {
    return this.#dX
  }
  #dY!: number
  get dY() {
    return this.#dY
  }
  #dZ!: number
  get dZ() {
    return this.#dZ
  }

  constructor({ raw, playerId, dX, dY, dZ }: PositionUpdateConstructorOptions) {
    super({ raw })
    if (!raw) {
      if (playerId === undefined || !SByte.isValid(playerId)) {
        throw new Error('Invalid playerId')
      }
      this.#playerId = playerId
      if (dX === undefined || !FByte.isValid(dX)) {
        throw new Error('Invalid dX')
      }
      this.#dX = dX
      if (dY === undefined || !FByte.isValid(dY)) {
        throw new Error('Invalid dY')
      }
      this.#dY = dY
      if (dZ === undefined || !FByte.isValid(dZ)) {
        throw new Error('Invalid dZ')
      }
      this.#dZ = dZ
    } else {
      this.#playerId = this.reader.readSByte(Byte.SIZE)
      this.#dX = this.reader.readFByte(Byte.SIZE + SByte.SIZE)
      this.#dY = this.reader.readFByte(Byte.SIZE + SByte.SIZE + FByte.SIZE)
      this.#dZ = this.reader.readFByte(
        Byte.SIZE + SByte.SIZE + FByte.SIZE + FByte.SIZE
      )
    }
  }

  id(): number {
    return 0x0a
  }
  size(): number {
    return Byte.SIZE + SByte.SIZE + FByte.SIZE + FByte.SIZE + FByte.SIZE
  }
  toBytes(): Buffer {
    return this.writer
      .writeByte(this.id())
      .writeSByte(this.playerId)
      .writeFByte(this.dX)
      .writeFByte(this.dY)
      .writeFByte(this.dZ)
      .build()
  }
}
