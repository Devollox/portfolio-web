import { useSignatureCanvas } from 'hook/useSignatureCanvas'
import { useSession } from 'next-auth/react'
import { useRef } from 'react'
import styles from './create-form.module.scss'

type SignatureData = {
  name: string
  timestamp: string
  signature: string
}

type CreateFormProps = {
  onSaveSignature?: (data: SignatureData) => void
}

const CreateForm = ({ onSaveSignature }: CreateFormProps) => {
  const { data: session } = useSession()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useSignatureCanvas(canvasRef)

  const handleSaveSignature = () => {
    const canvas = canvasRef.current
    if (!canvas || !session?.user?.name) return

    const dataUrl = canvas.toDataURL('image/png')
    const base64String = dataUrl.split(',')[1]

    onSaveSignature?.({
      name: String(session.user.name),
      timestamp: new Date().toISOString(),
      signature: base64String
    })
  }

  return (
    <>
      <p
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '0.85rem',
          opacity: 0.8,
          height: '19px',
          marginBottom: '0.5rem',
          gap: '4px'
        }}
      >
        Press
        <kbd
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '20px',
            height: '18px',
            padding: '0 4px',
            borderRadius: '4px'
          }}
        >
          Ctrl
        </kbd>
        <kbd
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '20px',
            height: '18px',
            padding: '0 4px',
            borderRadius: '4px'
          }}
        >
          Z
        </kbd>
        to undo
      </p>

      <div className={styles.form_wrapper}>
        <div className={styles.wrapper}>
          <div className={styles.signature_wrapper}>
            <div className={styles.image_signature}>
              <canvas
                ref={canvasRef}
                width={320}
                height={150}
                className={styles.canvas}
              />
            </div>
          </div>
          <span className={styles.button} onClick={handleSaveSignature}>
            Accept Signature
          </span>
        </div>
      </div>
    </>
  )
}

export default CreateForm
