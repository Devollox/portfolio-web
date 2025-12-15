import { ReactNode } from 'react'
import styles from './list.module.scss'

type ListProps = {
  listTitle: string
  children: ReactNode
  badge?: string
}

const List = ({ listTitle, children, badge }: ListProps) => {
  return (
    <div className={styles.list_section}>
      <div className={styles.list_header}>
        <h3 className={styles.title_block}>{listTitle}</h3>
        <span className={styles.list_badge}>{badge}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default List
