import { ServerPacket, ServerPacketConstructorOptions } from '.'
import { Byte, FByte, SByte } from '..'
import { PacketType } from '../../constants'

type PositionAndOrientationUpdateConstructorOptions =
  ServerPacketConstructorOptions<{
    playerId: number
    dX: number
    dY: number
    dZ: number
    yaw: number
    pitch: number
  }>

/**
 * Sent with changes in player position and rotation.
 * Sent when both position and orientation is changed at the same time.
 *
 * Not required for server operation.
 */
export class PositionAndOrientationUpdate extends ServerPacket {
  readonly playerId: number
  readonly dX: number
  readonly dY: number
  readonly dZ: number
  readonly yaw: number
  readonly pitch: number

  constructor({
    playerId,
    dX,
    dY,
    dZ,
    yaw,
    pitch
  }: PositionAndOrientationUpdateConstructorOptions) {
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
    if (yaw === undefined || !Byte.isValid(yaw)) {
      throw new Error('Invalid yaw')
    }
    this.yaw = yaw
    if (pitch === undefined || !Byte.isValid(pitch)) {
      throw new Error('Invalid pitch')
    }
    this.pitch = pitch
  }

  id() {
    return PacketType.POSITION_AND_ORIENTATION_UPDATE
  }
  size() {
    return (
      Byte.SIZE +
      SByte.SIZE +
      FByte.SIZE +
      FByte.SIZE +
      FByte.SIZE +
      Byte.SIZE +
      Byte.SIZE
    )
  }
  toBytes() {
    return this.writer
      .writeByte(this.id())
      .writeSByte(this.playerId)
      .writeFByte(this.dX)
      .writeFByte(this.dY)
      .writeFByte(this.dZ)
      .writeByte(this.yaw)
      .writeByte(this.pitch)
      .build()
  }
}
