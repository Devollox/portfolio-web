import Information from '@components/information'
import Page from '@components/page'
import { useGithubActivity } from 'hook/useGithubActivity'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import styles from './activity-day.module.scss'

type PageProps = {
  date: string
}

const isOlderThanDays = (dateStr: string, days: number) => {
  const target = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - target.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays > days
}

const ActivityDayPage = ({
  date
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const parsed = useMemo(() => new Date(date), [date])

  const {
    loading,
    years,
    daysByYear,
    eventsByDate
  } = useGithubActivity('Devollox')

  const isTooOld = useMemo(() => isOlderThanDays(date, 30), [date])

  const handleMouseMoveItem = (e: React.MouseEvent<HTMLLIElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  const handleItemClick = (url?: string) => {
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (isTooOld) {
    return (
      <Page
        title={`Activity ${date}`}
        description="Activity details are no longer available for this day."
      >
        <Information title="Activity">
          Detailed activity for this day is not available anymore because it is older than 30 days.
        </Information>
      </Page>
    )
  }

  if (loading) {
    return (
      <Page title={`Activity ${date}`} description={`All activities on ${date}.`}>
        <div className={styles.wrapper}>
          <Information title="Activity">
            Loading activity.
          </Information>
          <div className={styles.list_card}>
            <ul className={styles.list}>
              {Array.from({ length: 3 }).map((_, i) => (
                <li
                  key={i}
                  onMouseMove={handleMouseMoveItem}
                  className={`${styles.item} ${styles.item_skeleton}`}
                >
                  <div className={`${styles.skeleton_bar} ${styles.shimmer}`} />
                  <div className={`${styles.skeleton_bar_short} ${styles.shimmer}`} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Page>
    )
  }

  const year = parsed.getFullYear()

  if (!years.includes(year)) {
    if (typeof window !== 'undefined') {
      router.replace('/activity')
    }
    return null
  }

  const days = daysByYear.get(year) ?? []
  const dayData = days.find(d => d.date === date)

  if (!dayData) {
    if (typeof window !== 'undefined') {
      router.replace('/activity')
    }
    return null
  }

  const events = eventsByDate.get(date) ?? []

  if (!events.length) {
    return (
      <Page title={`Activity ${date}`} description="No activity for this day.">
        <Information title="Activity">
          There were no public activities on this day.
        </Information>
      </Page>
    )
  }

  return (
    <Page title={`Activity ${date}`} description={`All activities on ${date}.`}>
      <div className={styles.wrapper}>
        <Information title="Activity">
          All GitHub activity for {date}.
        </Information>
        <div className={styles.list_card}>
          <ul className={styles.list}>
            {events.map(event => (
              <li
                key={event.id}
                className={styles.item}
                onMouseMove={handleMouseMoveItem}
                onClick={() => handleItemClick(event.url)}
              >
                <div className={styles.item_header}>
                  <span className={styles.repo}>{event.repo}</span>
                  <span className={styles.badge_type}>{event.type}</span>
                </div>

                {event.title && (
                  <div className={styles.item_title}>{event.title}</div>
                )}

                {event.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.item_link}
                    onClick={e => e.stopPropagation()}
                  >
                    Open on GitHub
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ctx => {
  const date = ctx.params?.date

  if (!date || typeof date !== 'string') {
    return {
      notFound: true
    }
  }

  return {
    props: {
      date
    }
  }
}

export default ActivityDayPage
