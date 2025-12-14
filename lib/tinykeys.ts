type KeyBindingPress = [string[], string]

export interface KeyBindingMap {
  [keybinding: string]: (event: KeyboardEvent) => void
}

export interface Options {
  ignoreFocus?: boolean
  sequenceTimeout?: number
}

const KEYBINDING_MODIFIER_KEYS = ['Shift', 'Meta', 'Alt', 'Control'] as const
const INPUT_TAGS = ['select', 'textarea', 'input']

const RU_TO_EN: Record<string, string> = {
  й: 'q',
  ц: 'w',
  у: 'e',
  к: 'r',
  е: 't',
  н: 'y',
  г: 'u',
  ш: 'i',
  щ: 'o',
  з: 'p',
  х: '[',
  ъ: ']',
  ф: 'a',
  ы: 's',
  в: 'd',
  а: 'f',
  п: 'g',
  р: 'h',
  о: 'j',
  л: 'k',
  д: 'l',
  ж: ';',
  э: "'",
  я: 'z',
  ч: 'x',
  с: 'c',
  м: 'v',
  и: 'b',
  т: 'n',
  ь: 'm',
  б: ',',
  ю: '.'
}

function normalizeKey(key: string): string {
  const lower = key.toLowerCase()
  if (RU_TO_EN[lower]) return RU_TO_EN[lower]
  return lower
}

function parse(str: string): KeyBindingPress[] {
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  const MOD = isMac ? 'Meta' : 'Control'

  return str
    .trim()
    .split(' ')
    .map(press => {
      let mods = press.split('+')
      const key = mods.pop() as string
      mods = mods.map(mod => (mod === '$mod' ? MOD : mod))
      return [mods, key]
    })
}

function match(event: KeyboardEvent, press: KeyBindingPress): boolean {
  const [mods, key] = press

  const expected = normalizeKey(key)
  const actual = normalizeKey(event.key)

  const keyMatches = expected === actual || key === event.code

  if (!keyMatches) return false

  const requiredModsPressed = !mods.find(mod => !event.getModifierState(mod))
  if (!requiredModsPressed) return false

  const noUnexpectedMods = !KEYBINDING_MODIFIER_KEYS.find(mod => {
    return !mods.includes(mod) && event.getModifierState(mod)
  })

  return noUnexpectedMods
}

export default function tinykeys(
  target: Window | HTMLElement,
  keyBindingMap: KeyBindingMap,
  options: Options = {}
) {
  const sequenceTimeout = options.sequenceTimeout ?? 1000

  const keyBindings = Object.keys(keyBindingMap).map(key => {
    return [parse(key), keyBindingMap[key]] as const
  })

  const possibleMatches = new Map<KeyBindingPress[], KeyBindingPress[]>()
  let timer: ReturnType<typeof setTimeout> | null = null

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.getModifierState(event.key)) return

    if (options.ignoreFocus && document.activeElement) {
      const active = document.activeElement as HTMLElement
      const tag = active.tagName.toLowerCase()
      const isInput =
        INPUT_TAGS.includes(tag) || active.contentEditable === 'true'

      if (isInput) return
    }

    keyBindings.forEach(([sequence, callback]) => {
      const prev = possibleMatches.get(sequence)
      const remaining = prev ?? sequence
      const currentPress = remaining[0]

      const matchesPress = match(event, currentPress)

      if (!matchesPress) {
        possibleMatches.delete(sequence)
        return
      }

      if (remaining.length > 1) {
        possibleMatches.set(sequence, remaining.slice(1))
      } else {
        possibleMatches.delete(sequence)
        callback(event)
      }
    })

    if (timer) clearTimeout(timer)
    timer = setTimeout(() => possibleMatches.clear(), sequenceTimeout)
  }

  target.addEventListener('keydown', onKeyDown as any)

  return () => {
    target.removeEventListener('keydown', onKeyDown as any)
  }
}
