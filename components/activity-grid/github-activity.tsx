import { useGithubActivity } from 'hook/useGithubActivity'
import { MouseEvent, useState } from 'react'
import styles from './github-activity.module.scss'
import ActivityGrid from './index'

const GithubActivity = () => {
  const { loading, years, daysByYear } = useGithubActivity('Devollox')
  const [active_year, set_active_year] = useState<number | null>(null)

  const handleMouseMoveCard = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Activity</h2>

        <div className={styles.outer}>
          <div className={styles.card} onMouseMove={handleMouseMoveCard}>
            <div className={styles.slider_header}>
              <div className={styles.slider_controls}>
                <button type="button" className={styles.slider_button} disabled>
                  ‹
                </button>
                <button type="button" className={styles.slider_button} disabled>
                  ›
                </button>
              </div>

              <div className={styles.year_tabs}>
                <button
                  type="button"
                  className={`${styles.year_button} ${styles.shimmer}`}
                  disabled
                />
              </div>
            </div>

            <div className={styles.viewport} onMouseMove={handleMouseMoveCard}>
              <div className={styles.track}>
                <div className={styles.skeleton_rectangle_wrapper}>
                  <div
                    className={`${styles.skeleton_rectangle} ${styles.shimmer}`}
                  />
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <div className={styles.legend}>
                <span className={styles.legend_label}>Less</span>
                <div className={styles.legend_cells}>
                  <span className={styles.cell} />
                  <span className={styles.cell} />
                  <span className={styles.cell} />
                  <span className={styles.cell} />
                  <span className={styles.cell} />
                </div>
                <span className={styles.legend_label}>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!years.length) {
    return null
  }

  const year = active_year ?? years[0]
  const days = daysByYear.get(year) ?? []

  return (
    <div className={styles.wrapper}>
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
    </div>
  )
}

export default GithubActivity
