import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { Block } from '../blocks'

const MCS_MAGIC_NUMBER = 0x72
const LEVEL_FOLDER = join(process.cwd(), 'levels')

export type SpawnPosition = {
  x: number
  y: number
  z: number
  rotx: number
  roty: number
}

export type LevelCreateOptions = {
  name: string
  width: number
  height: number
  depth: number
  spawn: SpawnPosition
}

export class Level {
  static #loaded: Map<string, Level> = new Map()
  static get loaded(): ReadonlySet<Level> {
    return new Set(this.#loaded.values())
  }

  static exists(name: string): boolean {
    const filename = this.filenameForLevel(name)
    const path = join(LEVEL_FOLDER, filename)
    return existsSync(path)
  }

  static async load(name: string): Promise<Level | undefined> {
    if (this.#loaded.has(name)) return this.#loaded.get(name)
    try {
      const filename = this.filenameForLevel(name)
      const path = join(LEVEL_FOLDER, filename)
      const buf = await readFile(path)
      const magic = buf.readUInt8()
      if (magic !== MCS_MAGIC_NUMBER)
        throw new Error('Not a valid MCS level file')
      const version = buf.readUint8(1)
      let level: Level
      switch (version) {
        case 1: {
          const width = buf.readUInt16BE(0x02)
          const height = buf.readUInt16BE(0x04)
          const depth = buf.readUInt16BE(0x06)
          const spawnX = buf.readUInt16BE(0x08)
          const spawnY = buf.readUInt16BE(0x0a)
          const spawnZ = buf.readUInt16BE(0x0c)
          const spawnYaw = buf.readInt8(0x0e)
          const spawnPitch = buf.readInt8(0x0f)
          const nameLength = buf.readUInt16BE(0x10)
          const name = buf.subarray(0x12, 0x12 + nameLength).toString('utf-8')
          const blocks = [...buf.subarray(0x12 + nameLength)]
          // TODO: Validate level data
          level = new Level(
            name,
            width,
            height,
            depth,
            {
              x: spawnX,
              y: spawnY,
              z: spawnZ,
              rotx: spawnYaw,
              roty: spawnPitch
            },
            blocks
          )
          break
        }
        default:
          throw new Error('Not a valid MCS level file version')
      }
      this.#loaded.set(level.name, level)
      return level
    } catch (error) {
      // TODO: Error handling/logging
      console.error(error)
    }

    return
  }

  static async create({
    name,
    width,
    height,
    depth,
    spawn
  }: LevelCreateOptions): Promise<Level> {
    // TODO: If a level with this name already exists, just return it with a warning.
    // TODO: Separate out level generation

    const blocks: number[] = new Array(width * height * depth).fill(
      Block.AIR.id
    ) as number[]
    blocks[0] = blocks[1] = blocks[4] = blocks[5] = Block.GRASS.id
    const lvl = new Level(name, width, height, depth, spawn, blocks)
    await lvl.save()
    return lvl
  }

  private static filenameForLevel(name: string) {
    return `${createHash('md5').update(name).digest('hex')}.mcs`
  }

  private constructor(
    public name: string,
    public width: number,
    public height: number,
    public depth: number,
    readonly spawn: SpawnPosition,
    readonly blocks: number[]
  ) {}

  async save() {
    const mapSize = this.width * this.height * this.depth
    const buffer = Buffer.allocUnsafe(this.name.length + 18 + mapSize)
    buffer.writeUInt8(MCS_MAGIC_NUMBER) // magic number
    buffer.writeUInt8(1, 0x01) // version
    buffer.writeUint16BE(this.width, 0x02)
    buffer.writeUint16BE(this.height, 0x04)
    buffer.writeUint16BE(this.depth, 0x06)
    buffer.writeUint16BE(this.spawn.x, 0x08)
    buffer.writeUint16BE(this.spawn.y, 0x0a)
    buffer.writeUint16BE(this.spawn.z, 0x0c)
    buffer.writeInt8(this.spawn.rotx, 0x0e)
    buffer.writeInt8(this.spawn.roty, 0x0f)
    buffer.writeUInt16BE(this.name.length, 0x10)
    buffer.write(this.name, 0x12, 'utf-8')
    for (let i = 0; i < mapSize; ++i) {
      buffer.writeInt8(this.blocks[i], 0x12 + this.name.length + i)
    }
    const filename = Level.filenameForLevel(this.name)
    const path = join(LEVEL_FOLDER, filename)
    await writeFile(path, buffer)
  }

  async unload() {
    // TODO: Remove all players from map
    Level.#loaded.delete(this.name)
    await this.save()
  }

  blockAt(x: number, y: number, z: number): Block | undefined {
    return Block.allBlocks.get(this.blocks[this.indexAt(x, y, z)])
  }

  private indexAt(x: number, y: number, z: number): number {
    return x * this.height * this.depth + y * this.depth + z
  }
}
