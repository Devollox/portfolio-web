import styles from './slider.module.scss'

const UsedByDevollox = () => {
  const skillsData = [
    {
      title: 'Frontend Development',
      skills: ['React', 'Next.js', 'TypeScript', 'SCSS']
    },
    {
      title: 'Backend & Services',
      skills: ['Node.js', 'Firebase', 'REST API', 'Authentication', 'Firestore']
    },
    {
      title: 'Development Tools',
      skills: ['Git', 'GitHub', 'CI/CD', 'Vercel', 'npm & Yarn']
    },
    {
      title: 'Design & Performance',
      skills: ['UI/UX', 'Performance', 'Accessibility', 'Responsive Design']
    }
  ]

  const allSkills = skillsData.flatMap(category => category.skills)
  const repeatedSkills = Array.from({ length: 4 }, () => allSkills).flat()

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Used by Devollox</p>

      <div className={styles.marquee}>
        <div className={styles.gradientLeft} />
        <div className={styles.gradientRight} />

        <div className={styles.track}>
          {repeatedSkills.map((skill, idx) => (
            <div key={idx} className={styles.skill}>
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UsedByDevollox
