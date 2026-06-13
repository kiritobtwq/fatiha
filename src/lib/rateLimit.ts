const rateLimitMap = new Map<string, { count: number; start: number }>();

export function rateLimit(ip: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };
  
  if (now - entry.start > windowMs) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }
  
  if (entry.count >= limit) {
    return false;
  }
  
  entry.count++;
  rateLimitMap.set(ip, entry);
  return true;
}

export function getRateLimitRemaining(ip: string, limit = 20, windowMs = 60_000): number {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || now - entry.start > windowMs) {
    return limit;
  }
  
  return Math.max(0, limit - entry.count);
}
