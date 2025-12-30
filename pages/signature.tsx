import AuthToggle from '@components/button/auth-toggle'
import SignaturePrimaryButton from '@components/button/signature-primary-btn'
import CreateForm from '@components/form/create-form'
import Form from '@components/form/form'
import SkeletonForm from '@components/form/skeleton-form'
import Information from '@components/information'
import Page from '@components/page'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  deleteSignatureByUid,
  getMoreSignatures,
  PAGE_SIZE,
  saveSignature,
  subscribeSignaturesPage
} from 'service/firebase'

type Signature = {
  id: string
  name: string
  timestamp: string
  signature: string
  uid: string
}

const SignaturePage = () => {
  const { data: session } = useSession()
  const [signatures, setSignatures] = useState<Signature[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const currentUserName = session?.user?.name ?? null
  const currentUserId = (session?.user as any)?.id ?? null

  useEffect(() => {
    const unsubscribe = subscribeSignaturesPage((list: Signature[]) => {
      setSignatures(list)
      setLoading(false)
      setHasMore(list.length === PAGE_SIZE)
    })

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  const lastSignature = useMemo(
    () => (signatures.length ? signatures[signatures.length - 1] : null),
    [signatures]
  )

  const hasUserSignature = useMemo(
    () =>
      !!(
        session &&
        currentUserId &&
        signatures.some(sig => sig.uid === currentUserId)
      ),
    [session, signatures, currentUserId]
  )

  const handleLoadMore = useCallback(async () => {
    if (!lastSignature || loadingMore) return
    setLoadingMore(true)
    try {
      const more = await getMoreSignatures(lastSignature.timestamp, PAGE_SIZE)
      if (!more.length) {
        setHasMore(false)
      } else {
        setSignatures(prev => {
          const existingIds = new Set(prev.map(s => s.id))
          const merged = [...prev]
          more.forEach(item => {
            if (!existingIds.has(item.id)) merged.push(item)
          })
          merged.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          return merged
        })
        if (more.length < PAGE_SIZE) {
          setHasMore(false)
        }
      }
    } finally {
      setLoadingMore(false)
    }
  }, [lastSignature, loadingMore])

  const handleDelete = useCallback(async () => {
    if (!currentUserId) return
    await deleteSignatureByUid(currentUserId)
  }, [currentUserId])

  const handleSaveSignature = useCallback(
    async ({ signature }: { signature: string | { signature: string } }) => {
      if (!currentUserName || !currentUserId) return
      const value =
        typeof signature === 'string' ? signature : signature.signature
      await saveSignature(value, currentUserName, currentUserId)
    },
    [currentUserName, currentUserId]
  )

  return (
    <Page description="Our signatures." title="Signature">
      {!session && (
        <Information title="Memory. Beauty. Perfection.">
          I think we all want to leave our own reminders that we were here once.
          And the most beautiful thing we have is our own{' '}
          <strong>signatures</strong>.
        </Information>
      )}

      {session && (
        <Information title="Memory. Beauty. Perfection.">
          <strong>{session.user?.name}</strong> - I hope you can draw something
          more beautiful than just two <strong>sticks</strong>.
        </Information>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: '8px',
          margin: '0 0 30px 0'
        }}
      >
        <AuthToggle />

        {session && !showForm && !hasUserSignature && !loading && (
          <SignaturePrimaryButton onClick={() => setShowForm(true)}>
            Create Signature
          </SignaturePrimaryButton>
        )}

        {session && !showForm && hasUserSignature && !loading && (
          <div style={{ marginLeft: 'auto' }}>
            <SignaturePrimaryButton onClick={handleDelete}>
              Delete Signature
            </SignaturePrimaryButton>
          </div>
        )}
      </div>

      {showForm && (
        <CreateForm
          onSaveSignature={signature => {
            handleSaveSignature({ signature })
            setShowForm(false)
          }}
        />
      )}

      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <SkeletonForm />
          <SkeletonForm />
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }}
          >
            {signatures.map(sig => (
              <Form
                key={sig.id}
                name={sig.name}
                date={sig.timestamp}
                signature={sig.signature}
              />
            ))}
          </div>

          {hasMore && (
            <div style={{ marginTop: 20 }}>
              <SignaturePrimaryButton onClick={handleLoadMore}>
                {loadingMore ? 'Loading...' : 'Show More'}
              </SignaturePrimaryButton>
            </div>
          )}
        </>
      )}
    </Page>
  )
}

export default SignaturePage
