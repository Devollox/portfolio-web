import { ReactNode } from 'react'
import styles from './list.module.scss'

type ListProps = {
  listTitle: string
  children: ReactNode
}

const List = ({ listTitle, children }: ListProps) => {
  return (
    <div>
      <h2 className={styles.title_block}>{listTitle}</h2>
      {children}
    </div>
  )
}

export default List
