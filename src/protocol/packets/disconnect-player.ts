import { ServerPacket, ServerPacketConstructorOptions } from '.'
import { Byte, String } from '..'
import { PacketType } from '../../constants'

type DisconnectPlayerConstructorOptions = ServerPacketConstructorOptions<{
  disconnectReason: string
}>

/**
 * Sent to a player when they're disconnected from the server.
 * 1. "Cheat detected: Distance" - happens not only when setting tile too far away from the player (how far is maximum distance and how it is measured?), but also when player moves and then immediately builds.
 * 2. "Cheat detected: Tile type"
 * 3. "Cheat detected: Too much clicking!"
 * 4. "Cheat detected: Too much lag"
 */
export class DisconnectPlayer extends ServerPacket {
  readonly disconnectReason: string

  constructor({ disconnectReason }: DisconnectPlayerConstructorOptions) {
    super()
    if (disconnectReason === undefined || !String.isValid(disconnectReason)) {
      throw new Error('Invalid disconnectReason')
    }
    this.disconnectReason = disconnectReason
  }

  id() {
    return PacketType.DISCONNECT_PLAYER
  }
  size() {
    return Byte.SIZE + String.SIZE
  }
  toBytes() {
    return this.writer
      .writeByte(this.id())
      .writeString(this.disconnectReason)
      .build()
  }
}
