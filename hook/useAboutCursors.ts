import { useUserId } from 'hook/useUserId'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { removeCursor, subscribeCursors, updateCursor } from 'service/firebase'

const ROOM = 'about'

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
}

type Cursor = {
  id: string
  name?: string
  color?: string
  x?: number
  y?: number
  lastSeen?: number
}

export const useAboutCursors = () => {
  const { data: session } = useSession()
  const userIdRef = useUserId()
  const [others, setOthers] = useState<Cursor[]>([])
  const colorRef = useRef<string>(randomColor())

  useEffect(() => {
    const unsubscribe = subscribeCursors(
      ROOM,
      (data: Record<string, CursorRaw> | null) => {
        if (!data) {
          setOthers([])
          return
        }

        const list: Cursor[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...value
        }))

        const now = Date.now()
        const filtered = list
          .filter(item => item.id !== userIdRef.current)
          .filter(c => now - (c.lastSeen ?? 0) < 15000)

        setOthers(filtered)
      }
    )

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [userIdRef])

  useEffect(() => {
    if (typeof window === 'undefined') return

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
        lastSeen: Date.now()
      })
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

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pagehide', handlePageHide)
      if (userIdRef.current) {
        removeCursor(ROOM, userIdRef.current)
      }
    }
  }, [session, userIdRef])

  const cursors = useMemo(() => others, [others])

  return { cursors }
}
