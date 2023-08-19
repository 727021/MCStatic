import { PlayerPos } from '../players/player-pos'

export class BlockPos {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly z: number
  ) {
    if (![x, y, z].every(Number.isInteger)) {
      throw new Error('Invalid block position')
    }
  }

  static fromPlayerPos(pos: PlayerPos) {
    return new BlockPos(pos.x >>> 32, pos.y >>> 32, pos.z >>> 32)
  }
}
