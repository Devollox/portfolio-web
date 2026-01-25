import { useEffect, useMemo, useState } from 'react'

export type GithubDay = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

type GithubResponse = {
  contributions: GithubDay[]
}

export type GithubEvent = {
  id: string
  type: string
  repo: string
  title?: string
  url?: string
  date: string
}

type EventsResponse = {
  events: GithubEvent[]
}

export const useGithubActivity = (username: string) => {
  const [days, setDays] = useState<GithubDay[]>([])
  const [eventsByDate, setEventsByDate] = useState<Map<string, GithubEvent[]>>(
    new Map()
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)

      try {
        const [contribRes, eventsRes] = await Promise.all([
          fetch(`https://github-contributions-api.jogruber.de/v4/${username}`),
          fetch(`/api/github-events?user=${username}`)
        ])

        if (contribRes.ok) {
          const contribData: GithubResponse = await contribRes.json()
          if (!cancelled) {
            setDays(contribData.contributions || [])
          }
        }

        if (eventsRes.ok) {
          const eventsData: EventsResponse = await eventsRes.json()
          if (!cancelled) {
            const map = new Map<string, GithubEvent[]>()
            eventsData.events.forEach(ev => {
              const list = map.get(ev.date) ?? []
              list.push(ev)
              map.set(ev.date, list)
            })
            setEventsByDate(map)
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [username])

  const byYear = useMemo(() => {
    const map = new Map<number, GithubDay[]>()

    days.forEach(d => {
      const year = new Date(d.date).getFullYear()
      if (!map.has(year)) map.set(year, [])
      map.get(year)!.push(d)
    })

    const years = Array.from(map.keys()).sort((a, b) => b - a)

    return {
      years,
      daysByYear: map
    }
  }, [days])

  return { loading, ...byYear, eventsByDate }
}
