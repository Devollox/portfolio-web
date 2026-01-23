import { useEffect, useMemo, useState } from 'react'

export type GithubDay = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

type GithubResponse = {
  contributions: GithubDay[]
}

export const useGithubActivity = (username: string) => {
  const [days, setDays] = useState<GithubDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}`
        )
        if (!res.ok) return
        const data: GithubResponse = await res.json()
        setDays(data.contributions || [])
      } finally {
        setLoading(false)
      }
    }
    load()
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

  return { loading, ...byYear }
}
