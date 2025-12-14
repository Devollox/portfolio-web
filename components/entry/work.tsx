import styles from '@components/entry/work.module.scss'
import { ReactNode } from 'react'

type WorkEntryProps = {
  title: string
  underTitle?: string
  description: string
  image: ReactNode
  href: string
  margin?: string
  imageInt?: unknown
  children?: ReactNode
}

const WorkEntry = ({
  title,
  underTitle,
  children,
  description,
  image,
  href,
  margin
}: WorkEntryProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link_work}
      title={`${title} - ${description}`}
    >
      <span
        className={styles.span}
        style={{ height: '130px', marginBottom: `${margin}` }}
      >
        <div className={styles.image_work}>
          <div className={styles.image_work_} style={{ color: 'var(--fg)' }}>
            {image}
          </div>
        </div>
        <div className={styles.wrapper_work}>
          <p className={styles.title_work}>
            {title}{' '}
            <abbr className={styles.description_work}>{underTitle}</abbr>
          </p>
          <p className={styles.description_work}>{description}</p>
          {children}
        </div>
      </span>
    </a>
  )
}

export default WorkEntry
