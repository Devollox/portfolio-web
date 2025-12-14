import { useEffect } from 'react'

const alphabet = ' abcdefghijklmnopqrstuvwxyz'

const getRandomChar = (): string => {
  const index = Math.floor(Math.random() * alphabet.length)
  return alphabet[index]
}

const useEncoding = (id: string, speed: number): void => {
  useEffect(() => {
    const targetText = document.getElementById(String(id))
    if (!targetText) return

    const targetString = targetText.textContent ?? ''
    let currentString: string[] = Array(targetString.length).fill('')
    let index = 0

    const intervalId = window.setInterval(() => {
      for (let i = 0; i < currentString.length; i++) {
        if (i < index) {
          currentString[i] = targetString[i]
        } else {
          currentString[i] = getRandomChar()
        }
      }

      targetText.textContent = currentString.join('')

      if (index >= targetString.length) {
        window.clearInterval(intervalId)
      } else {
        index++
      }
    }, speed)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [id, speed])
}

export default useEncoding
