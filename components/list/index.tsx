import { MouseEvent, ReactNode } from 'react'
import styles from './list.module.scss'

type ListProps = {
  listTitle: string
  children: ReactNode
  badge?: string
}

const List = ({ listTitle, children, badge }: ListProps) => {
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const section = e.currentTarget.closest(
      `.${styles.list_section}`
    ) as HTMLDivElement | null

    if (!section) return

    const rect = section.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    section.style.setProperty('--mouse-x', `${x}px`)
    section.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <div className={styles.list_section} onMouseMove={handleMouseMove}>
      <div className={styles.list_header}>
        <h3 className={styles.title_block}>{listTitle}</h3>
        <span className={styles.list_badge}>{badge}</span>
      </div>
      <div className={styles.list_glow_content}>{children}</div>
    </div>
  )
}

export default List
