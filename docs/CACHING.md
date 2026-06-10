# Caching Strategy - Quizora Backend

## Overview
Redis is integrated as a multi-purpose caching and session store for the Quizora backend. This document outlines the caching strategy, cache keys, TTL values, and invalidation patterns.

## Architecture

### Components
1. **Redis Connection** (`src/db/redis.ts`)
   - Initializes and manages the Redis client
   - Handles connection lifecycle and error management

2. **Cache Utility** (`src/utils/cache.util.ts`)
   - Generic cache operations (get, set, invalidate)
   - Pattern-based invalidation for bulk operations
   - `withCache()` wrapper for transparent caching

3. **Session Service** (`src/services/session.service.ts`)
   - Redis-backed session storage
   - Creates and destroys user sessions
   - Manages session TTL and refresh

4. **Service Integration**
   - Quiz Service: Caches quiz data and listings
   - User Service: Caches user profiles
   - Quiz History Service: Caches quiz attempt records

## Cache Keys and TTL

### Quiz Cache
| Key Pattern | TTL | Description |
|---|---|---|
| `quiz:list:{page}:{query}` | 30 min | Quiz listing with pagination and search |
| `quiz:{id}` | 30 min | Individual quiz details |

**Invalidation:** `invalidateCachePattern('quiz:*')` on quiz create/update/delete

### User Cache
| Key Pattern | TTL | Description |
|---|---|---|
| `user:{userId}` | 15 min | User profile data |
| `user:email:{email}` | 15 min | User lookup by email |

**Invalidation:** 
- `invalidateCache('user:{userId}')` on profile updates
- `invalidateCache('user:email:{email}')` on email changes

### Quiz History Cache
| Key Pattern | TTL | Description |
|---|---|---|
| `history:{userId}` | 10 min | User's quiz attempt history |

**Invalidation:** `invalidateCache('history:{userId}')` after new quiz submission

### Session Cache
| Key Pattern | TTL | Description |
|---|---|---|
| `session:{sessionId}` | 24 hours | User session data |

**Session Data Structure:**
```typescript
{
  userId: string;
  role: string;
  createdAt: string; // ISO timestamp
}
```

## Invalidation Patterns

### Automatic (Built-in)
- TTL-based expiry: Cached data automatically expires after the configured TTL
- Session refresh: Sessions are automatically extended on authenticated requests

### Manual (Event-based)
- **Quiz History Write:** `postNewQuizHistory()` → invalidate `history:{userId}`
- **User Profile Updates:** Any user update → invalidate `user:{userId}` and `user:email:{email}`
- **Quiz Updates:** Any quiz create/update/delete → invalidate `quiz:*`

## Configuration

### Environment Variables
```env
# Redis Connection
REDIS_URL=redis://localhost:6379

# Cache TTL (in seconds)
CACHE_TTL_QUIZ=1800        # 30 minutes
CACHE_TTL_USER=900         # 15 minutes
CACHE_TTL_HISTORY=600      # 10 minutes
SESSION_TTL=86400          # 24 hours
```

### Redis Config
Located in `src/config/redis.config.ts`:
- URL and connection options
- Default TTL values for each data type
- Reconnection strategy with exponential backoff

## Fallback Behavior

If Redis is unavailable:
- Cache reads return `null` (cache miss)
- Cache writes return `false` (silently fail)
- Requests fall back to database queries
- Session authentication falls back to JWT verification (if available)

This ensures the application remains functional even if Redis goes down.

## Performance Implications

### Benefits
- **Reduced Database Load:** Frequently accessed data cached in memory
- **Faster Response Times:** Redis is ~1000x faster than database queries
- **Session Scalability:** Distributed session management for multi-instance deployments

### Considerations
- **Memory Usage:** Redis stores data in RAM; monitor memory consumption
- **Cache Coherency:** Stale cache possible between TTL expiry (mitigated by invalidation)
- **Network Latency:** Redis network calls add ~1-5ms overhead

## Monitoring and Debugging

### Check Cache Status
```bash
# Connect to Redis CLI
redis-cli

# List all keys
KEYS *

# Get specific key
GET quiz:123

# Get cache size
DBSIZE

# Monitor in real-time
MONITOR
```

### Log Cache Operations
Cache utility functions log errors and operations to console. In production, integrate with a logging service.

## Best Practices

1. **Naming Consistency:** Use hierarchical cache keys (`resource:identifier:variant`)
2. **TTL Tuning:** Adjust TTL based on data change frequency
3. **Invalidation Strategy:** Always invalidate related caches on writes
4. **Testing:** Mock Redis in unit tests or use a test container
5. **Memory Management:** Set Redis maxmemory policy (e.g., `allkeys-lru`) to evict old keys
6. **Monitoring:** Track cache hit rates and memory usage in production

## Future Enhancements

- [ ] Add cache hit/miss metrics and observability
- [ ] Implement cache warming strategies
- [ ] Add distributed cache invalidation for multi-instance deployments
- [ ] Consider cache versioning for seamless updates
- [ ] Add partial cache updates instead of full invalidation
