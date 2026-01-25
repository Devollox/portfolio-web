import type { GithubEvent } from '../pages/api/github-events'

type CacheEntry = {
  events: GithubEvent[]
  fetchedAt: number 
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000

const cache = new Map<string, CacheEntry>()

export const getCachedEvents = (user: string): GithubEvent[] | null => {
  const entry = cache.get(user)
  if (!entry) return null

  const isFresh = Date.now() - entry.fetchedAt < ONE_DAY_MS
  if (!isFresh) {
    cache.delete(user)
    return null
  }

  return entry.events
}

export const setCachedEvents = (user: string, events: GithubEvent[]) => {
  cache.set(user, {
    events,
    fetchedAt: Date.now()
  })
}
