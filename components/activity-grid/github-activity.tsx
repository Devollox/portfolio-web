import { useGithubActivity } from 'hook/useGithubActivity'
import { useState } from 'react'
import styles from './github-activity.module.scss'
import ActivityGrid from './index'

const GithubActivity = () => {
  const { loading, years, daysByYear } = useGithubActivity('Devollox')
  const [activeYear, setActiveYear] = useState<number | null>(null)

  if (loading) {
    return (
      <section className={styles.wrapper}>
        <h2 className={styles.title}>Activity</h2>
        <div className={styles.skeletonCard}>
          <div className={styles.skeletonGrid} />
          <div className={styles.skeletonFooter}>
            <div className={styles.skeletonDotRow}>
              <span className={styles.skeletonDot} />
              <span className={styles.skeletonDot} />
              <span className={styles.skeletonDot} />
              <span className={styles.skeletonDot} />
            </div>
            <div className={styles.skeletonYearTabs}>
              <span className={styles.skeletonTab} />
              <span className={styles.skeletonTab} />
              <span className={styles.skeletonTab} />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!years.length) {
    return null
  }

  const year = activeYear ?? years[0]
  const days = daysByYear.get(year) ?? []

  return (
    <section className={styles.wrapper}>
      <ActivityGrid
        title="Activity"
        days={days.map(d => ({
          date: d.date,
          count: d.count
        }))}
        years={years}
        activeYear={year}
        onYearChange={setActiveYear}
      />
    </section>
  )
}

export default GithubActivity
