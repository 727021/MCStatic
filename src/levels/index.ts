import { readFile, writeFile } from 'node:fs/promises'
import { Block } from '../blocks'

type SpawnPosition = {
    x: number
    y: number
    z: number
    rotx: number
    roty: number
}

export class Level {
    static async load(name: string): Promise<Level | undefined> {
        return
    }

    static async create(options: {
        name: string,
        width: number,
        height: number,
        depth: number,
        spawn: SpawnPosition
    }): Promise<Level> {
        // TODO: If a level with this name already exists, just return it.

        const blocks: number[] = new Array(options.width * options.height * options.depth).fill(Block.AIR.id)
        blocks[0] = blocks[1] = blocks[4] = blocks[5] = Block.GRASS.id
        const lvl = new Level(
            options.width,
            options.height,
            options.depth,
            options.spawn,
            blocks
        )
        await lvl.save()
        return lvl
    }

    private constructor(
        public width: number,
        public height: number,
        public depth: number,
        readonly spawn: SpawnPosition,
        readonly blocks: number[]
    ) {}

    async save() {
        const mapSize = this.width * this.height * this.depth
        const buffer = Buffer.allocUnsafe(14 + mapSize)
        buffer.writeUint16BE(this.width)
        buffer.writeUint16BE(this.height, 2)
        buffer.writeUint16BE(this.depth, 4)
        buffer.writeUint16BE(this.spawn.x, 6)
        buffer.writeUint16BE(this.spawn.y, 8)
        buffer.writeUint16BE(this.spawn.z, 10)
        buffer.writeInt8(this.spawn.rotx, 12)
        buffer.writeInt8(this.spawn.roty, 13)
        for (let i = 0; i < mapSize; ++i) {
            buffer.writeInt8(this.blocks[i], 14 + i)
        }
        await writeFile('level.lvl', buffer)
    }

    blockAt(x: number, y: number, z: number): Block | undefined {
        return Block.allBlocks.get(this.blocks[this.indexAt(x, y, z)])
    }

    private indexAt(x: number, y: number, z: number): number {
        return x * this.height * this.depth + y * this.depth + z
    }
}
