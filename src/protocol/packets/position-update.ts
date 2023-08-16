import { ServerPacket, ServerPacketConstructorOptions } from '.'
import { Byte, FByte, SByte } from '..'

type PositionUpdateConstructorOptions = ServerPacketConstructorOptions<{
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
export class PositionUpdate extends ServerPacket {
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

  constructor({ playerId, dX, dY, dZ }: PositionUpdateConstructorOptions) {
    super()
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
