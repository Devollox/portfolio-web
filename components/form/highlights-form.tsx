import CountUp from '@lib/count-up'
import { MouseEvent, useEffect, useState } from 'react'
import { subscribeTotalVisitors } from 'service/firebase'
import styles from './highlights-form.module.scss'

type HighlightsProps = {
  initialTotalVisitors?: number
}

type Stat =
  | {
      num: string | number
      label: string
      isCountUp?: false
      icon?: React.ReactNode
    }
  | { num: number; label: string; isCountUp: true; icon?: React.ReactNode }

const Highlights = ({ initialTotalVisitors = 0 }: HighlightsProps) => {
  const [totalVisitors, setTotalVisitors] = useState<number>(
    initialTotalVisitors
  )

  useEffect(() => {
    const unsubscribe = subscribeTotalVisitors(value => {
      setTotalVisitors(value || 0)
    })
    return () => unsubscribe && unsubscribe()
  }, [])

  const stats: Stat[] = [
    { num: '3+', label: 'Years' },
    { num: 'TypeScript', label: 'Favorite' },
    { num: totalVisitors, label: 'Visitors', isCountUp: true }
  ]

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Highlights</h2>
      <div className={styles.grid}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.card} onMouseMove={handleMouseMove}>
            <div className={styles.icon}>{stat.icon}</div>
            <div className={styles.value}>
              {stat.isCountUp ? (
                <CountUp to={totalVisitors} duration={2.5} />
              ) : (
                stat.num
              )}
            </div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Highlights



