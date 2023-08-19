import { Level } from '.'
import { Block } from '../blocks'
import { BlockPos } from '../blocks/block-pos'
import { PlayerPos } from '../players/player-pos'
import * as log from '../utils/debug'

export type generatorFn = (
  width: number,
  height: number,
  depth: number
) => { blocks: Block[]; spawn: PlayerPos }

export class Generator {
  static #generators = new Map<string, generatorFn>()
  static get generators(): ReadonlyArray<string> {
    return [...this.#generators.keys()]
  }

  static register(name: string, fn: generatorFn) {
    if (this.#generators.has(name)) {
      log.warn(`Level generator with name '${name}' already exists`)
      return false
    }
    this.#generators.set(name, fn)
    return true
  }

  static generate(type: string, width: number, height: number, depth: number) {
    return this.#generators.get(type)?.(width, height, depth)
  }

  private constructor() {
    /**/
  }
}

Generator.register('air', (width, height, depth) => {
  const blocks = new Array(width * height * depth).fill(Block.AIR) as Block[]
  const spawn = PlayerPos.fromBlockPos(
    new BlockPos(width / 2, 0, depth / 2),
    true
  )
  return { blocks, spawn }
})

Generator.register('flat', (width, height, depth) => {
  const blocks = new Array(width * height * depth).fill(Block.AIR) as Block[]
  const grassLevel = Math.floor(height / 2) - 1
  for (let x = 0; x < width; ++x)
    for (let z = 0; z < depth; ++z)
      for (let y = 0; y < grassLevel; ++y)
        blocks[Level.indexAt(x, y, z, width, depth)] = Block.DIRT
  for (let x = 0; x < width; ++x)
    for (let z = 0; z < depth; ++z)
      blocks[Level.indexAt(x, grassLevel, z, width, depth)] = Block.GRASS
  const spawn = PlayerPos.fromBlockPos(
    new BlockPos(width / 2, grassLevel + 1, depth / 2)
  )
  return { blocks, spawn }
})

Generator.register('void', (width, height, depth) => {
  const blocks = new Array(width * height * depth).fill(Block.AIR) as Block[]
  for (let x = 0; x < width; ++x)
    for (let y = 0; y < height; ++y)
      for (let z = 0; z < depth; ++z)
        if (
          x === 0 ||
          y === 0 ||
          z === 0 ||
          x === width - 1 ||
          y === height - 1 ||
          z === depth - 1
        )
          blocks[Level.indexAt(x, y, z, width, depth)] = Block.OBSIDIAN
  const spawn = PlayerPos.fromBlockPos(new BlockPos(width / 2, 1, depth / 2))
  return { blocks, spawn }
})
