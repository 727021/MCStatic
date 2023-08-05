import { Packet } from '..'

/**
 * Sent to a player when they're disconnected from the server.
 * 1. "Cheat detected: Distance" - happens not only when setting tile too far away from the player (how far is maximum distance and how it is measured?), but also when player moves and then immediately builds.
 * 2. "Cheat detected: Tile type"
 * 3. "Cheat detected: Too much clicking!"
 * 4. "Cheat detected: Too much lag"
 */
export class DisconnectPlayer extends Packet {
  id(): number {
    throw new Error('Method not implemented.')
  }
  size(): number {
    throw new Error('Method not implemented.')
  }
  toBytes(): Buffer {
    throw new Error('Method not implemented.')
  }
}
