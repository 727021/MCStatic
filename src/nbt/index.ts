import { readFile } from 'fs/promises'
import { promisify } from 'util'
import { gunzip } from 'zlib'

enum TagType {
  END = 0,
  BYTE = 1,
  SHORT = 2,
  INT = 3,
  LONG = 4,
  FLOAT = 5,
  DOUBLE = 6,
  BYTE_ARRAY = 7,
  STRING = 8,
  LIST = 9,
  COMPOUND = 10,
  INT_ARRAY = 11,
  LONG_ARRAY = 12
}

type NBTTagRaw = {
  start: number
  end: number
  tag: {
    typeId: TagType
    name?: string
    payload?:
      | number
      | string
      | bigint
      | number[]
      | bigint[]
      | NBTTagRaw[]
      | { [key: string]: NBTTagRaw }
  }
}

type NBTTag = {
  typeId: TagType
  name?: string
  payload?:
    | number
    | string
    | bigint
    | number[]
    | bigint[]
    | NBTTag[]
    | { [key: string]: NBTTag }
}

const readTag = (
  buf: Buffer,
  start = 0,
  typeId: number | undefined = undefined
): NBTTagRaw => {
  let offset = start
  let named = false
  if (typeId === undefined) {
    // if a typeId is passed in, this tag is in a list, and therefore has no name.
    // if a typeId is not passed in, this tag includes a name and typeId.
    typeId = buf.readInt8(offset)
    offset += 1
    named = true
  }
  switch (typeId) {
    case TagType.END: {
      const end = start + 1
      return {
        start,
        end,
        tag: {
          typeId
        }
      }
    }
    case TagType.BYTE: {
      if (!named) {
        const payload = buf.readInt8(offset)
        return {
          start,
          end: offset + 1,
          tag: {
            typeId,
            payload
          }
        }
      }
      const nameLength = buf.readUInt16BE(offset)
      const name = buf
        .subarray(offset + 2, offset + 2 + nameLength)
        .toString('utf-8')
      const payload = buf.readInt8(offset + 2 + nameLength)
      const end = offset + 2 + nameLength + 1
      return {
        start,
        end,
        tag: {
          typeId,
          name,
          payload
        }
      }
    }
    case TagType.SHORT: {
      if (!named) {
        const payload = buf.readInt16BE(offset)
        return {
          start,
          end: offset + 2,
          tag: {
            typeId,
            payload
          }
        }
      }
      const nameLength = buf.readUInt16BE(offset)
      const name = buf
        .subarray(offset + 2, offset + 2 + nameLength)
        .toString('utf-8')
      const payload = buf.readInt16BE(offset + 2 + nameLength)
      const end = offset + 2 + nameLength + 2
      return {
        start,
        end,
        tag: {
          typeId,
          name,
          payload
        }
      }
    }
    case TagType.INT: {
      if (!named) {
        const payload = buf.readInt32BE(offset)
        return {
          start,
          end: offset + 4,
          tag: {
            typeId,
            payload
          }
        }
      }
      const nameLength = buf.readUInt16BE(offset)
      const name = buf
        .subarray(offset + 2, offset + 2 + nameLength)
        .toString('utf-8')
      const payload = buf.readInt32BE(offset + 2 + nameLength)
      const end = offset + 2 + nameLength + 4
      return {
        start,
        end,
        tag: {
          typeId,
          name,
          payload
        }
      }
    }
    case TagType.LONG: {
      if (!named) {
        const payload = buf.readBigInt64BE(offset)
        return {
          start,
          end: offset + 8,
          tag: {
            typeId,
            payload
          }
        }
      }
      const nameLength = buf.readUInt16BE(offset)
      const name = buf
        .subarray(offset + 2, offset + 2 + nameLength)
        .toString('utf-8')
      const payload = buf.readBigInt64BE(offset + 2 + nameLength)
      const end = offset + 2 + nameLength + 8
      return {
        start,
        end,
        tag: {
          typeId,
          name,
          payload
        }
      }
    }
    case TagType.FLOAT: {
      if (!named) {
        const payload = buf.readFloatBE(offset)
        return {
          start,
          end: offset + 4,
          tag: {
            typeId,
            payload: isNaN(payload) ? 0 : payload
          }
        }
      }
      const nameLength = buf.readUInt16BE(offset)
      const name = buf
        .subarray(offset + 2, offset + 2 + nameLength)
        .toString('utf-8')
      const payload = buf.readFloatBE(offset + 2 + nameLength)
      const end = offset + 2 + nameLength + 4
      return {
        start,
        end,
        tag: {
          typeId,
          name,
          payload: isNaN(payload) ? 0 : payload
        }
      }
    }
    case TagType.DOUBLE: {
      if (!named) {
        const payload = buf.readDoubleBE(offset)
        return {
          start,
          end: offset + 8,
          tag: {
            typeId,
            payload: isNaN(payload) ? 0 : payload
          }
        }
      }
      const nameLength = buf.readUInt16BE(offset)
      const name = buf
        .subarray(offset + 2, offset + 2 + nameLength)
        .toString('utf-8')
      const payload = buf.readDoubleBE(offset + 2 + nameLength)
      const end = offset + 2 + nameLength + 8
      return {
        start,
        end,
        tag: {
          typeId,
          name,
          payload: isNaN(payload) ? 0 : payload
        }
      }
    }
    case TagType.BYTE_ARRAY: {
      if (!named) {
        const length = buf.readInt32BE(offset)
        const payload = []
        for (let i = 0; i < length; ++i) {
          payload.push(buf.readInt8(offset + 4 + i))
        }
        return {
          start,
          end: offset + 4 + length,
          tag: {
            typeId,
            payload
          }
        }
      }
      const nameLength = buf.readUInt16BE(offset)
      const name = buf
        .subarray(offset + 2, offset + 2 + nameLength)
        .toString('utf-8')
      const length = buf.readInt32BE(offset + 2 + nameLength)
      const payload = []
      for (let i = 0; i < length; ++i) {
        payload.push(buf.readInt8(offset + 2 + nameLength + 4 + i))
      }
      const end = offset + 2 + nameLength + 4 + length
      return {
        start,
        end,
        tag: {
          typeId,
          name,
          payload
        }
      }
    }
    case TagType.STRING: {
      if (!named) {
        const length = buf.readUInt16BE(offset)
        const payload = buf
          .subarray(offset + 2, offset + 2 + length)
          .toString('utf-8')
        return {
          start,
          end: offset + 2 + length,
          tag: {
            typeId,
            payload
          }
        }
      }
      const nameLength = buf.readUInt16BE(offset)
      const name = buf
        .subarray(offset + 2, offset + 2 + nameLength)
        .toString('utf-8')
      const length = buf.readUInt16BE(offset + 2 + nameLength)
      const payload = buf
        .subarray(
          offset + 2 + nameLength + 2,
          offset + 2 + nameLength + 2 + length
        )
        .toString('utf-8')
      const end = offset + 2 + nameLength + 2 + length
      return {
        start,
        end,
        tag: {
          typeId,
          name,
          payload
        }
      }
    }
    case TagType.LIST: {
      if (!named) {
        const tagType = buf.readInt8(offset)
        const length = buf.readInt32BE(offset + 1)
        if (tagType === TagType.END && length > 0) {
          throw new Error(`NBTError: Invalid list tag at ${offset}`)
        }
        const payload: NBTTagRaw[] = []
        for (let i = 0; i < length; ++i) {
          payload.push(readTag(buf, payload.at(-1)?.end ?? offset + 5, tagType))
        }
        return {
          start,
          end: payload.at(-1)?.end ?? offset + 5,
          tag: {
            typeId,
            payload
          }
        }
      }
      const nameLength = buf.readUInt16BE(offset)
      const name = buf
        .subarray(offset + 2, offset + 2 + nameLength)
        .toString('utf-8')
      const tagType = buf.readInt8(offset + 2 + nameLength)
      const length = buf.readInt32BE(offset + 2 + nameLength + 1)
      if (tagType === TagType.END && length > 0) {
        throw new Error(`NBTError: Invalid list tag at ${start}`)
      }
      const payload: NBTTagRaw[] = []
      for (let i = 0; i < length; ++i) {
        payload.push(
          readTag(
            buf,
            payload.at(-1)?.end ?? offset + 2 + nameLength + 5,
            tagType
          )
        )
      }
      return {
        start,
        end: payload.at(-1)?.end ?? offset + 2 + nameLength + 5,
        tag: {
          typeId,
          name,
          payload
        }
      }
    }
    case TagType.COMPOUND: {
      if (!named) {
        const payload: { [key: string]: NBTTagRaw } = {}
        let prevTag
        // eslint-disable-next-line no-constant-condition
        while (true) {
          prevTag = readTag(buf, prevTag?.end ?? offset)
          if (prevTag?.tag?.typeId === TagType.END) {
            return {
              start,
              end: prevTag?.end,
              tag: {
                typeId,
                payload
              }
            }
          }
          if (!prevTag?.tag?.name) {
            throw new Error(
              `NBTError: Nameless tag in compound tag at ${start}`
            )
          }
          if (prevTag?.tag?.name in payload) {
            throw new Error(
              `NBTError: Duplicate tag name '${prevTag.tag.name}' in compound tag at ${start}`
            )
          }
          payload[prevTag.tag.name] = prevTag
        }
      }
      const nameLength = buf.readUInt16BE(offset)
      const name = buf
        .subarray(offset + 2, offset + 2 + nameLength)
        .toString('utf-8')
      const payload: { [key: string]: NBTTagRaw } = {}
      let prevTag
      // eslint-disable-next-line no-constant-condition
      while (true) {
        prevTag = readTag(buf, prevTag?.end ?? offset + 2 + nameLength)
        if (prevTag?.tag?.typeId === TagType.END) {
          return {
            start,
            end: prevTag?.end,
            tag: {
              typeId,
              name,
              payload
            }
          }
        }
        if (!prevTag?.tag?.name) {
          throw new Error(`NBTError: Nameless tag in compound tag at ${start}`)
        }
        if (prevTag?.tag?.name in payload) {
          throw new Error(
            `NBTError: Duplicate tag name '${prevTag.tag.name}' in compound tag at ${start}`
          )
        }
        payload[prevTag.tag.name] = prevTag
      }
    }
    case TagType.INT_ARRAY: {
      if (!named) {
        const length = buf.readInt32BE(offset)
        const payload = []
        for (let i = 0; i < length; ++i) {
          payload.push(buf.readInt32BE(offset + 4 + i * 4))
        }
        return {
          start,
          end: offset + 4 + length * 4,
          tag: {
            typeId,
            payload
          }
        }
      }
      const nameLength = buf.readUInt16BE(offset)
      const name = buf
        .subarray(offset + 2, offset + 2 + nameLength)
        .toString('utf-8')
      const length = buf.readInt32BE(offset + 2 + nameLength)
      const payload = []
      for (let i = 0; i < length; ++i) {
        payload.push(buf.readInt32BE(offset + 2 + nameLength + 4 + i * 4))
      }
      const end = offset + 2 + nameLength + 4 + length * 4
      return {
        start,
        end,
        tag: {
          typeId,
          name,
          payload
        }
      }
    }
    case TagType.LONG_ARRAY: {
      if (!named) {
        const length = buf.readInt32BE(offset)
        const payload = []
        for (let i = 0; i < length; ++i) {
          payload.push(buf.readBigInt64BE(offset + 4 + i * 8))
        }
        return {
          start,
          end: offset + 4 + length * 8,
          tag: {
            typeId,
            payload
          }
        }
      }
      const nameLength = buf.readUInt16BE(offset)
      const name = buf
        .subarray(offset + 2, offset + 2 + nameLength)
        .toString('utf-8')
      const length = buf.readInt32BE(offset + 2 + nameLength)
      const payload = []
      for (let i = 0; i < length; ++i) {
        payload.push(buf.readBigInt64BE(offset + 2 + nameLength + 4 + i * 8))
      }
      const end = offset + 2 + nameLength + 4 + length * 8
      return {
        start,
        end,
        tag: {
          typeId,
          name,
          payload
        }
      }
    }
  }
  throw new Error(`NBTError: Invalid tag type id '${typeId}' at ${start}`)
}

const isGzipped = (buf: Buffer) => buf[0] === 0x1f && buf[1] === 0x8b

const normalizeNBT = (raw: NBTTagRaw): NBTTag => {
  switch (raw.tag.typeId) {
    case TagType.LIST:
      return {
        ...raw.tag,
        payload: (raw.tag.payload as NBTTagRaw[]).map(tag => normalizeNBT(tag))
      }
    case TagType.COMPOUND:
      return {
        ...raw.tag,
        payload: Object.entries(
          raw.tag.payload as { [key: string]: NBTTagRaw }
        ).reduce(
          (acc, [key, val]) => ({
            ...acc,
            [key]: normalizeNBT(val)
          }),
          {}
        )
      }
  }

  return raw.tag as NBTTag
}

export const read = async (path: string): Promise<NBTTag> => {
  const file = await readFile(path)
  const nbtBuffer = isGzipped(file) ? await promisify(gunzip)(file) : file
  const nbtRaw = readTag(nbtBuffer)
  const nbt = normalizeNBT(nbtRaw)
  return nbt
}
