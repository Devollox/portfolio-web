import { useEffect } from 'react'

export function GameOfLife() {
  useEffect(() => {
    const root = document.getElementById('Canvas')
    if (!root) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.border = 'none'
    canvas.style.zIndex = '0'
    canvas.style.pointerEvents = 'auto'

    const bg =
      getComputedStyle(document.documentElement).getPropertyValue(
        '--background'
      ) || '#000'

    canvas.style.backgroundColor = bg.trim()

    const cellSize = 10
    const widthCells = Math.ceil(canvas.width / cellSize)
    const heightCells = Math.ceil(canvas.height / cellSize)

    let firstGeneration: number[][] = Array.from({ length: widthCells }, () =>
      Array.from({ length: heightCells }, () =>
        Math.random() * 100 > 80 ? 1 : 0
      )
    )

    const getCellValue = (x: number, y: number) => {
      if (x < 0) x = widthCells - 1
      if (x >= widthCells) x = 0
      if (y < 0) y = heightCells - 1
      if (y >= heightCells) y = 0
      return firstGeneration[x][y]
    }

    const createNewGeneration = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const newGeneration: number[][] = Array.from({ length: widthCells }, () =>
        Array(heightCells).fill(0)
      )

      for (let x = 0; x < widthCells; x++) {
        for (let y = 0; y < heightCells; y++) {
          const lifePower =
            getCellValue(x - 1, y - 1) +
            getCellValue(x - 1, y) +
            getCellValue(x - 1, y + 1) +
            getCellValue(x, y - 1) +
            getCellValue(x, y + 1) +
            getCellValue(x + 1, y - 1) +
            getCellValue(x + 1, y) +
            getCellValue(x + 1, y + 1)

          if (firstGeneration[x][y] === 0 && lifePower === 3) {
            newGeneration[x][y] = 1
          } else if (
            firstGeneration[x][y] === 1 &&
            (lifePower > 3 || lifePower < 2)
          ) {
            newGeneration[x][y] = 0
          } else {
            newGeneration[x][y] = firstGeneration[x][y]
          }

          if (newGeneration[x][y]) {
            ctx.fillStyle = '#99999937'
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
          }
        }
      }

      firstGeneration = newGeneration
    }

    const refreshPlatform = () => {
      for (let i = 0; i < widthCells; i++) {
        for (let j = 0; j < heightCells; j++) {
          firstGeneration[i][j] = Math.random() * 100 > 80 ? 1 : 0
        }
      }
    }

    const spawnAt = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const baseX = Math.floor((e.clientX - rect.left) / cellSize)
      const baseY = Math.floor((e.clientY - rect.top) / cellSize)
      if (baseX < 0 || baseX >= widthCells || baseY < 0 || baseY >= heightCells)
        return

      const radius = 3
      const count = 20

      for (let i = 0; i < count; i++) {
        const dx = Math.floor((Math.random() - 0.5) * 2 * radius)
        const dy = Math.floor((Math.random() - 0.5) * 2 * radius)
        const cx = (baseX + dx + widthCells) % widthCells
        const cy = (baseY + dy + heightCells) % heightCells
        firstGeneration[cx][cy] = 1
      }
    }

    let drawing = false

    const handleMouseDown = (e: MouseEvent) => {
      drawing = true
      spawnAt(e)
    }

    const handleMouseUp = () => {
      drawing = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!drawing) return
      spawnAt(e)
    }

    root.appendChild(canvas)

    const intervalId = setInterval(createNewGeneration, 100)
    const refreshId = setInterval(refreshPlatform, 60000 * 30)

    canvas.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mousemove', handleMouseMove)

    return () => {
      clearInterval(intervalId)
      clearInterval(refreshId)
      canvas.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mousemove', handleMouseMove)
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
    }
  }, [])

  return null
}
