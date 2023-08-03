import { Packet, PacketConstructorOptions } from '..';
import { Byte, String } from '../..';
import { PROTOCOL_VERSION } from '../../../constants';

enum PlayerType {
  NORMAL = 0x00,
  OP = 0x64
}

type ServerIdentificationConstructorOptions = PacketConstructorOptions<{
  serverName: string,
  serverMotd: string,
  playerType: PlayerType
}>

/**
 * Response to a joining player.
 * The user type indicates whether a player is an op (0x64) or not (0x00) which decides if the player can delete bedrock.
 * The protocol version is 0x07, unless you're using a client below 0.28.
 */
export class ServerIdentification extends Packet {
  #serverName!: string
  get serverName() {
    return this.#serverName
  }
  #serverMotd!: string
  get serverMotd() {
    return this.#serverMotd
  }
  #playerType!: PlayerType
  get playerType() {
    return this.#playerType
  }

  constructor({ raw, serverName, serverMotd, playerType }: ServerIdentificationConstructorOptions) {
    super({ raw })
    if (!raw) {
      if (serverName === undefined || !String.isValid(serverName)) {
        throw new Error('Invalid serverName')
      }
      this.#serverName = serverName
      if (serverMotd === undefined || !String.isValid(serverMotd)) {
        throw new Error('Invalid serverMotd')
      }
      this.#serverMotd = serverMotd
      if (playerType === undefined || !(playerType in PlayerType)) {
        throw new Error('Invalid playerType')
      }
      this.#playerType = playerType
    } else {
      const protocolVersion = this.reader.readByte(Byte.SIZE)
      if (protocolVersion !== PROTOCOL_VERSION) {
        throw new Error('Invalid protocol version')
      }
      this.#serverName = this.reader.readString(Byte.SIZE + Byte.SIZE)
      this.#serverMotd = this.reader.readString(Byte.SIZE + Byte.SIZE + String.SIZE)
      const playerType = this.reader.readByte(Byte.SIZE + Byte.SIZE + String.SIZE + String.SIZE)
      if (!(playerType in PlayerType)) {
        throw new Error('Invalid playerType')
      }
      this.#playerType = playerType
    }
  }

  id(): number {
    return 0x00
  }
  size(): number {
    return Byte.SIZE + Byte.SIZE + String.SIZE + String.SIZE + Byte.SIZE
  }
  toBytes(): Buffer {
    return this.writer
      .writeByte(this.id())
      .writeByte(PROTOCOL_VERSION)
      .writeString(this.serverName)
      .writeString(this.serverMotd)
      .writeByte(this.playerType)
      .build()
  }
}
