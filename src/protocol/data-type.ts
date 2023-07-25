// https://wiki.vg/Classic_Protocol#Protocol_Data_Types

/**
 * Base class for protocol data types
 */
abstract class DataType<T = any> {
    constructor(raw?: Buffer | T, offset?: number) {
        this._value = Buffer.isBuffer(raw) ? this.decode(raw, offset) : this.validate(raw)
    }

    protected readonly _value: T
    get value(): T {
        // Shallow copy arrays and objects, and just return primitives.
        if (typeof this._value === 'object') {
            if (Array.isArray(this._value)) {
                return [...this._value] as T
            }
            return { ...this._value } as T
        }
        return this._value
    }

    protected abstract decode(raw: Buffer, offset?: number): T
    protected abstract validate(val?: T): T 
    abstract toBytes(): Buffer
    abstract get size(): number
}

/**
 * Unsigned byte (0 to 255)
 */
export class Byte extends DataType<number> {
    static get size(): number {
        return 1
    }

    protected decode(raw: Buffer, offset?: number): number {
        return raw.readUInt8(offset)
    }

    protected validate(val: number = 0): number {
        return val
    }

    toBytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size)
        buf.writeUInt8(this._value)
        return buf
    }

    get size(): number {
        return Byte.size
    }
}

/**
 * Signed byte (-128 to 127)
 */
export class SByte extends DataType<number> {
    static get size(): number {
        return 1
    }

    protected decode(raw: Buffer, offset?: number): number {
        return raw.readInt8(offset)
    }

    protected validate(val: number = 0): number {
        return val
    }

    toBytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size)
        buf.writeInt8(this._value)
        return buf
    }

    get size(): number {
        return SByte.size
    }
}

// TODO: Figure out how this type works
// Might work to just use a byte?
/**
 * Signed fixed-point, 5 fractional bits (-4 to 3.96875)
 */
export class FByte extends DataType<number> {
    static get size(): number {
        return 1
    }

    protected decode(raw: Buffer, offset?: number): number {
        throw new Error("Method not implemented.")
    }

    protected validate(val: number = 0): number {
        return val
    }

    toBytes(): Buffer {
        throw new Error("Method not implemented.")
    }

    get size(): number {
        return FByte.size
    }
}

/**
 * Signed integer (-32768 to 32767)
 */
export class Short extends DataType<number> {
    static get size(): number {
        return 2
    }

    protected decode(raw: Buffer, offset?: number): number {
        return raw.readInt16BE(offset)
    }

    protected validate(val: number = 0): number {
        return val
    }

    toBytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size)
        buf.writeInt16BE(this._value)
        return buf
    }

    get size(): number {
        return Short.size
    }
}

// TODO: Figure out how this type works
// Might work to just use a short?
/**
 * Signed fixed-point, 5 fractional bits (-1024 to 1023.96875)
 */
export class FShort extends DataType<number> {
    static get size(): number {
        return 2
    }    

    protected decode(raw: Buffer, offset?: number): number {
        throw new Error("Method not implemented.")
    }

    protected validate(val: number = 0): number {
        return val
    }

    toBytes(): Buffer {
        throw new Error("Method not implemented.")
    }

    get size(): number {
        return FShort.size
    }    
}

/**
 * [US-ASCII/ISO646-US](https://en.wikipedia.org/wiki/ASCII) encoded string padded with spaces (0x20)
 */
export class String extends DataType<string> {
    static get size(): number {
        return 64
    }

    protected decode(raw: Buffer, offset: number = 0): string {
        return raw.subarray(offset, offset + String.size).toString('ascii').padEnd(this.size)
    }

    protected validate(val: string = ''): string {
        return val.substring(0, this.size).padEnd(this.size)
    }

    toBytes(): Buffer {
        return Buffer.from(this._value)
    }

    get size(): number {
        return String.size
    }
}

/**
 * Binary data padded with null bytes (0x00)
 */
export class ByteArray extends DataType<number[]> {
    static get size(): number {
        return 1024
    }

    protected decode(raw: Buffer, offset: number = 0): number[] {
        const bytes = [...raw.subarray(offset, offset + this.size)]
        const arr = new Array(this.size - bytes.length).fill(0x00)
        arr.unshift(...bytes)
        return arr
    }

    protected validate(val: number[] = []): number[] {
        if (val.length === this.size) {
            return val
        }
        const arr = new Array(this.size - val.length).fill(0x00)
        arr.unshift(...val)
        return arr
    }

    toBytes(): Buffer {
        return Buffer.from(this._value)
    }

    get size(): number {
        return ByteArray.size
    }
}
