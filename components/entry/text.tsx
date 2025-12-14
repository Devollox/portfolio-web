import Link from '@components/link'
import CountUp from '@lib/count-up'
import cn from 'classnames'
import { Eye } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import { subscribeVisitorCount } from '../../service/firebase'
import styles from './text.module.scss'

type TextEntryProps = {
  title: string
  description?: string
  date: string
  comment?: string
  href: string
  as?: string
  slug?: string | number
}

const TextEntry = ({
  title,
  description,
  date,
  href,
  as,
  slug
}: TextEntryProps) => {
  const [viewCount, setViewCount] = useState<number | null>(null)

  useEffect(() => {
    if (!slug) return

    const unsubscribe = subscribeVisitorCount(String(slug), count => {
      setViewCount(count)
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [slug])

  return (
    <li className={styles.item}>
      <Link
        href={href}
        as={as}
        external={!as}
        title={title}
        className={styles.link}
      >
        <div className={styles.type}>
          <span className={styles.wrapper_date}>{date}</span>
          <span className={styles.views}>
            <Eye />
            {viewCount === null ? (
              <span className="count-up-text">0</span>
            ) : (
              <CountUp
                from={0}
                to={viewCount}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
            )}
          </span>
        </div>

        <div className={styles.content}>
          <p className={cn(styles.title, 'clamp')}>{title}</p>
          {description && (
            <p className={cn(styles.description, 'clamp-2')}>{description}</p>
          )}
        </div>
      </Link>
    </li>
  )
}

export default memo(TextEntry)
