import styles from '@components/entry/work.module.scss'
import { ReactNode } from 'react'

type WrapperWorkProps = {
  children: ReactNode
  gridColumns?: string
  gridCRows?: string
}

const WrapperWork = ({
  children,
  gridColumns,
  gridCRows
}: WrapperWorkProps) => {
  return (
    <div
      className={styles.wrapper}
      style={{
        gridTemplateColumns: gridColumns,
        gridTemplateRows: gridCRows
      }}
    >
      {children}
    </div>
  )
}

export default WrapperWork
