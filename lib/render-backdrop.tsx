'use client'

import { useTheme } from 'next-themes'
import { useEffect } from 'react'

type StarOptions = {
  x?: number
  y?: number
}

type DrawableEntity = {
  update: () => void
}

export default function RenderBackdropAnimation() {
  const { theme, systemTheme } = useTheme()
  const resolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    const background = document.getElementById(
      'bgCanvas'
    ) as HTMLCanvasElement | null

    if (!background || !resolvedTheme) return

    const backgroundContext = background.getContext('2d')
    if (!backgroundContext) return

    const ctx = backgroundContext as CanvasRenderingContext2D

    const width = window.innerWidth
    const height = window.innerHeight

    background.width = width
    background.height = height

    const isDark = resolvedTheme === 'dark'
    const starColor = isDark ? '#fff' : '#000'
    const bgColor = isDark ? '#000' : '#fff'

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
        else ctx.fillRect(this.x, this.y, this.size, this.size)
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
          if (this.x < 0 || this.y >= height || this.size <= 0) {
            this.reset()
          } else {
            ctx.lineWidth = this.size
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.x + this.len, this.y - this.len)
            ctx.stroke()
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
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = starColor
      ctx.strokeStyle = starColor

      entities.forEach(e => e.update())
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [resolvedTheme])

  return <canvas id="bgCanvas" />
}

