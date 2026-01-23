import { MouseEvent } from 'react'
import styles from './activity-grid.module.scss'

type ActivityDay = {
  date: string
  count: number
}

type ActivityGridProps = {
  title?: string
  days: ActivityDay[]
  years: number[]
  activeYear: number
  onYearChange: (year: number) => void
}

const getLevel = (count: number) => {
  if (count === 0) return 0
  if (count < 2) return 1
  if (count < 4) return 2
  if (count < 7) return 3
  return 4
}

const ActivityGrid = ({
  title = 'Activity',
  days,
  years,
  activeYear,
  onYearChange
}: ActivityGridProps) => {
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.card} onMouseMove={handleMouseMove}>
        <div className={styles.grid}>
          {days.map(day => {
            const level = getLevel(day.count)
            return (
              <div
                key={day.date}
                className={`${styles.cell} ${styles[`level${level}`]}`}
                aria-label={`${day.date}: ${day.count} activities`}
              />
            )
          })}
        </div>

        <div className={styles.footer}>
          <div className={styles.legend}>
            <span className={styles.legendLabel}>Less</span>
            <div className={styles.legendCells}>
              <span className={`${styles.cell} ${styles.level0}`} />
              <span className={`${styles.cell} ${styles.level1}`} />
              <span className={`${styles.cell} ${styles.level2}`} />
              <span className={`${styles.cell} ${styles.level3}`} />
              <span className={`${styles.cell} ${styles.level4}`} />
            </div>
            <span className={styles.legendLabel}>More</span>
          </div>

          <div className={styles.yearTabs}>
            {years.map(year => (
              <button
                key={year}
                type="button"
                className={
                  year === activeYear
                    ? `${styles.yearButton} ${styles.yearButtonActive}`
                    : styles.yearButton
                }
                onClick={() => onYearChange(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityGrid
