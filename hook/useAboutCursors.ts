import { useUserId } from 'hook/useUserId'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CursorData,
  CursorWithId,
  filterActiveCursors,
  removeCursor,
  subscribeCursors,
  updateCursor
} from 'service/firebase'

const ROOM = 'about'
const IDLE_TIMEOUT_MS = 15000

const randomColor = (): string => {
  const colors = ['#ff4b81', '#4bc0ff', '#7fff4b', '#ffd54b', '#b54bff']
  return colors[Math.floor(Math.random() * colors.length)]
}

type CursorRaw = {
  name?: string
  color?: string
  x?: number
  y?: number
  lastSeen?: number
  state?: 'active' | 'idle'
}

type Cursor = CursorData & { id: string }

export const useAboutCursors = () => {
  const { data: session } = useSession()
  const userIdRef = useUserId()
  const [others, setOthers] = useState<Cursor[]>([])
  const colorRef = useRef<string>(randomColor())
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeCursors(
      ROOM,
      (data: Record<string, CursorRaw> | null) => {
        if (!data) {
          setOthers([])
          return
        }

        const list: CursorWithId[] = Object.entries(data).map(
          ([id, value]) => ({
            id,
            ...value
          })
        )

        const filtered = filterActiveCursors(list, userIdRef.current)

        setOthers(filtered as Cursor[])
      }
    )

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [userIdRef])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const setIdleLater = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)

      idleTimerRef.current = setTimeout(() => {
        if (!userIdRef.current) return
        updateCursor(ROOM, userIdRef.current, {
          state: 'idle'
        })
      }, IDLE_TIMEOUT_MS)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!userIdRef.current) return

      const x = e.clientX
      const y = e.clientY
      const w = window.innerWidth
      const h = window.innerHeight

      if (x < 0 || y < 0 || x > w || y > h) {
        removeCursor(ROOM, userIdRef.current)
        return
      }

      const name = (session && session.user && session.user.name) || 'Guest'

      updateCursor(ROOM, userIdRef.current, {
        name,
        color: colorRef.current,
        x,
        y,
        state: 'active'
      })

      setIdleLater()
    }

    const handleBeforeUnload = () => {
      if (!userIdRef.current) return
      removeCursor(ROOM, userIdRef.current)
    }

    const handlePageHide = () => {
      if (!userIdRef.current) return
      removeCursor(ROOM, userIdRef.current)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pagehide', handlePageHide)
    setIdleLater()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pagehide', handlePageHide)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      if (userIdRef.current) {
        removeCursor(ROOM, userIdRef.current)
      }
    }
  }, [session, userIdRef])

  const cursors = useMemo(() => others, [others])

  return { cursors }
}
