import type { NextApiRequest, NextApiResponse } from 'next'

type GithubEvent = {
  id: string
  type: string
  repo: string
  title?: string
  url?: string
  date: string
}

type ApiResponse = {
  events: GithubEvent[]
  error?: string
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

const ghFetch = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
      Accept: 'application/vnd.github+json',
      'User-Agent': 'void-presence-app'
    }
  })
  if (!res.ok) return null
  return res.json()
}

const resolvePushTitle = async (ev: any): Promise<string | undefined> => {
  const repo = ev.repo?.name ?? ''
  const payload = ev.payload ?? {}
  const commits = payload.commits ?? []

  if (!commits.length) {
    if (payload.head && repo) {
      const commitData = await ghFetch(
        `https://api.github.com/repos/${repo}/commits/${payload.head}`
      )
      const msg =
        commitData?.commit?.message && typeof commitData.commit.message === 'string'
          ? (commitData.commit.message as string)
          : undefined
      if (msg) return msg
    }
    return repo ? `Pushed to ${repo}` : 'Pushed commits'
  }

  const first = commits[0]

  if (first?.message) {
    if (commits.length === 1) return first.message as string
    return `${first.message as string} (+${commits.length - 1} more)`
  }

  if (first?.sha && repo) {
    const commitData = await ghFetch(
      `https://api.github.com/repos/${repo}/commits/${first.sha}`
    )
    const msg =
      commitData?.commit?.message && typeof commitData.commit.message === 'string'
        ? (commitData.commit.message as string)
        : undefined
    if (msg) {
      if (commits.length === 1) return msg
      return `${msg} (+${commits.length - 1} more)`
    }
  }

  return repo ? `Pushed to ${repo}` : 'Pushed commits'
}

const buildTitle = async (ev: any): Promise<string | undefined> => {
  const type = ev.type as string
  const repo = ev.repo?.name ?? ''
  const payload = ev.payload ?? {}

  if (type === 'PushEvent') {
    return resolvePushTitle(ev)
  }

  if (type === 'PullRequestEvent') {
    const pr = payload.pull_request
    if (pr?.title) return pr.title as string
    const action = payload.action
      ? String(payload.action)[0].toUpperCase() + String(payload.action).slice(1)
      : 'Updated'
    return `${action} pull request in ${repo}`
  }

  if (type === 'IssuesEvent') {
    const issue = payload.issue
    if (issue?.title) return issue.title as string
    const action = payload.action
      ? String(payload.action)[0].toUpperCase() + String(payload.action).slice(1)
      : 'Updated'
    return `${action} issue in ${repo}`
  }

  if (type === 'IssueCommentEvent') {
    const issue = payload.issue
    if (issue?.title) return `Commented on: ${issue.title as string}`
    return `Commented on issue in ${repo}`
  }

  if (type === 'PullRequestReviewCommentEvent') {
    const pr = payload.pull_request
    if (pr?.title) return `Reviewed: ${pr.title as string}`
    return `Reviewed pull request in ${repo}`
  }

  if (type === 'CreateEvent') {
    if (payload.ref_type === 'repository') {
      return `Created repository ${repo}`
    }
    if (payload.ref) {
      return `Created ${payload.ref_type} ${payload.ref} in ${repo}`
    }
    return `Created in ${repo}`
  }

  if (type === 'DeleteEvent') {
    if (payload.ref) {
      return `Deleted ${payload.ref_type} ${payload.ref} in ${repo}`
    }
    return `Deleted in ${repo}`
  }

  if (type === 'ForkEvent') {
    return `Forked repository ${repo}`
  }

  if (type === 'WatchEvent') {
    return `Starred ${repo}`
  }

  if (type === 'ReleaseEvent') {
    const release = payload.release
    if (release?.name) return `Released ${release.name as string}`
    if (release?.tag_name) return `Released ${release.tag_name as string}`
    return `Published release in ${repo}`
  }

  if (type === 'MemberEvent') {
    const member = payload.member
    if (member?.login) return `Added ${member.login as string} to ${repo}`
    return `Updated members of ${repo}`
  }

  return type
}

const buildUrl = (ev: any): string | undefined => {
  const payload = ev.payload ?? {}
  const repo = ev.repo?.name ?? ''
  const baseRepoHtml = repo ? `https://github.com/${repo}` : undefined

  if (payload.pull_request?.html_url) return payload.pull_request.html_url as string
  if (payload.issue?.html_url) return payload.issue.html_url as string

  const commits = payload.commits ?? []
  if (commits.length === 1 && commits[0]?.sha && repo) {
    return `https://github.com/${repo}/commit/${commits[0].sha}`
  }

  if (payload.head && repo) {
    return `https://github.com/${repo}/commit/${payload.head}`
  }

  return baseRepoHtml
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { user } = req.query

  if (!user || typeof user !== 'string') {
    return res.status(400).json({ events: [], error: 'Missing user param' })
  }

  try {
    const ghRes = await ghFetch(
      `https://api.github.com/users/${encodeURIComponent(
        user
      )}/events/public?per_page=100`
    )

    if (!ghRes || !Array.isArray(ghRes)) {
      return res.status(200).json({ events: [] })
    }

    const raw = ghRes as any[]

    const events: GithubEvent[] = await Promise.all(
      raw.map(async ev => {
        const created = String(ev.created_at ?? '')
        const isoDate = created.slice(0, 10)

        return {
          id: String(ev.id),
          type: String(ev.type),
          repo: ev.repo?.name ?? '',
          title: await buildTitle(ev),
          url: buildUrl(ev),
          date: isoDate
        }
      })
    )

    return res.status(200).json({ events })
  } catch {
    return res.status(200).json({ events: [] })
  }
}

import { useEffect, useMemo, useState } from 'react'

export type GithubDay = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

type GithubResponse = {
  contributions: GithubDay[]
}

export type GithubEventHook = {
  id: string
  type: string
  repo: string
  title?: string
  url?: string
  date: string
}

type EventsResponse = {
  events: GithubEventHook[]
}

export const useGithubActivity = (username: string) => {
  const [days, setDays] = useState<GithubDay[]>([])
  const [eventsByDate, setEventsByDate] = useState<Map<string, GithubEventHook[]>>(
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
            const map = new Map<string, GithubEventHook[]>()
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
