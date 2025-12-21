import { MouseEvent, useEffect, useState } from 'react'
import {
  incrementUseReaction,
  subscribePopularUseTools,
  subscribeUseReaction
} from '../../service/firebase'
import styles from './list.module.scss'

type Tool = {
  index: number
  title: string
}

type PopularTool = {
  index: number
  count: number
  title: string
}

type ListIndexProps = {
  title: string
  description?: string
  selection?: string
  index: number
  section: string
  allTools: Tool[]
  link?: string
}

const ListIndex = ({
  title,
  description,
  selection,
  index,
  section,
  allTools,
  link
}: ListIndexProps) => {
  const [usingCount, setUsingCount] = useState(0)
  const [checked, setChecked] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [popularToolsData, setPopularToolsData] = useState<PopularTool[]>([])

  const storageKey = `uses_reaction_${section}_${index}`

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'true') {
      setChecked(true)
    }
  }, [storageKey])

  useEffect(() => {
    const unsubscribe = subscribeUseReaction(section, index, count => {
      setUsingCount(count)
    })
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [section, index])

  useEffect(() => {
    const unsubscribe = subscribePopularUseTools(section, tools => {
      const toolsWithTitles: PopularTool[] = tools.map((tool: any) => ({
        ...tool,
        title: allTools[tool.index]?.title || `Tool ${tool.index}`
      }))
      setPopularToolsData(toolsWithTitles)
    })
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [section, allTools])

  const handleTitleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setModalOpen(true)
  }

  const handleToggle = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (isLoading || checked) return

    setIsLoading(true)

    try {
      await incrementUseReaction(section, index)
      setChecked(true)
      localStorage.setItem(storageKey, 'true')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const getLinkLabel = () => {
    if (!link) return ''

    if (
      section === 'computer' ||
      section === 'desk' ||
      section === 'mouse' ||
      section === 'keyboard' ||
      section === 'microphone'
    ) {
      return 'Buy on AliExpress'
    }

    if (section === 'coding' || section === 'apps' || section === 'services') {
      return 'Visit website'
    }

    return 'Open link'
  }

  return (
    <>
      <ul style={{ margin: '0', paddingLeft: '20px' }}>
        <li className={styles.list}>
          <button
            type="button"
            className={styles.title_btn}
            onClick={handleTitleClick}
          >
            <a className={styles.ul}>{title}</a>
          </button>

          <span style={{ color: 'var(--colors-secondary)' }}>
            {' '}
            {selection}{' '}
          </span>
          <span
            className={styles.description}
            style={{ color: 'var(--colors-secondary)' }}
          >
            {description}
          </span>
        </li>
      </ul>

      {modalOpen && (
        <div className={styles.modal_backdrop} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modal_header}>
              <span className={styles.modal_title}>{title}</span>
              <span className={styles.modal_title_badge}>{section}</span>
            </div>

            {description && <p className={styles.modal_desc}>{description}</p>}

            <div className={styles.modal_actions}>
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link_btn}
                >
                  {getLinkLabel()}
                </a>
              )}
              <button
                type="button"
                className={`${styles.checkbox_btn} ${
                  checked ? styles.checkbox_checked : ''
                }`}
                onClick={handleToggle}
                disabled={isLoading || checked}
              >
                <span className={styles.checkbox}>
                  {checked && <span className={styles.checkbox_tick} />}
                </span>
                <span>{isLoading ? 'Saving...' : "I'm using this too"}</span>
              </button>
            </div>

            <p className={styles.modal_meta}>
              {usingCount} people here are using this.
            </p>

            {popularToolsData.length > 0 && (
              <div className={styles.modal_popular}>
                <p className={styles.modal_popular_title}>
                  Popular in this setup
                </p>
                <ul className={styles.modal_popular_list}>
                  {popularToolsData.map((tool, idx) => (
                    <li key={idx} className={styles.modal_popular_item}>
                      <span className={styles.modal_popular_name}>
                        {tool.title}
                      </span>
                      <span className={styles.modal_popular_count}>
                        {tool.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ListIndex
