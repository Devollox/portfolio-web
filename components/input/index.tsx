import { InputHTMLAttributes } from 'react'
import styles from './input.module.scss'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = (props: InputProps) => {
  return <input type="text" className={styles.input} {...props} />
}

export default Input
