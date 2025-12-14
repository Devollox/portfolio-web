import { useEffect, useState } from 'react'

type Theme = '' | 'light' | 'dark'

type StarOptions = {
  x?: number
  y?: number
}

type DrawableEntity = {
  update: () => void
}

export default function RenderBackdropAnimation() {
  const [theme, setTheme] = useState<Theme>('')

  useEffect(() => {
    const htmlEl = document.documentElement

    const updateTheme = () => {
      const t = htmlEl.getAttribute('data-theme') as Theme | null
      setTheme(t ?? '')
    }

    updateTheme()

    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          updateTheme()
        }
      }
    })

    observer.observe(htmlEl, { attributes: true })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!theme) return

    const terrain = document.getElementById(
      'terrainCanvas'
    ) as HTMLCanvasElement | null
    const background = document.getElementById(
      'bgCanvas'
    ) as HTMLCanvasElement | null

    if (!terrain || !background) return

    const terrainContext = terrain.getContext('2d')!
    const backgroundContext = background.getContext('2d')!

    if (!terrainContext || !backgroundContext) return

    const width = window.innerWidth
    const height = Math.min(document.body.offsetHeight, 400)
    terrain.width = background.width = width
    terrain.height = background.height = height

    const generateTerrain = () => {
      const points: number[] = []
      let displacement = 0
      const power = 2 ** Math.ceil(Math.log2(width))
      points[0] = height - (Math.random() * height) / 2
      points[power] = height - (Math.random() * height) / 2
      for (let i = 1; i < power; i *= 2) {
        const step = power / i / 2
        for (let j = step; j < power; j += power / i) {
          points[j] =
            (points[j - step] + points[j + step]) / 2 +
            Math.floor(Math.random() * (-displacement * 2) + displacement)
        }
        displacement *= 0.6
      }
      terrainContext.beginPath()
      for (let i = 0; i <= width; i++) {
        if (i === 0) terrainContext.moveTo(0, points[0])
        else if (points[i] !== undefined) terrainContext.lineTo(i, points[i])
      }
      terrainContext.lineTo(width, terrain.height)
      terrainContext.lineTo(0, terrain.height)
      terrainContext.lineTo(0, points[0])
    }

    class Star implements DrawableEntity {
      size: number
      speed: number
      x: number
      y: number

      constructor(options: StarOptions = {}) {
        this.size = 0
        this.speed = 0
        this.x = 0
        this.y = 0
        this.reset(options)
      }

      reset(options: StarOptions = {}) {
        this.size = Math.random() * 2
        this.speed = Math.random() * 0.1
        this.x = options.x ?? width
        this.y = options.y ?? Math.random() * height
      }

      update() {
        this.x -= this.speed
        if (this.x < 0) this.reset()
        else backgroundContext.fillRect(this.x, this.y, this.size, this.size)
      }
    }

    class ShootingStar implements DrawableEntity {
      x: number
      y: number
      len: number
      speed: number
      size: number
      waitTime: number
      active: boolean

      constructor() {
        this.x = 0
        this.y = 0
        this.len = 0
        this.speed = 0
        this.size = 0
        this.waitTime = 0
        this.active = false
        this.reset()
      }

      reset() {
        this.x = Math.random() * width
        this.y = 0
        this.len = Math.random() * 80 + 10
        this.speed = Math.random() * 10 + 6
        this.size = Math.random() * 1 - 0.1
        this.waitTime = Date.now() * Math.random() * 3000 + 500
        this.active = false
      }

      update() {
        if (this.active) {
          this.size -= 0.15
          this.x -= this.speed
          this.y += this.speed
          if (this.x < 0 || this.y >= height) this.reset()
          else {
            backgroundContext.lineWidth = this.size
            backgroundContext.beginPath()
            backgroundContext.moveTo(this.x, this.y)
            backgroundContext.lineTo(this.x + this.len, this.y - this.len)
            backgroundContext.stroke()
          }
        } else if (this.waitTime < Date.now()) {
          this.active = true
        }
      }
    }

    const entities: DrawableEntity[] = [
      ...Array.from(
        { length: Math.floor(height / 10) },
        () => new Star({ x: Math.random() * width, y: Math.random() * height })
      ),
      new ShootingStar(),
      new ShootingStar()
    ]

    let animationId: number

    const animate = () => {
      if (theme === 'light') {
        backgroundContext.fillStyle = '#fff'
        backgroundContext.fillRect(0, 0, width, height)
        backgroundContext.fillStyle = '#000'
        backgroundContext.strokeStyle = '#000'
      } else if (theme === 'dark') {
        backgroundContext.fillStyle = '#000'
        backgroundContext.fillRect(0, 0, width, height)
        backgroundContext.fillStyle = '#fff'
        backgroundContext.strokeStyle = '#fff'
      } else {
        animationId = requestAnimationFrame(animate)
        return
      }

      entities.forEach(e => e.update())
      animationId = requestAnimationFrame(animate)
    }

    generateTerrain()

    Array.from(
      document.getElementsByClassName('landscapeItem') as HTMLCollectionOf<
        HTMLElement
      >
    ).forEach(m => m.classList.add('animateIn'))

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [theme])

  useEffect(() => {
    const htmlElement = document.getElementsByTagName('html')[0]

    const applyStyles = () => {
      const attrValue = htmlElement.getAttribute('data-theme')
      const landscapeItems = document.querySelectorAll<HTMLElement>(
        '.landscapeItem'
      )

      if (attrValue === 'light') {
        landscapeItems.forEach((element, index) => {
          switch (index) {
            case 0:
              element.style.filter = 'invert(1)'
              break
            case 1:
              element.style.filter = 'invert(0.9)'
              break
            case 2:
              element.style.filter = 'invert(0.8)'
              break
            case 3:
              element.style.filter = 'invert(0.6)'
              break
            case 4:
              element.style.filter = 'invert(0.5)'
              break
            case 5:
              element.style.filter = 'invert(0.3)'
              break
            default:
              break
          }
        })
      } else {
        landscapeItems.forEach(element => {
          element.style.filter = ''
        })
      }
    }

    applyStyles()
  })

  return (
    <>
      <canvas id="bgCanvas" />
      <canvas id="terrainCanvas" />
      <div className="landscape">
        <div className="landscapeItem mountains background" />
        <div className="landscapeItem mountains midground" />
        <div className="landscapeItem mountains foreground" />
        <div className="landscapeItem trees background" />
        <div className="landscapeItem trees midground" />
        <div className="landscapeItem trees foreground" />
      </div>
    </>
  )
}
