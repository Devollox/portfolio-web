import { useGithubActivity } from 'hook/useGithubActivity'
import { useState } from 'react'
import styles from './github-activity.module.scss'
import ActivityGrid from './index'

const GithubActivity = () => {
  const { loading, years, daysByYear } = useGithubActivity('Devollox')
  const [active_year, set_active_year] = useState<number | null>(null)

  if (loading) {
    return (
      <section className={styles.wrapper}>
        <h2 className={styles.title}>Activity</h2>
        <div className={styles.skeleton_card}>
          <div className={styles.skeleton_grid} />
          <div className={styles.skeleton_footer}>
            <div className={styles.skeleton_dot_row}>
              <span className={styles.skeleton_dot} />
              <span className={styles.skeleton_dot} />
              <span className={styles.skeleton_dot} />
              <span className={styles.skeleton_dot} />
            </div>
            <div className={styles.skeleton_year_tabs}>
              <span className={styles.skeleton_tab} />
              <span className={styles.skeleton_tab} />
              <span className={styles.skeleton_tab} />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!years.length) {
    return null
  }

  const year = active_year ?? years[0]
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
        onYearChange={set_active_year}
      />
    </section>
  )
}

export default GithubActivity
