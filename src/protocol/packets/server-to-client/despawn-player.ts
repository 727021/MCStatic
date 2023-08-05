import { Packet, PacketConstructorOptions } from '..'
import { Byte, SByte } from '../..'

type DespawnPlayerConstructorOptions = PacketConstructorOptions<{
  playerId: number
}>

/**
 * Sent to others when the player disconnects.
 */
export class DespawnPlayer extends Packet {
  #playerId!: number
  get playerId() {
    return this.#playerId
  }

  constructor({ raw, playerId }: DespawnPlayerConstructorOptions) {
    super({ raw })
    if (!raw) {
      if (playerId === undefined || !SByte.isValid(playerId)) {
        throw new Error('Invalid playerId')
      }
      this.#playerId = playerId
    } else {
      this.#playerId = this.reader.readSByte(Byte.SIZE)
    }
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
