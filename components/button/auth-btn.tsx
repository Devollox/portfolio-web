import { ArrowRight } from 'lucide-react'
import styles from './auth-btn.module.scss'

type AuthButtonProps = {
  label: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

const AuthButton = ({ label, onClick, type = 'button' }: AuthButtonProps) => (
  <button className={styles.button} onClick={onClick} type={type}>
    <span>{label}</span>
    <ArrowRight width={20} height={20} />
  </button>
)

export default AuthButton
