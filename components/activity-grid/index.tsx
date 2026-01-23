import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
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

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
] as const

const getLevel = (count: number) => {
  if (count === 0) return 0
  if (count < 2) return 1
  if (count < 4) return 2
  if (count < 7) return 3
  return 4
}

const START_WEEKDAY = 0

const buildWeeks = (days: ActivityDay[]) => {
  if (!days.length)
    return {
      weeks: [] as ActivityDay[][],
      monthLabels: [] as { index: number; month: number }[]
    }

  const sorted = [...days].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const firstDate = new Date(sorted[0].date)
  const lastDate = new Date(sorted[sorted.length - 1].date)

  const start = new Date(firstDate)
  while (start.getDay() !== START_WEEKDAY) {
    start.setDate(start.getDate() - 1)
  }

  const end = new Date(lastDate)
  while (end.getDay() !== (START_WEEKDAY + 6) % 7) {
    end.setDate(end.getDate() + 1)
  }

  const map = new Map<string, ActivityDay>()
  sorted.forEach(d => map.set(d.date, d))

  const weeks: ActivityDay[][] = []
  const monthLabels: { index: number; month: number }[] = []

  let current = new Date(start)
  let week: ActivityDay[] = []
  let weekIndex = 0
  let lastMonth: number | null = null

  while (current <= end) {
    const iso = current.toISOString().slice(0, 10)
    const stored = map.get(iso)
    week.push({
      date: iso,
      count: stored?.count ?? 0
    })

    if (current.getDay() === (START_WEEKDAY + 6) % 7) {
      weeks.push(week)
      const month = current.getMonth()
      if (lastMonth === null || month !== lastMonth) {
        monthLabels.push({ index: weekIndex, month })
        lastMonth = month
      }
      week = []
      weekIndex += 1
    }

    current.setDate(current.getDate() + 1)
  }

  if (week.length) {
    weeks.push(week)
    const month = current.getMonth()
    if (lastMonth === null || month !== lastMonth) {
      monthLabels.push({ index: weekIndex, month })
    }
  }

  if (
    monthLabels.length > 1 &&
    monthLabels[monthLabels.length - 1].month === monthLabels[0].month
  ) {
    monthLabels.pop()
  }

  return { weeks, monthLabels }
}

const formatDateLabel = (iso: string, count: number) => {
  const d = new Date(iso)
  const day = d
    .getDate()
    .toString()
    .padStart(2, '0')
  const month = MONTH_NAMES[d.getMonth()]
  const year = d.getFullYear()
  return `${day} ${month} ${year} • ${count} activities`
}

const ActivityGrid = ({
  title = 'Activity',
  days,
  years,
  activeYear,
  onYearChange
}: ActivityGridProps) => {
  const { weeks, monthLabels } = useMemo(() => buildWeeks(days), [days])
  const [offset, setOffset] = useState(0)
  const [maxOffsetPx, setMaxOffsetPx] = useState(0)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)

  const [hoveredDay, setHoveredDay] = useState<{
    date: string
    count: number
    x: number
    y: number
  } | null>(null)

  useEffect(() => {
    const viewportWidth = viewportRef.current?.clientWidth ?? 0
    const trackWidth = trackRef.current?.scrollWidth ?? 0
    const max = Math.max(trackWidth - viewportWidth, 0)
    setMaxOffsetPx(max)
    setOffset(prev => Math.min(prev, max))
  }, [weeks.length])

  const handleMouseMoveCard = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  const step = 5 * 15

  const handlePrev = () => {
    setOffset(prev => Math.max(prev - step, 0))
  }

  const handleNext = () => {
    setOffset(prev => Math.min(prev + step, maxOffsetPx))
  }

  const handleCellEnter = (e: MouseEvent<HTMLDivElement>, day: ActivityDay) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const outerRect = (e.currentTarget.closest(
      `.${styles.outer}`
    ) as HTMLDivElement | null)?.getBoundingClientRect()

    const base_left = outerRect ? outerRect.left : 0
    const base_top = outerRect ? outerRect.top : 0

    const x = rect.left - base_left + rect.width / 2
    const y = rect.top - base_top - 6

    setHoveredDay({
      date: day.date,
      count: day.count,
      x,
      y
    })
  }

  const handleCellLeave = () => {
    setHoveredDay(null)
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.outer}>
        {hoveredDay && (
          <div
            className={styles.badge}
            style={{
              left: hoveredDay.x,
              top: hoveredDay.y
            }}
          >
            {formatDateLabel(hoveredDay.date, hoveredDay.count)}
          </div>
        )}

        <div className={styles.card} onMouseMove={handleMouseMoveCard}>
          <div className={styles.slider_header}>
            <div className={styles.slider_controls}>
              <button
                type="button"
                className={styles.slider_button}
                onClick={handlePrev}
                disabled={offset === 0}
              >
                ‹
              </button>
              <button
                type="button"
                className={styles.slider_button}
                onClick={handleNext}
                disabled={offset >= maxOffsetPx}
              >
                ›
              </button>
            </div>

            <div className={styles.year_tabs}>
              {years.map(year => (
                <button
                  key={year}
                  type="button"
                  className={
                    year === activeYear
                      ? `${styles.year_button} ${styles.year_button_active}`
                      : styles.year_button
                  }
                  onClick={() => onYearChange(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div
            className={styles.viewport}
            ref={viewportRef}
            onMouseMove={handleMouseMoveCard}
          >
            <div
              className={styles.track}
              ref={trackRef}
              style={{ transform: `translateX(-${offset}px)` }}
            >
              <div className={styles.month_row}>
                {monthLabels.map(label => (
                  <span
                    key={`${label.index}-${label.month}`}
                    className={styles.month_label}
                    style={{ gridColumnStart: label.index + 1 }}
                  >
                    {MONTH_NAMES[label.month]}
                  </span>
                ))}
              </div>

              <div className={styles.grid}>
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className={styles.week_column}>
                    {week.map(day => {
                      const date_obj = new Date(day.date)
                      const in_year = date_obj.getFullYear() === activeYear
                      const level = getLevel(day.count)

                      if (!in_year) {
                        return (
                          <div
                            key={day.date}
                            className={`${styles.cell} ${styles.cell_invisible}`}
                            aria-hidden="true"
                          />
                        )
                      }

                      return (
                        <div
                          key={day.date}
                          className={`${styles.cell} ${
                            styles[`level_${level}`]
                          }`}
                          aria-label={`${day.date}: ${day.count} activities`}
                          onMouseEnter={e => handleCellEnter(e, day)}
                          onMouseLeave={handleCellLeave}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.legend}>
              <span className={styles.legend_label}>Less</span>
              <div className={styles.legend_cells}>
                <span className={`${styles.cell} ${styles.level_0}`} />
                <span className={`${styles.cell} ${styles.level_1}`} />
                <span className={`${styles.cell} ${styles.level_2}`} />
                <span className={`${styles.cell} ${styles.level_3}`} />
                <span className={`${styles.cell} ${styles.level_4}`} />
              </div>
              <span className={styles.legend_label}>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityGrid
