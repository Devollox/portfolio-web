import { MutableRefObject, useEffect, useRef } from 'react'

export const useSignatureCanvas = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
) => {
  const historyRef = useRef<string[]>([])
  const isDrawingRef = useRef(false)
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  const applyInkColor = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = ctxRef.current || canvas.getContext('2d')
    if (!ctx) return
    ctxRef.current = ctx
    const root = document.documentElement
    const isDark = root.getAttribute('data-theme') === 'dark'
    ctx.strokeStyle = isDark ? '#fff' : '#000'
  }

  const saveCanvasState = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL()
    historyRef.current.push(dataUrl)
  }

  const undo = () => {
    if (historyRef.current.length > 1) {
      historyRef.current.pop()
      const lastState = historyRef.current[historyRef.current.length - 1]
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
      img.src = lastState
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctxRef.current = ctx

    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    applyInkColor()

    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }

    const startDrawing = (e: MouseEvent) => {
      isDrawingRef.current = true
      lastPosRef.current = getMousePos(e)
      ctx.beginPath()
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
    }

    const draw = (e: MouseEvent) => {
      if (!isDrawingRef.current) return
      const pos = getMousePos(e)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
      lastPosRef.current = pos
    }

    const stopDrawing = () => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false
        saveCanvasState()
      }
    }

    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDrawing)
    canvas.addEventListener('mouseout', stopDrawing)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'KeyZ') {
        e.preventDefault()
        undo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    const html = document.documentElement
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        if (m.attributeName === 'data-theme') {
          applyInkColor()
        }
      })
    })
    observer.observe(html, { attributes: true })

    const initCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      saveCanvasState()
    }
    initCanvas()

    return () => {
      canvas.removeEventListener('mousedown', startDrawing)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', stopDrawing)
      canvas.removeEventListener('mouseout', stopDrawing)
      window.removeEventListener('keydown', handleKeyDown)
      observer.disconnect()
    }
  }, [])

  return { undo }
}
