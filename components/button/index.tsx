import { MouseEventHandler, ReactNode } from 'react'
import styles from './button.module.scss'

type ButtonProps = {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <div className={styles.wrapper_button}>
      <div className={styles.button} onClick={onClick}>
        {children}
      </div>
    </div>
  )
}

export default Button
