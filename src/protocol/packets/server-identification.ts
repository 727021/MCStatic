import { ServerPacket, ServerPacketConstructorOptions } from '.'
import { Byte, String } from '..'
import { PROTOCOL_VERSION, PlayerType } from '../../constants'

type ServerIdentificationConstructorOptions = ServerPacketConstructorOptions<{
  serverName: string
  serverMotd: string
  playerType: PlayerType
}>

/**
 * Response to a joining player.
 * The user type indicates whether a player is an op (0x64) or not (0x00) which decides if the player can delete bedrock.
 * The protocol version is 0x07, unless you're using a client below 0.28.
 */
export class ServerIdentification extends ServerPacket {
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

  constructor({
    serverName,
    serverMotd,
    playerType
  }: ServerIdentificationConstructorOptions) {
    super()
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
