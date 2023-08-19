import { ServerPacket, ServerPacketConstructorOptions } from '.'
import { Byte, FShort, SByte, String } from '..'
import { PacketType } from '../../constants'
import { PlayerPos } from '../../players/player-pos'

type SpawnPlayerConstructorOptions = ServerPacketConstructorOptions<{
  playerId: number
  playerName: string
  playerPos: PlayerPos
}>

/**
 * Sent to indicate where a new player is spawning in the world.
 * This will set the player's spawn point.
 */
export class SpawnPlayer extends ServerPacket {
  readonly playerId: number
  readonly playerName: string
  readonly playerPos: PlayerPos

  constructor({
    playerId,
    playerName,
    playerPos
  }: SpawnPlayerConstructorOptions) {
    super()
    if (!SByte.isValid(playerId)) {
      throw new Error('Invalid playerId')
    }
    this.playerId = playerId
    if (!String.isValid(playerName)) {
      throw new Error('Invalid playerName')
    }
    this.playerName = playerName
    this.playerPos = playerPos
  }

  id() {
    return PacketType.SPAWN_PLAYER
  }
  size() {
    return (
      Byte.SIZE +
      SByte.SIZE +
      String.SIZE +
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
      .writeString(this.playerName)
      .writeFShort(this.playerPos.x)
      .writeFShort(this.playerPos.y)
      .writeFShort(this.playerPos.z)
      .writeByte(this.playerPos.yaw)
      .writeByte(this.playerPos.pitch)
      .build()
  }
}
