export abstract class DataType<T = any> {
    constructor(raw: Buffer | T) {
        this._value = raw instanceof Buffer ? this.decode(raw) : raw
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

    protected abstract decode(raw: Buffer): T
    abstract toBytes(): Buffer
    abstract get size(): number
}

export class Byte extends DataType<number> {
    protected decode(raw: Buffer): number {
        return raw.readUInt8()
    }

    toBytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size)
        buf.writeUInt8(this._value)
        return buf
    }

    get size(): number {
        return 1
    }
}

export class SByte extends DataType<number> {
    protected decode(raw: Buffer): number {
        return raw.readInt8()
    }

    toBytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size)
        buf.writeInt8(this._value)
        return buf
    }

    get size(): number {
        return 1
    }
}

// Not required. Might implement later.
export class FByte extends DataType<number> {
    protected decode(raw: Buffer): number {
        throw new Error("Method not implemented.")
    }

    toBytes(): Buffer {
        throw new Error("Method not implemented.")
    }

    get size(): number {
        return 1
    }
}

export class Short extends DataType<number> {
    protected decode(raw: Buffer): number {
        return raw.readInt16BE()
    }

    toBytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size)
        buf.writeInt16BE(this._value)
        return buf
    }

    get size(): number {
        return 2
    }
}

// TODO: Figure out how this type works
export class FShort extends DataType<number> {
    protected decode(raw: Buffer): number {
        throw new Error("Method not implemented.")
    }

    toBytes(): Buffer {
        throw new Error("Method not implemented.")
    }

    get size(): number {
        return 2
    }    
}

export class String extends DataType<string> {
    protected decode(raw: Buffer): string {
        return raw.toString('ascii').trim()
    }
    toBytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size)
        buf.fill(' ')
        Buffer.from(this._value).copy(buf)
        return buf
    }
    get size(): number {
        return 64
    }
}

export class ByteArray extends DataType<number[]> {
    protected decode(raw: Buffer): number[] {
        // TODO: Trim null padding?
        return [...raw]
    }

    toBytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size)
        buf.fill(0)
        Buffer.from(this._value).copy(buf)
        return buf
    }

    get size(): number {
        return 1024
    }
}
