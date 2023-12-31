import { join } from 'node:path'

export const PROTOCOL_VERSION = 0x07
export const MCS_MAGIC_NUMBER = 0x72
export const LEVEL_FOLDER = join(process.cwd(), 'data', 'levels')

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

export enum PacketType {
  IDENTIFICATION = 0x00,
  PING = 0x01,
  LEVEL_INITIALIZE = 0x02,
  LEVEL_DATA_CHUNK = 0x03,
  LEVEL_FINALIZE = 0x04,
  SET_BLOCK_CLIENT = 0x05,
  SET_BLOCK_SERVER = 0x06,
  SPAWN_PLAYER = 0x07,
  SET_POSITION_AND_ORIENTATION = 0x08,
  POSITION_AND_ORIENTATION_UPDATE = 0x09,
  POSITION_UPDATE = 0x0a,
  ORIENTATION_UPDATE = 0x0b,
  DESPAWN_PLAYER = 0x0c,
  MESSAGE = 0x0d,
  DISCONNECT_PLAYER = 0x0e,
  UPDATE_USER_TYPE = 0x0f
}
