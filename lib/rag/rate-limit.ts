const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 12, windowMs = 60_000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const recent = (hits.get(key) ?? []).filter((time) => time > windowStart);

  if (recent.length >= limit) {
    return false;
  }

  recent.push(now);
  hits.set(key, recent);
  return true;
}
