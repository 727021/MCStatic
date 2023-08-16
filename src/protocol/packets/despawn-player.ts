import { ServerPacket, ServerPacketConstructorOptions } from '.'
import { Byte, SByte } from '..'

type DespawnPlayerConstructorOptions = ServerPacketConstructorOptions<{
  playerId: number
}>

/**
 * Sent to others when the player disconnects.
 */
export class DespawnPlayer extends ServerPacket {
  #playerId!: number
  get playerId() {
    return this.#playerId
  }

  constructor({ playerId }: DespawnPlayerConstructorOptions) {
    super()
    if (playerId === undefined || !SByte.isValid(playerId)) {
      throw new Error('Invalid playerId')
    }
    this.#playerId = playerId
  }

  id(): number {
    return 0x0c
  }
  size(): number {
    return Byte.SIZE + SByte.SIZE
  }
  toBytes(): Buffer {
    return this.writer.writeByte(this.id()).writeSByte(this.playerId).build()
  }
}
