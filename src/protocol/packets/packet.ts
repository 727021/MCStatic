import { Byte, String } from ".."

const PROTOCOL_VERSION = 0x07

type PacketConstructorOptions = { raw?: Buffer }

abstract class Packet {
    constructor({ raw }: PacketConstructorOptions = {}) {
        if (raw) {
            if (raw.length !== this.size()) {
                throw new Error('')
            }
            const id = new Byte(raw.readUInt8())
            if (id.value !== this.id().value) {
                throw new Error('')
            }
            const buf = raw.subarray(1)
            this.decode(buf)
        }
    }

    /**
     * Single-byte id for this type of packet
     */
    abstract id(): Byte
    /**
     * The size of this packet in bytes, including the id
     */
    abstract size(): number
    /**
     * @param raw The raw bytes for this packet, with the first byte (packet id) removed
     */
    abstract decode(raw: Buffer): void
    abstract toBytes(): Buffer
}

type PlayerIdentificationConstructorOptions = PacketConstructorOptions & {
    username?: string,
    verificationKey?: string
}
export class PlayerIdentification extends Packet {
    #username!: String
    get username() {
        return this.#username
    }
    #verificationKey!: String
    get verificationKey() {
        return this.#verificationKey
    }

    constructor(options: PlayerIdentificationConstructorOptions) {
        super(options)
        if (!options.raw) {
            this.#username = new String(options.username)
            this.#verificationKey = new String(options.verificationKey)
        }
    }

    id(): Byte {
        return new Byte(0x00)
    }
    size(): number {
        return Byte.size + Byte.size + String.size + String.size + Byte.size
    }
    decode(raw: Buffer): void {
        const protocolVersion = new Byte(raw)
        if (protocolVersion.value !== PROTOCOL_VERSION) {
            throw new Error(`Invalid protocol version (${protocolVersion.value})`)
        }
        this.#username = new String(raw, Byte.size)
        this.#verificationKey = new String(raw, Byte.size + String.size)
    }
    toBytes(): Buffer {
        return Buffer.concat([
            this.id().toBytes(),
            new Byte(PROTOCOL_VERSION).toBytes(),
            this.username.toBytes(),
            this.verificationKey.toBytes(),
            new Byte().toBytes() // unused
        ])
    }

}
