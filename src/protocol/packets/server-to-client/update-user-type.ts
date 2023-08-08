import { Packet, PacketConstructorOptions } from ".."
import { Byte } from "../.."

enum PlayerType {
  NORMAL = 0x00,
  OP = 0x64
}

type UpdateUserTypeConstructorOptions = PacketConstructorOptions<{
  playerType: PlayerType
}>

/**
 * Sent when a player is opped/deopped.
 * User type is `0x64` for op, `0x00` for normal user.
 * This decides if the player can delete bedrock.
 */
export class UpdateUserType extends Packet {
  #playerType!: PlayerType
  get playerType() {
    return this.#playerType
  }

  constructor({ raw, playerType }: UpdateUserTypeConstructorOptions) {
    super({ raw })
    if (!raw) {
      if (playerType === undefined || !(playerType in PlayerType)) {
        throw new Error('Invalid playerType')
      }
      this.#playerType = playerType
    } else {
      const playerType = this.reader.readByte(Byte.SIZE)
      if (!(playerType in PlayerType)) {
        throw new Error('Invalid playerType')
      }
      this.#playerType = playerType
    }
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