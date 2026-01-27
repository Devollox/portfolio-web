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

        let contribDays: GithubDay[] = []
        if (contribRes.ok) {
          const contribData: GithubResponse = await contribRes.json()
          contribDays = contribData.contributions || []
        }

        const map = new Map<string, GithubEvent[]>()
        if (eventsRes.ok) {
          const eventsData: EventsResponse = await eventsRes.json()
          eventsData.events.forEach(ev => {
            const list = map.get(ev.date) ?? []
            list.push(ev)
            map.set(ev.date, list)
          })
        }

        if (cancelled) return

        setEventsByDate(map)

        if (contribDays.length) {
          const merged: GithubDay[] = contribDays.map(d => {
            const eventsForDay = map.get(d.date) ?? []
            const realCount = eventsForDay.length
            return {
              date: d.date,
              count: realCount || d.count,
              level: d.level
            }
          })
          setDays(merged)
        } else {
          const dates = Array.from(map.keys()).sort((a, b) =>
            a < b ? -1 : a > b ? 1 : 0
          )
          if (dates.length) {
            const start = new Date(dates[0])
            const end = new Date(dates[dates.length - 1])
            const allDays: GithubDay[] = []
            const current = new Date(start)
            while (current <= end) {
              const iso = current.toISOString().slice(0, 10)
              const eventsForDay = map.get(iso) ?? []
              const count = eventsForDay.length
              allDays.push({
                date: iso,
                count,
                level: 0
              })
              current.setDate(current.getDate() + 1)
            }
            setDays(allDays)
          } else {
            setDays([])
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
