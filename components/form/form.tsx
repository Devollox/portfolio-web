import Image from 'next/image'
import { memo } from 'react'
import style from './form.module.scss'

const formatDate = (isoString: string) => {
  const date = new Date(isoString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

type FormProps = {
  name: string
  date: string
  signature: string
}

const Form = ({ name, date, signature }: FormProps) => {
  const formattedDate = formatDate(date)

  return (
    <div className={style.form_wrapper}>
      <div className={style.wrapper}>
        <span className={style.name_user}>
          <span className={style.name_text}>{name}</span>
          <span className={style.date_text}>
            {' - '}
            {formattedDate}
          </span>
        </span>

        <div className={style.signature_wrapper}>
          <div className={style.image_signature}>
            <Image
              src={`data:image/png;base64,${signature}`}
              height={150}
              width={320}
              alt={`${name} signature`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Form)
