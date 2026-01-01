import type { MouseEvent } from 'react'
import styles from './projects-grid-form.module.scss'

type Project = {
  title: string
  role: string
  stack: string
  link: string
  year: string
}

type ProjectsGridProps = {
  projects: Project[]
}

const ProjectsGrid = ({ projects }: ProjectsGridProps) => {
  const handleMouseMove = <T extends HTMLElement>(e: MouseEvent<T>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Projects</h2>
      <div className={styles.grid}>
        {projects.map(project => (
          <a
            key={project.title}
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className={styles.card}
            onMouseMove={handleMouseMove}
          >
            <div className={styles.header}>
              <span className={styles.year}>{project.year}</span>
              <span className={styles.role}>{project.role}</span>
            </div>
            <div className={styles.name}>{project.title}</div>
            <div className={styles.stack}>{project.stack}</div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default ProjectsGrid
