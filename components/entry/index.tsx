import cn from 'classnames'
import 'intersection-observer'
import { useInView } from 'react-intersection-observer'

import styles from './entry.module.scss'

const imagePrefix =
  'https://res.cloudinary.com/dsdlhtnpw/image/fetch/q_60,w_1000'

type EntryProps = {
  title: string
  description: string
  image?: string
  href: string
  position?: string
  hours?: string | number
  progress?: string | number
}

const Entry = ({
  title,
  description,
  image,
  href,
  position,
  hours,
  progress
}: EntryProps) => {
  const { ref, inView } = useInView({ triggerOnce: true })

  return (
    <a
      style={{ margin: '10px 0px 0px -20px' }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      ref={ref}
      className={cn(styles.link, { [styles.active]: !image })}
      title={`${title} - ${description}`}
    >
      <section
        style={{
          backgroundImage: image
            ? !inView
              ? 'none'
              : `url('${imagePrefix}/${encodeURIComponent(image)}')`
            : 'none',
          backgroundPosition: position ?? 'center'
        }}
      >
        <div>
          <p style={{ marginBottom: '60px' }}>{progress}</p>
          <p className={cn(styles.title, 'clamp')}>{title}.</p>
          <p className={cn(styles.description, 'clamp')}>
            {description} - {hours}.
          </p>
        </div>
      </section>
    </a>
  )
}

export default Entry
