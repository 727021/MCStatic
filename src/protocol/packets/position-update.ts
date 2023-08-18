import { ServerPacket, ServerPacketConstructorOptions } from '.'
import { Byte, FByte, SByte } from '..'
import { PacketType } from '../../constants'

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
  readonly playerId: number
  readonly dX: number
  readonly dY: number
  readonly dZ: number

  constructor({ playerId, dX, dY, dZ }: PositionUpdateConstructorOptions) {
    super()
    if (playerId === undefined || !SByte.isValid(playerId)) {
      throw new Error('Invalid playerId')
    }
    this.playerId = playerId
    if (dX === undefined || !FByte.isValid(dX)) {
      throw new Error('Invalid dX')
    }
    this.dX = dX
    if (dY === undefined || !FByte.isValid(dY)) {
      throw new Error('Invalid dY')
    }
    this.dY = dY
    if (dZ === undefined || !FByte.isValid(dZ)) {
      throw new Error('Invalid dZ')
    }
    this.dZ = dZ
  }

  id() {
    return PacketType.POSITION_UPDATE
  }
  size() {
    return Byte.SIZE + SByte.SIZE + FByte.SIZE + FByte.SIZE + FByte.SIZE
  }
  toBytes() {
    return this.writer
      .writeByte(this.id())
      .writeSByte(this.playerId)
      .writeFByte(this.dX)
      .writeFByte(this.dY)
      .writeFByte(this.dZ)
      .build()
  }
}
