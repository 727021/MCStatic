import { BlockPos } from '../blocks/block-pos'

export enum Yaw {
  NORTH = 0,
  EAST = 64,
  SOUTH = 128,
  WEST = 192
}

export enum Pitch {
  LEVEL = 0,
  DOWN = 64,
  UP = 192
}

export const FEET_OFFSET = 51

export class PlayerPos {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly z: number,
    readonly yaw: number = Yaw.NORTH,
    readonly pitch: number = Pitch.LEVEL
  ) {
    if (![x, y, z, yaw, pitch].every(Number.isInteger)) {
      throw new Error('Invalid player position')
    }
  }

  static fromBlockPos(
    pos: BlockPos,
    center = false,
    yaw = Yaw.NORTH,
    pitch = Pitch.LEVEL
  ) {
    return new PlayerPos(
      pos.x * 32 + (center ? 16 : 0),
      pos.y * 32 + FEET_OFFSET,
      pos.z * 32 + (center ? 16 : 0),
      yaw,
      pitch
    )
  }
}
