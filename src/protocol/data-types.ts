/**
 * https://wiki.vg/Classic_Protocol#Protocol_Data_Types
 */

/**
 * Unsigned byte (0 to 255)
 */
export class Byte {
  static readonly MIN = 0
  static readonly MAX = 255
  static readonly SIZE = 1
  static get DEFAULT() {
    return 0
  }
  static isValid(value: number) {
    return value >= this.MIN && value < this.MAX
  }

  private constructor() {
    /**/
  }
}

/**
 * Signed byte (-128 to 127)
 */
export class SByte {
  static readonly MIN = -128
  static readonly MAX = 127
  static readonly SIZE = 1
  static get DEFAULT() {
    return 0
  }
  static isValid(value: number) {
    return value >= this.MIN && value < this.MAX
  }

  private constructor() {
    /**/
  }
}

/**
 * Signed fixed-point, 5 fractional bits (-4 to 3.96875)
 */
export class FByte {
  static readonly MIN = -4
  static readonly MAX = 3.96875
  static readonly SIZE = 1
  static get DEFAULT() {
    return 0
  }
  static isValid(value: number) {
    return value >= this.MIN && value < this.MAX
  }

  private constructor() {
    /**/
  }
}

/**
 * Signed integer (-32768 to 32767)
 */
export class Short {
  static readonly MIN = -32768
  static readonly MAX = 32767
  static readonly SIZE = 2
  static get DEFAULT() {
    return 0
  }
  static isValid(value: number) {
    return value >= this.MIN && value < this.MAX
  }

  private constructor() {
    /**/
  }
}

/**
 * Signed fixed-point, 5 fractional bits (-1024 to 1023.96875)
 */
export class FShort {
  static readonly MIN = -1024
  static readonly MAX = 1023.96875
  static readonly SIZE = 2
  static get DEFAULT() {
    return 0
  }
  static isValid(value: number) {
    return value >= this.MIN && value < this.MAX
  }

  private constructor() {
    /**/
  }
}

/**
 * [US-ASCII/ISO646-US](https://en.wikipedia.org/wiki/ASCII) encoded string padded with spaces (0x20)
 */
export class String {
  static readonly SIZE = 64
  static get DEFAULT() {
    return ''.padEnd(this.SIZE)
  }
  static isValid(value: string, allowEmpty = false) {
    return (
      (!!value.trimEnd().length || allowEmpty) &&
      value.trimEnd().length <= this.SIZE
    )
  }

  private constructor() {
    /**/
  }
}

/**
 * Binary data padded with null bytes (0x00)
 */
export class ByteArray {
  static readonly SIZE = 1024
  static get DEFAULT() {
    return new Array(this.SIZE).fill(0x00) as number[]
  }
  static isValid(value: number[], allowEmpty = false) {
    const endIndex = value.findLastIndex(x => x !== 0x00)
    return (
      (allowEmpty || (value.length > 0 && endIndex > 0)) && endIndex < this.SIZE
    )
  }

  private constructor() {
    /**/
  }
}
