import { ServerPacket, ServerPacketConstructorOptions } from "."
import { Byte } from ".."
import { PlayerType } from "../../constants"

type UpdateUserTypeConstructorOptions = ServerPacketConstructorOptions<{
  playerType: PlayerType
}>

/**
 * Sent when a player is opped/deopped.
 * User type is `0x64` for op, `0x00` for normal user.
 * This decides if the player can delete bedrock.
 */
export class UpdateUserType extends ServerPacket {
  #playerType!: PlayerType
  get playerType() {
    return this.#playerType
  }

  constructor({ playerType }: UpdateUserTypeConstructorOptions) {
    super()
    if (playerType === undefined || !(playerType in PlayerType)) {
      throw new Error('Invalid playerType')
    }
    this.#playerType = playerType
  }

  id(): number {
    return 0x0f
  }
  size(): number {
    return Byte.SIZE + Byte.SIZE
  }
  toBytes(): Buffer {
    return this.writer
      .writeByte(this.id())
      .writeByte(this.playerType)
      .build()
  }
}