import Link from '@components/link'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'
import styles from './footer.module.scss'

type GlowOption = {
  value: string
  label: string
  rgb: string
  swatchRgb: string
}

const GLOW_OPTIONS_LIGHT: GlowOption[] = [
  {
    value: 'charcoal',
    label: 'Charcoal',
    rgb: '26, 26, 26',
    swatchRgb: '26, 26, 26'
  },
  {
    value: 'soft-black',
    label: 'Soft black',
    rgb: '18, 18, 18',
    swatchRgb: '18, 18, 18'
  },
  {
    value: 'ink-gray',
    label: 'Ink gray',
    rgb: '20, 24, 32',
    swatchRgb: '20, 24, 32'
  },
  {
    value: 'warm-charcoal',
    label: 'Warm charcoal',
    rgb: '28, 24, 20',
    swatchRgb: '28, 24, 20'
  },
  {
    value: 'graphite',
    label: 'Graphite',
    rgb: '34, 34, 34',
    swatchRgb: '34, 34, 34'
  }
]

const GLOW_OPTIONS_DARK: GlowOption[] = [
  {
    value: 'white',
    label: 'White',
    rgb: 'var(--glow-white-rgb)',
    swatchRgb: 'var(--glow-white-rgb)'
  },
  {
    value: 'sand',
    label: 'Sand',
    rgb: '245, 243, 220',
    swatchRgb: '245, 243, 220'
  },
  {
    value: 'stone',
    label: 'Stone',
    rgb: '200, 196, 177',
    swatchRgb: '200, 196, 177'
  },
  {
    value: 'greige',
    label: 'Greige',
    rgb: '196, 186, 163',
    swatchRgb: '196, 186, 163'
  },
  {
    value: 'warm-gray',
    label: 'Warm gray',
    rgb: '180, 180, 180',
    swatchRgb: '180, 180, 180'
  }
]

type SocialLink = {
  label: string
  href: string
}

const CODE_LINKS: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/devollox' }
]

const ELSEWHERE_LINKS: SocialLink[] = [
  { label: 'Steam', href: 'https://steamcommunity.com/id/Devollox/' },
  { label: 'Reddit', href: 'https://www.reddit.com/user/Devollox_/' }
]

type FooterProps = {
  isHome?: boolean
}

const Footer = ({ isHome = false }: FooterProps) => {
  const year = new Date().getFullYear()
  const [showGlowModal, setShowGlowModal] = useState(false)
  const { theme } = useTheme()

  const options = useMemo<GlowOption[]>(() => {
    if (theme === 'light') return GLOW_OPTIONS_LIGHT
    return GLOW_OPTIONS_DARK
  }, [theme])

  const applyGlow = (option: GlowOption) => {
    const root = document.documentElement
    root.style.setProperty('--glow-color', `rgba(${option.rgb}, 1)`)
    root.style.setProperty('--glow-soft', `rgba(${option.rgb}, 0.35)`)
    root.style.setProperty('--glow-shadow', `rgba(${option.rgb}, 0.3)`)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.localStorage.getItem('glow-color')
    const currentOptions = options
    let option: GlowOption | undefined
    if (saved) {
      option = currentOptions.find(o => o.value === saved)
    }
    if (!option) {
      option = currentOptions[0]
    }
    applyGlow(option)
  }, [options])

  const setGlow = (value: string) => {
    if (typeof document === 'undefined') return
    const option = options.find(o => o.value === value)
    if (!option) return
    applyGlow(option)
    window.localStorage.setItem('glow-color', value)
    setShowGlowModal(false)
  }

  return (
    <footer
      className={`${styles.footer_container} ${
        isHome ? styles.footer_home : ''
      }`}
    >
      <div className={styles.page_section_inner}>
        <div className={styles.footer_top}>
          <div className={styles.footer_brand}>
            <button
              type="button"
              className={styles.footer_mark}
              onClick={() => setShowGlowModal(true)}
            >
              <span>Ⓓ</span>
            </button>
            <div>
              <p className={styles.footer_title}>
                <Link href={'/developer'}>Devollox</Link>
              </p>
              <p className={styles.footer_tagline}>
                Builder. Optimizer. Solver.
              </p>
            </div>
          </div>

          <div className={styles.footer_links_wrapper}>
            <div className={styles.footer_links_group}>
              <span className={styles.footer_links_label}>Code</span>
              <nav className={styles.footer_links}>
                {CODE_LINKS.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.footer_link}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className={styles.footer_links_group}>
              <span className={styles.footer_links_label}>Elsewhere</span>
              <nav className={styles.footer_links}>
                {ELSEWHERE_LINKS.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.footer_link}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className={styles.footer_bottom}>
          <p className={styles.footer_copy}>
            <span>© {year}</span> <span>Devollox.</span>{' '}
            <span className={styles.footer_note}>
              Obsessed with the Internet.
            </span>
          </p>
        </div>
      </div>

      {showGlowModal && (
        <div
          className={styles.footer_glow_modal_backdrop}
          onClick={() => setShowGlowModal(false)}
        >
          <div
            className={styles.footer_glow_modal}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.footer_glow_header}>
              <span className={styles.footer_glow_title}>Glow color</span>
              <span className={styles.footer_glow_badge}>Footer</span>
            </div>
            <p className={styles.footer_glow_desc}>
              Choose accent glow for the footer mark and highlights.
            </p>

            <div className={styles.footer_glow_buttons}>
              {options.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={styles.footer_glow_btn}
                  onClick={() => setGlow(option.value)}
                >
                  <span
                    className={styles.footer_glow_swatch}
                    style={
                      {
                        '--glow-swatch-color': `rgba(${option.swatchRgb}, 1)`
                      } as React.CSSProperties
                    }
                  />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer
