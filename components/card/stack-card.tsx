import { MouseEvent } from 'react'
import styles from './stack-card.module.scss'

type StackSection = {
  title: string
  lines: string[]
}

type StackCardProps = {
  title: string
  badge: string
  sections: StackSection[]
}

const StackCard = ({ title, badge, sections }: StackCardProps) => {
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <div className={styles.wrapper} onMouseMove={handleMouseMove}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.badge}>{badge}</span>
      </div>

      <div className={styles.grid}>
        {sections.map(section => (
          <div key={section.title}>
            <div className={styles.sectionTitle}>{section.title}</div>
            {section.lines.map(line => (
              <div key={line}>{line}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StackCard
