/**
 * Binary data reading utilities for F1 23 packet parsing
 * All values are little-endian
 */

/**
 * Read a signed 8-bit integer
 */
export function readInt8(buffer: Buffer, offset: number): number {
  return buffer.readInt8(offset);
}

/**
 * Read an unsigned 8-bit integer
 */
export function readUInt8(buffer: Buffer, offset: number): number {
  return buffer.readUInt8(offset);
}

/**
 * Read a signed 16-bit integer (little-endian)
 */
export function readInt16LE(buffer: Buffer, offset: number): number {
  return buffer.readInt16LE(offset);
}

/**
 * Read an unsigned 16-bit integer (little-endian)
 */
export function readUInt16LE(buffer: Buffer, offset: number): number {
  return buffer.readUInt16LE(offset);
}

/**
 * Read a signed 32-bit integer (little-endian)
 */
export function readInt32LE(buffer: Buffer, offset: number): number {
  return buffer.readInt32LE(offset);
}

/**
 * Read an unsigned 32-bit integer (little-endian)
 */
export function readUInt32LE(buffer: Buffer, offset: number): number {
  return buffer.readUInt32LE(offset);
}

/**
 * Read a 64-bit unsigned integer (little-endian) as BigInt
 */
export function readUInt64LE(buffer: Buffer, offset: number): bigint {
  // Read as two 32-bit values and combine
  const low = BigInt(buffer.readUInt32LE(offset));
  const high = BigInt(buffer.readUInt32LE(offset + 4));
  return (high << BigInt(32)) | low;
}

/**
 * Read a 32-bit float (little-endian)
 */
export function readFloatLE(buffer: Buffer, offset: number): number {
  return buffer.readFloatLE(offset);
}

/**
 * Read a fixed-length string
 */
export function readString(buffer: Buffer, offset: number, length: number): string {
  return buffer.toString('utf8', offset, offset + length).replace(/\0/g, '').trim();
}

/**
 * Read an array of values using a reader function
 */
export function readArray<T>(
  buffer: Buffer,
  offset: number,
  count: number,
  elementSize: number,
  reader: (buf: Buffer, off: number) => T
): T[] {
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(reader(buffer, offset + i * elementSize));
  }
  return result;
}
