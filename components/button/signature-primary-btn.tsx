import { MouseEventHandler, ReactNode } from 'react'
import styles from './button.module.scss'

type SignaturePrimaryButtonProps = {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const SignaturePrimaryButton = ({
  children,
  onClick
}: SignaturePrimaryButtonProps) => (
  <div className={styles.wrapper_button}>
    <button className={styles.button} type="button" onClick={onClick}>
      {children}
    </button>
  </div>
)

export default SignaturePrimaryButton
