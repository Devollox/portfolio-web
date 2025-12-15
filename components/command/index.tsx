import { DialogContent, DialogOverlay } from '@reach/dialog'
import cn from 'classnames'
import clsx from 'clsx'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  useCommand,
  usePages
} from 'cmdk'
import {
  ArrowRight,
  Brush,
  Gamepad2,
  Github,
  LaptopMinimal,
  Pencil,
  Search,
  Sparkles,
  Users
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import React, {
  memo,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import useDelayedRender from 'use-delayed-render'

import headerStyles from '@components/navbar/navbar.module.scss'
import postMeta from '@data/blog.json'
import tinykeys from '@lib/tinykeys'
import styles from './command.module.scss'

type CommandContextValue = {
  pages: React.ComponentType[]
  search: string
  open: boolean
  setPages: React.Dispatch<React.SetStateAction<React.ComponentType[]>>
  keymap: Record<string, (event?: KeyboardEvent) => void>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CommandData = React.createContext<CommandContextValue | null>(null)

const useCommandData = () => {
  const ctx = useContext(CommandData)
  if (!ctx) {
    throw new Error('useCommandData must be used within CommandData.Provider')
  }
  return ctx
}

type CommandMenuProps = {
  variant: ReactNode
  variantStyle?: 'true' | 'false'
  variantKey?: 'true' | 'false'
}

const CommandMenu = memo(
  ({ variant, variantStyle, variantKey }: CommandMenuProps) => {
    const listRef = useRef<HTMLDivElement | null>(null)
    const commandRef = useRef<HTMLDivElement | null>(null)
    const heightRef = useRef<HTMLDivElement | null>(null)

    const router = useRouter()

    const commandProps = useCommand({ label: 'Site Navigation' })
    const [pages, setPages] = usePages(commandProps, ThemeItems)
    const [open, setOpen] = useState(false)
    const { search, list } = commandProps

    const { mounted, rendered } = useDelayedRender(open, {
      enterDelay: -1,
      exitDelay: 200
    })

    useEffect(() => {
      if (!mounted) {
        setPages([DefaultItems])
      }
    }, [mounted, setPages])

    const Items = pages[pages.length - 1]

    const keymap = useMemo(
      () => ({
        t: () => {
          setPages([ThemeItems])
          setOpen(true)
        },
        'g u': () => router.push('/uses'),
        'g s': () => router.push('/signature'),
        'g b': () => router.push('/blog'),
        'g a': () => router.push('/about'),
        'g d': () => router.push('/developer'),
        'g h': () => router.push('/')
      }),
      [router, setPages]
    )

    if (variantKey === 'true') {
      useEffect(() => {
        const unsubs = [
          tinykeys(window, keymap, { ignoreFocus: true }),
          tinykeys(window, { '$mod+k': () => setOpen(o => !o) })
        ]
        return () => {
          unsubs.forEach(unsub => unsub())
        }
      }, [keymap])
    }

    useEffect(() => {
      if (!commandRef.current) return
      commandRef.current.style.transform = 'scale(0.99)'
      commandRef.current.style.transition = 'transform 0.1s ease'
      const id = window.setTimeout(() => {
        if (commandRef.current) commandRef.current.style.transform = ''
      }, 100)
      return () => window.clearTimeout(id)
    }, [pages])

    useEffect(() => {
      if (!listRef.current || !heightRef.current) return
      const height = Math.min(listRef.current.offsetHeight + 1, 300)
      heightRef.current.style.height = `${height}px`
    })

    return (
      <>
        <button
          className={clsx(
            variantStyle === 'true'
              ? headerStyles.command
              : headerStyles.command_homepage
          )}
          title="⌘K"
          onClick={() => setOpen(true)}
        >
          {variant}
        </button>

        <DialogOverlay
          isOpen={mounted}
          className={cn(styles.screen, { [styles.show]: rendered })}
          onDismiss={() => setOpen(false)}
        >
          <DialogContent
            className={styles['dialog-content']}
            aria-label="Site Navigation"
          >
            <Command
              {...commandProps}
              ref={commandRef}
              className={cn(styles.command, { [styles.show]: rendered })}
            >
              <div className={styles.top}>
                <CommandInput
                  placeholder={
                    Items === ThemeItems
                      ? 'Select a theme...'
                      : Items === BlogItems
                      ? 'Search for posts...'
                      : 'Type a command or search...'
                  }
                />
              </div>

              <div
                ref={heightRef}
                className={cn(styles.container, {
                  [styles.empty]: list.current.length === 0
                })}
              >
                <CommandList ref={listRef}>
                  <CommandData.Provider
                    value={{ pages, search, open, setPages, keymap, setOpen }}
                  >
                    <Items />
                  </CommandData.Provider>
                </CommandList>
              </div>
            </Command>
          </DialogContent>
        </DialogOverlay>
      </>
    )
  }
)

CommandMenu.displayName = 'CommandMenu'

export default CommandMenu

const ThemeItems = () => {
  const { theme: activeTheme, themes, setTheme } = useTheme()
  const { setOpen } = useCommandData()

  return (
    <>
      {themes.map(theme => {
        if (theme === 'system') return null
        if (theme === activeTheme) return null

        return (
          <Item
            value={theme}
            key={`theme-${theme}`}
            callback={() => {
              setTheme(theme)
              setOpen(false)
            }}
          />
        )
      })}
    </>
  )
}

const BlogItems = () => {
  const router = useRouter()

  return (
    <>
      {postMeta.map((post, i) => (
        <Item
          key={`blog-item-${post.title}-${i}`}
          value={post.title}
          callback={() => router.push('/blog/[slug]', `/blog/${post.slug}`)}
        />
      ))}
    </>
  )
}

type LabelProps = {
  title: string
}

const Label = ({ title }: LabelProps) => (
  <div className={styles.label} aria-hidden>
    {title}
  </div>
)

type GroupProps = {
  title: string
  children: ReactNode
}

const Group = ({ children, title }: GroupProps) => (
  <CommandGroup heading={<Label title={title} />} className={styles.group}>
    {children}
  </CommandGroup>
)

const DefaultItems = () => {
  const router = useRouter()
  const { setPages, pages } = useCommandData()

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  }

  return (
    <>
      <Group title="Collection">
        <Item
          value="Uses"
          icon={<LaptopMinimal />}
          keybind="g u"
          callback={() => router.push('/uses')}
          children={<span style={rowStyle}>Uses</span>}
        />
        <Item
          value="Signature"
          icon={<Brush />}
          keybind="g s"
          callback={() => router.push('/signature')}
        />
        <Item
          value="About"
          icon={<Users />}
          keybind="g a"
          callback={() => router.push('/about')}
        />
      </Group>

      <Group title="Blog">
        <Item
          value="Blog"
          icon={<Pencil />}
          keybind="g b"
          callback={() => router.push('/blog')}
        />
        <Item
          value="Search blog..."
          icon={<Search />}
          closeOnCallback={false}
          callback={() => setPages([...pages, BlogItems])}
        />
      </Group>

      <Group title="Navigation">
        <Item
          value="CThemes"
          icon={<Sparkles />}
          keybind="t"
          closeOnCallback={false}
          callback={() => setPages([ThemeItems])}
          children={<span style={rowStyle}>Themes</span>}
        />
        <Item
          value="XHome"
          icon={<ArrowRight />}
          keybind="g h"
          callback={() => router.push('/')}
          children={<span style={rowStyle}>Home</span>}
        />
      </Group>

      <Group title="Social">
        <Item
          value="Github"
          icon={<Github />}
          callback={() => window.open('https://github.com/devollox', '_blank')}
          children={
            <span style={rowStyle}>
              Github
              <ArrowUpRightIcon />
            </span>
          }
        />
        <Item
          value="Steam"
          icon={<Gamepad2 />}
          callback={() =>
            window.open('https://steamcommunity.com/id/Devollox/', '_blank')
          }
          children={
            <span style={rowStyle}>
              Steam
              <ArrowUpRightIcon />
            </span>
          }
        />
      </Group>
    </>
  )
}

const ArrowUpRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
)

type ItemProps = {
  icon?: ReactNode
  children?: ReactNode
  callback?: () => void
  closeOnCallback?: boolean
  keybind?: string
  value: string
}

const Item = ({
  icon,
  children,
  callback,
  closeOnCallback = true,
  keybind,
  ...props
}: ItemProps) => {
  const { setOpen } = useCommandData()

  const cb = () => {
    callback?.()
    if (closeOnCallback) setOpen(false)
  }

  return (
    <CommandItem {...props} callback={cb}>
      <div>
        {icon && <div className={styles.icon}>{icon}</div>}
        {children || props.value}
      </div>

      {keybind && (
        <span className={styles.keybind}>
          {keybind.includes(' ') ? (
            keybind
              .split(' ')
              .map((key, i) => <kbd key={`keybind-${key}-${i}`}>{key}</kbd>)
          ) : (
            <kbd>{keybind}</kbd>
          )}
        </span>
      )}
    </CommandItem>
  )
}
