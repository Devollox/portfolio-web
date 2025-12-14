import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'

const LOCAL_KEY = 'cursor-user-id'

export const useUserId = () => {
  const { data: session } = useSession()
  const userIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (session && session.user && session.user.id) {
      userIdRef.current = String(session.user.id)
      return
    }

    if (typeof window === 'undefined') return

    let id = window.localStorage.getItem(LOCAL_KEY)
    if (!id) {
      id = crypto.randomUUID()
      window.localStorage.setItem(LOCAL_KEY, id)
    }
    userIdRef.current = id
  }, [session])

  return userIdRef
}
