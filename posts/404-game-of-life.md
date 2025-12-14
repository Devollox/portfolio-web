---
title: 404 as a Playground
description: Conway's Game of Life as a background for a not found page.
slug: 404-game-of-life
date: 2024-06-10
---

A 404 page is usually the most boring place on a site: a couple of lines about “not found” and maybe a sad illustration. For this project, the 404 turned into a small playground instead. If the user landed on a dead link, the page at least had to be visually alive.

The idea was to draw Conway’s Game of Life in the background, full‑screen, behind the usual 404 text. The content stays simple and readable, but the page slowly moves under it, like a quiet simulation that never fully repeats.

## Attaching the canvas to the page

The Game of Life runs inside a React component that only works with the DOM in a `useEffect`. It creates a `<canvas>` element on mount, attaches it to a root container and stretches it to the full viewport.

```javascript
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

    const bg =
      getComputedStyle(document.documentElement).getPropertyValue(
        '--background'
      ) || '#000'

    canvas.style.backgroundColor = bg.trim()

    // ...
  }, [])

  return null
}
```

The background color is read from a CSS variable (`--background`), so the 404 page automatically follows the current theme without extra props or config.

On the 404 page itself, the only requirement is to render a container with `id="Canvas"` and include `<GameOfLife />` once.

```javascript
const NotFoundPage = () => {
  return (
    <Page title="404" description="Page not found.">
      <div id="Canvas" />
      <ContentBlock />
      <GameOfLife />
    </Page>
  )
}
```

The text and links are rendered above the canvas using normal layout and a higher z‑index, so the background stays purely decorative.

## Implementing Conway's Game of Life

The simulation follows the classic rules of Conway’s Game of Life: a grid of cells, each either alive or dead, evolving based on the number of alive neighbours. The grid is mapped to the canvas as small rectangles.

```javascript
const cellSize = 10
const widthCells = Math.ceil(canvas.width / cellSize)
const heightCells = Math.ceil(canvas.height / cellSize)

let firstGeneration: number[][] = Array.from({ length: widthCells }, () =>
  Array.from({ length: heightCells }, () => (Math.random() * 100 > 80 ? 1 : 0))
)

const getCellValue = (x: number, y: number) => {
  if (x < 0) x = widthCells - 1
  if (x >= widthCells) x = 0
  if (y < 0) y = heightCells - 1
  if (y >= heightCells) y = 0
  return firstGeneration[x][y]
}
```

The grid wraps around the edges: if the cell index goes out of bounds, it continues from the opposite side. This creates a seamless, toroidal world without hard borders.

The next generation is computed on a fixed interval. Each cell counts its eight neighbours; new cells are born when they have exactly three neighbours, and live cells die from overpopulation or isolation.

```javascript
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
```

The fill color is semi‑transparent, which keeps the overall look subtle and prevents the background from overpowering the text on top.

To avoid the grid falling into a boring stable state forever, the platform is periodically refreshed with a new random seed.

```javascript
const refreshPlatform = () => {
  for (let i = 0; i < widthCells; i++) {
    for (let j = 0; j < heightCells; j++) {
      firstGeneration[i][j] = Math.random() * 100 > 80 ? 1 : 0
    }
  }
}
```

## Running and cleaning up the simulation

Two intervals are started when the component mounts: one to step the simulation, another to refresh the grid from time to time.

```javascript
root.appendChild(canvas)

const intervalId = setInterval(createNewGeneration, 100)
const refreshId = setInterval(refreshPlatform, 60000 * 30)

return () => {
  clearInterval(intervalId)
  clearInterval(refreshId)
  if (canvas.parentNode) {
    canvas.parentNode.removeChild(canvas)
  }
}
```

This keeps the Game of Life running smoothly while the user is on the page and ensures that everything is properly cleaned up when navigating away: no orphaned canvas, no leaking intervals.

In the end, the 404 page became a quiet nod to cellular automata: even when the route is wrong, the background is still doing something interesting.
