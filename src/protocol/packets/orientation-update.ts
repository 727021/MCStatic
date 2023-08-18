import { ServerPacket, ServerPacketConstructorOptions } from '.'
import { Byte, SByte } from '..'
import { PacketType } from '../../constants'

type OrientationUpdateConstructorOptions = ServerPacketConstructorOptions<{
  playerId: number
  yaw: number
  pitch: number
}>

/**
 * Sent with changes in player rotation.
 *
 * Not required for server operation.
 */
export class OrientationUpdate extends ServerPacket {
  readonly playerId: number
  readonly yaw: number
  readonly pitch: number

  constructor({ playerId, yaw, pitch }: OrientationUpdateConstructorOptions) {
    super()
    if (playerId === undefined || !SByte.isValid(playerId)) {
      throw new Error('Invalid playerId')
    }
    this.playerId = playerId
    if (yaw === undefined || !Byte.isValid(yaw)) {
      throw new Error('Invalid yaw')
    }
    this.yaw = yaw
    if (pitch === undefined || !Byte.isValid(pitch)) {
      throw new Error('invalid pitch')
    }
    this.pitch = pitch
  }

  id() {
    return PacketType.ORIENTATION_UPDATE
  }
  size() {
    return Byte.SIZE + SByte.SIZE + Byte.SIZE + Byte.SIZE
  }
  toBytes() {
    return this.writer
      .writeByte(this.id())
      .writeSByte(this.playerId)
      .writeByte(this.yaw)
      .writeByte(this.pitch)
      .build()
  }
}
