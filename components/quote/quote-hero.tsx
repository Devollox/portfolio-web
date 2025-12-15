import Image from 'next/image'
import { MouseEvent, ReactNode, useState } from 'react'
import styles from './quote-hero.module.scss'

type QuoteHeroProps = {
  badgeText: string
  name: string
  subtitle: string
  text: ReactNode
  avatarSrc?: string
}

const QuoteHero = ({
  badgeText,
  name,
  subtitle,
  text,
  avatarSrc = '/characters/devollox.webp'
}: QuoteHeroProps) => {
  const [hoveredCard, setHoveredCard] = useState(false)

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
        className={`${styles.badge} ${
          hoveredCard ? styles.badgeVisible : styles.badgeHidden
        }`}
      >
        {badgeText}
      </div>

      <div
        className={styles.inner}
        onMouseEnter={() => setHoveredCard(true)}
        onMouseLeave={() => setHoveredCard(false)}
        onMouseMove={handleMouseMove}
      >
        <div className={styles.header}>
          <div className={styles.avatarWrapperOuter}>
            <div className={styles.avatarWrapperInner}>
              <Image
                src={avatarSrc}
                alt={`${name} character`}
                width={40}
                height={80}
                className={styles.avatar}
              />
            </div>
          </div>

          <div className={styles.nameBlock}>
            <div className={styles.name}>{name}</div>
            <div className={styles.subtitle}>{subtitle}</div>
          </div>
        </div>

        <div className={styles.text}>{text}</div>
      </div>
    </div>
  )
}

export default QuoteHero
