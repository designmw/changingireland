/** A single byte range. Ignore unsupported/malformed/multipart Range headers. */
export function byteRange(
  value: string | null,
  size: number
): { offset: number; length: number } | 'unsatisfiable' | null {
  if (!value) return null;
  const match = /^bytes=(\d*)-(\d*)$/i.exec(value.trim());
  if (!match || (!match[1] && !match[2])) return null;
  const start = match[1] ? Number(match[1]) : null;
  const end = match[2] ? Number(match[2]) : null;
  if ((start !== null && !Number.isSafeInteger(start)) || (end !== null && !Number.isSafeInteger(end))) return null;
  if (start === null) {
    if (!end || size === 0) return 'unsatisfiable';
    const length = Math.min(end, size);
    return { offset: size - length, length };
  }
  if (end !== null && end < start) return null;
  if (start >= size) return 'unsatisfiable';
  return { offset: start, length: Math.min(end ?? size - 1, size - 1) - start + 1 };
}

export function etagMatches(value: string | null, etag: string): boolean {
  return !!value && value.split(',').some((tag) => tag.trim() === '*' || tag.trim().replace(/^W\//, '') === etag);
}
