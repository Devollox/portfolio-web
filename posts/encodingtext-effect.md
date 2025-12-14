---
title: Encoding Text Effects
description: Text scrambling effect for headings.
slug: encodingtext-effect
date: 2024-05-28
---

When I started building the `Uses` page, the layout felt a bit too static. I wanted to add a small detail that would make the text feel more alive without turning the whole site into a playground of animations. That turned into a simple encoding effect on headings.

The idea is straightforward: take the final string, replace all characters with random ones from a small alphabet and then gradually reveal the real text from left to right. It creates a short “decoding” animation every time the element mounts.

## The encoding hook

The whole effect lives in a small React hook that targets an element by `id` and updates its text content on an interval.

```javascript
import { useEffect } from 'react'

const useEncoding = (id: string | number, speed: number) => {
  useEffect(() => {
    const targetText = document.getElementById(String(id))
    if (!targetText) return

    const targetString = targetText.textContent || ''
    const alphabet = ' abcdefghijklmnopqrstuvwxyz'

    const getRandomChar = () =>
      alphabet[Math.floor(Math.random() * alphabet.length)]

    let currentString = Array(targetString.length).fill('')
    let index = 0

    const intervalId = setInterval(() => {
      for (let i = 0; i < currentString.length; i++) {
        if (i < index) {
          currentString[i] = targetString[i]
        } else {
          currentString[i] = getRandomChar()
        }
      }

      targetText.textContent = currentString.join('')

      if (index >= targetString.length) {
        clearInterval(intervalId)
      } else {
        index++
      }
    }, speed)

    return () => clearInterval(intervalId)
  }, [id, speed])
}

export default useEncoding
```

The `alphabet` can be tuned for different vibes: only letters for a softer look, symbols or numbers for something closer to a “terminal” feeling.

## Using the effect on headings

On the page side, the hook is attached to any element by giving it a stable `id`. As soon as the component mounts, the text starts “encoding” and then resolves to the final value.

```javascript
const EncodedTitle = () => {
  const id = 'computer-heading'

  useEncoding(id, 40)

  return <h1 id={id}>Computer</h1>
}
```

The same pattern can be reused for section titles, hero slogans or small labels. A lower `speed` value makes the animation faster, a higher one slows it down and makes each step more visible.

## Where it is used on the site

This hook is wired into several headings and labels across the site, mostly on pages that are already about hardware and tools. It adds a small layer of motion to an otherwise static layout and keeps the interaction subtle enough to not distract from the content.

The next step for this effect is to make it run asynchronously and maybe trigger on scroll or hover instead of only on mount. But even in this simple version it already does exactly what it should: gives the site a tiny bit of that “encoding” feel without getting in the way.
