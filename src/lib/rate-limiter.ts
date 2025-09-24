interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class InMemoryRateLimiter {
  private requests = new Map<string, RateLimitEntry>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isRateLimited(identifier: string): { limited: boolean; resetTime?: number } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now >= entry.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return { limited: false };
    }

    if (entry.count >= this.maxRequests) {
      return { limited: true, resetTime: entry.resetTime };
    }

    entry.count++;
    return { limited: false };
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now >= entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

const rateLimiter = new InMemoryRateLimiter(
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5'),
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') // 15 minutes default
);

setInterval(() => {
  rateLimiter.cleanup();
}, 60000); // Cleanup every minute

export function checkRateLimit(identifier: string): { 
  allowed: boolean; 
  resetTime?: number; 
  remaining?: number;
} {
  const result = rateLimiter.isRateLimited(identifier);
  
  if (result.limited) {
    return {
      allowed: false,
      resetTime: result.resetTime
    };
  }

  const entry = rateLimiter['requests'].get(identifier);
  const remaining = rateLimiter['maxRequests'] - (entry?.count || 0);

  return {
    allowed: true,
    remaining: Math.max(0, remaining)
  };
}

export function getRateLimitHeaders(identifier: string): Record<string, string> {
  const entry = rateLimiter['requests'].get(identifier);
  const maxRequests = rateLimiter['maxRequests'];
  const remaining = entry ? Math.max(0, maxRequests - entry.count) : maxRequests;
  const resetTime = entry?.resetTime || Date.now() + rateLimiter['windowMs'];

  return {
    'X-RateLimit-Limit': maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString()
  };
}