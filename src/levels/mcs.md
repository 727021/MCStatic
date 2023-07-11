# .MCS Level File Format

MCStatic level files use a .mcs file extension and are stored in the following format. File names are an md5 hash of the human-readable level name.

Offset | Size | Type | Description
--|--|--|--
0x00 | 1 | Unsigned Byte | Magic number for mcs level files (`0x72`)
0x01 | 1 | Unsigned Byte | File format version (`0x01`)
0x02 | 2 | Unsigned 16-bit Integer | Level width (x)
0x04 | 2 | Unsigned 16-bit Integer | Level height (y)
0x06 | 2 | Unsigned 16-bit Integer | Level depth (z)
0x08 | 2 | Unsigned 16-bit Integer | Level spawn x
0x0a | 2 | Unsigned 16-bit Integer | Level spawn y
0x0c | 2 | Unsigned 16-bit Integer | Level spawn z
0x0e | 1 | Byte | Level rot x (yaw)
0x0f | 1 | Byte | Level rot y (pitch)
0x10 | 2 | Unsigned 16-bit Integer | Level name length in characters
0x12 | Variable | UTF-8 String | Level name
Variable | Variable (Level width * Level height * Level depth) | Byte array | Array of block ids