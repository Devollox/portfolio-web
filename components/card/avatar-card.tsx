import Image from 'next/image'
import { MouseEvent, useState } from 'react'
import styles from './avatar-card.module.scss'

type AvatarCardProps = {
  tooltip?: string
  name: string
  avatarSrc?: string
}

const AvatarCard = ({
  tooltip = 'hello!',
  name,
  avatarSrc = 'devollox'
}: AvatarCardProps) => {
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.tooltip} ${
          hovered ? styles.tooltipVisible : styles.tooltipHidden
        }`}
      >
        {tooltip}
      </div>

      <div
        className={styles.inner}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <div className={styles.avatarWrapper}>
          <Image
            src={`/characters/${avatarSrc}.webp`}
            alt={`${name} character`}
            width={64}
            height={128}
            className={styles.avatar}
          />
        </div>

        <div className={styles.name}>{name}</div>
      </div>
    </div>
  )
}

export default AvatarCard
