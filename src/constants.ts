export const PROTOCOL_VERSION = 0x07

export enum PacketDirection {
    SERVER_TO_CLIENT,
    CLIENT_TO_SERVER
}

export enum PlayerType {
    NORMAL = 0x00,
    OP = 0x64
}

export enum BlockChangeMode {
    DESTROY = 0x00,
    CREATE = 0x01
}
