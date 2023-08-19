import { Packet, PacketConstructorOptions } from '.'
import { Byte, FShort, SByte } from '..'
import { PacketDirection, PacketType } from '../../constants'
import { PlayerPos } from '../../players/player-pos'

type SetPositionAndOrientationConstructorOptions = PacketConstructorOptions<{
  playerId: number
  playerPos: PlayerPos
}>

/**
 * Sent with changes in player position and rotation.
 * Used for sending initial position on the map, and teleportation.
 *
 * Some servers don't send relative packets, opting to only use this one.
 */
export class SetPositionAndOrientation extends Packet {
  readonly playerId: number
  readonly playerPos: PlayerPos

  constructor({
    raw,
    playerId,
    playerPos
  }: SetPositionAndOrientationConstructorOptions) {
    super({ raw })
    if (this.direction === PacketDirection.SERVER_TO_CLIENT) {
      if (playerId === undefined || !SByte.isValid(playerId)) {
        throw new Error('Invalid playerId')
      }
      this.playerId = playerId
      if (playerPos === undefined) {
        throw new Error('Invalid playerPos')
      }
      this.playerPos = playerPos
    } else {
      this.playerId = this.reader.readSByte(Byte.SIZE)
      const x = this.reader.readFShort(Byte.SIZE + SByte.SIZE)
      const y = this.reader.readFShort(Byte.SIZE + SByte.SIZE + FShort.SIZE)
      const z = this.reader.readFShort(
        Byte.SIZE + SByte.SIZE + FShort.SIZE + FShort.SIZE
      )
      const yaw = this.reader.readByte(
        Byte.SIZE + SByte.SIZE + FShort.SIZE + FShort.SIZE + FShort.SIZE
      )
      const pitch = this.reader.readByte(
        Byte.SIZE +
          SByte.SIZE +
          FShort.SIZE +
          FShort.SIZE +
          FShort.SIZE +
          Byte.SIZE
      )
      this.playerPos = new PlayerPos(x, y, z, yaw, pitch)
    }
  }

  id() {
    return PacketType.SET_POSITION_AND_ORIENTATION
  }
  size() {
    return (
      Byte.SIZE +
      SByte.SIZE +
      FShort.SIZE +
      FShort.SIZE +
      FShort.SIZE +
      Byte.SIZE +
      Byte.SIZE
    )
  }
  toBytes() {
    return this.writer
      .writeByte(this.id())
      .writeSByte(this.playerId)
      .writeFShort(this.playerPos.x)
      .writeFShort(this.playerPos.y)
      .writeFShort(this.playerPos.z)
      .writeByte(this.playerPos.yaw)
      .writeByte(this.playerPos.pitch)
      .build()
  }
}
