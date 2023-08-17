type BlockPropertiesOptions = {
  isTransparent?: boolean
  hasCollision?: boolean
  showAsBlock?: Block
}

export class BlockProperties {
  //#region Presets
  static readonly DEFAULT = new BlockProperties()
  static readonly PLANT = new BlockProperties({
    hasCollision: false,
    isTransparent: true
  })
  //#endregion

  readonly isTransparent: boolean
  readonly hasCollision: boolean
  readonly showAsBlock?: Block

  constructor({
    isTransparent = false,
    hasCollision = true,
    showAsBlock
  }: BlockPropertiesOptions = {}) {
    this.isTransparent = isTransparent
    this.hasCollision = hasCollision
    this.showAsBlock = showAsBlock
  }
}

export class Block {
  static #allBlocks = new Map<number, Block>()
  static get allBlocks() {
    return this.#allBlocks as ReadonlyMap<number, Block>
  }

  static register(
    id: number,
    name: string,
    properties?: BlockProperties
  ): Block | undefined {
    try {
      return new Block(id, name, properties)
    } catch {
      /**/
    }
  }

  static find(id?: number) {
    if (id === undefined) {
      return
    }
    return this.allBlocks.get(id)
  }

  //#region Block definitions
  // Core blocks are defined first, so they will never have duplicate ids and therefore will never be undefined.
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  static readonly AIR = Block.register(
    0,
    'block.air',
    new BlockProperties({ hasCollision: false, isTransparent: true })
  )!
  static readonly STONE = Block.register(1, 'block.stone')!
  static readonly GRASS = Block.register(2, 'block.grass')!
  static readonly DIRT = Block.register(3, 'block.dirt')!
  static readonly COBBLESTONE = Block.register(4, 'block.cobblestone')!
  static readonly PLANKS = Block.register(5, 'block.planks')!
  static readonly SAPLING = Block.register(
    6,
    'block.sapling',
    BlockProperties.PLANT
  )!
  static readonly BEDROCK = Block.register(7, 'block.bedrock')!
  static readonly FLOWING_WATER = Block.register(
    8,
    'block.flowing_water',
    new BlockProperties({ hasCollision: false, isTransparent: true })
  )!
  static readonly STATIONARY_WATER = Block.register(
    9,
    'block.stationary_water',
    new BlockProperties({ hasCollision: false, isTransparent: true })
  )!
  static readonly FLOWING_LAVA = Block.register(
    10,
    'block.flowing_lava',
    new BlockProperties({ hasCollision: false, isTransparent: true })
  )!
  static readonly STATIONARY_LAVA = Block.register(
    11,
    'block.stationary_lava',
    new BlockProperties({ hasCollision: false, isTransparent: true })
  )!
  static readonly SAND = Block.register(12, 'block.sand')!
  static readonly GRAVEL = Block.register(13, 'block.gravel')!
  static readonly GOLD_ORE = Block.register(14, 'block.gold_ore')!
  static readonly IRON_ORE = Block.register(15, 'block.iron_ore')!
  static readonly COAL_ORE = Block.register(16, 'block.coal_ore')!
  static readonly WOOD = Block.register(17, 'block.wood')!
  static readonly LEAVES = Block.register(
    18,
    'block.leaves',
    new BlockProperties({ hasCollision: true, isTransparent: true })
  )!
  static readonly SPONGE = Block.register(19, 'block.sponge')!
  static readonly GLASS = Block.register(
    20,
    'block.glass',
    new BlockProperties({ hasCollision: true, isTransparent: true })
  )!
  static readonly RED_WOOL = Block.register(21, 'block.red_wool')!
  static readonly ORANGE_WOOL = Block.register(22, 'block.orange_wool')!
  static readonly YELLOW_WOOL = Block.register(23, 'block.yellow_wool')!
  static readonly LIGHT_GREEN_WOOL = Block.register(
    24,
    'block.light_green_wool'
  )!
  static readonly GREEN_WOOL = Block.register(25, 'block.green_wool')!
  static readonly AQUA_WOOL = Block.register(26, 'block.aqua_wool')!
  static readonly CYAN_WOOL = Block.register(27, 'block.cyan_wool')!
  static readonly LIGHT_BLUE_WOOL = Block.register(28, 'block.light_blue_wool')!
  static readonly BLUE_WOOL = Block.register(29, 'block.blue_wool')!
  static readonly PURPLE_WOOL = Block.register(30, 'block.purple_wool')!
  static readonly LIGHT_PURPLE_WOOL = Block.register(
    31,
    'block.light_purple_wool'
  )!
  static readonly PINK_WOOL = Block.register(32, 'block.pink_wool')!
  static readonly DARK_PINK_WOOL = Block.register(33, 'block.dark_pink_wool')!
  static readonly DARK_GRAY_WOOL = Block.register(34, 'block.dark_gray_wool')!
  static readonly LIGHT_GRAY_WOOL = Block.register(35, 'block.light_gray_wool')!
  static readonly WHITE_WOOL = Block.register(36, 'block.white_wool')!
  static readonly FLOWER = Block.register(
    37,
    'block.flower',
    BlockProperties.PLANT
  )!
  static readonly ROSE = Block.register(
    38,
    'block.rose',
    BlockProperties.PLANT
  )!
  static readonly BROWN_MUSHROOM = Block.register(
    39,
    'block.brown_mushroom',
    BlockProperties.PLANT
  )!
  static readonly RED_MUSHROOM = Block.register(
    40,
    'block.red_mushroom',
    BlockProperties.PLANT
  )!
  static readonly GOLD_BLOCK = Block.register(41, 'block.gold_block')!
  static readonly IRON_BLOCK = Block.register(42, 'block.iron_block')!
  static readonly DOUBLE_SLAB = Block.register(43, 'block.double_slab')!
  static readonly SLAB = Block.register(44, 'block.slab')!
  static readonly BRICKS = Block.register(45, 'block.bricks')!
  static readonly TNT = Block.register(46, 'block.tnt')!
  static readonly BOOKSHELF = Block.register(47, 'block.bookshelf')!
  static readonly MOSSY_COBBLESTONE = Block.register(
    48,
    'block.mossy_cobblestone'
  )!
  static readonly OBSIDIAN = Block.register(49, 'block.obsidian')!
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
  //#endregion

  private constructor(
    readonly id: number,
    readonly name: string,
    readonly properties: BlockProperties = BlockProperties.DEFAULT
  ) {
    if (Block.#allBlocks.has(id)) {
      // TODO: Actual error logging
      throw new Error('error.block.duplicate_id')
    }
    Block.#allBlocks.set(id, this)
  }

  get shownAs(): Block {
    return this.properties.showAsBlock ?? this
  }
}
