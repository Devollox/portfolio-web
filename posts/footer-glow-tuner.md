---
title: Footer as a Glow Tuner
description: A small interactive footer that lets visitors tweak the glow accent of the site.
slug: footer-glow-tuner
date: 2025-12-10
---

Most footers quietly sit at the bottom of the page with a logo, a copyright line and a couple of links. In this project, the footer became a tiny control panel instead: a place where the visitor can nudge the look of the site without wading through settings.

The idea was to hide a glow color switcher behind the personal mark in the footer. A small Ⓓ button opens a minimal modal where the user picks one of several glow presets. The choice subtly adjusts accent highlights across the layout and persists between visits, so the site remembers the preferred glow.

## Making the footer interactive

The footer is rendered on every page and shows a compact brand block with a mark, a title and a short tagline, followed by social links and the usual copyright line. The mark itself is not just decoration; it is a button that toggles the glow modal. This keeps the footer visually calm while still letting power users discover a bit of customization.

In JSX, the mark is just a button wired to a local `showGlowModal` state:

```javascript
const [showGlowModal, setShowGlowModal] = useState(false)

<button
type="button"
className={styles.footer_mark}
onClick={() => setShowGlowModal(true)}

<span>Ⓓ</span>
</button>
```

When the modal is open, it presents a small list of glow options that depend on the current theme. In light mode, the palette offers deeper, charcoal‑style tones; in dark mode, it shifts to lighter, sand and stone‑like accents that stand out on a dark background. The options are defined as simple objects with a readable label and RGB values for both the glow and its swatch.

## Wiring glow to the theme

The footer reads the current theme from `next-themes` and selects the appropriate set of glow presets. This allows the same interaction model to work in both light and dark modes without extra branching in the JSX. If the theme changes, the list of available glow colors updates automatically and stays in sync with the rest of the design system.

A small hook around `useTheme` keeps the options list in sync with the active theme:

```javascript
const { theme } = useTheme()

const options = useMemo(() => {
  if (theme === 'light') return GLOW_OPTIONS_LIGHT
  return GLOW_OPTIONS_DARK
}, [theme])
```

Each glow preset is applied by updating a few CSS custom properties on the `document.documentElement`: a solid `--glow-color`, a softer `--glow-soft`, and a `--glow-shadow` used for shadows and highlights. Because these are just variables, existing components can consume them without knowing anything about the footer logic, and the accent can be reused in multiple places.

```javascript
const applyGlow = (option: GlowOption) => {
const root = document.documentElement
	root.style.setProperty('--glow-color', rgba(${option.rgb}, 1))
	root.style.setProperty('--glow-soft', rgba(${option.rgb}, 0.35))
	root.style.setProperty('--glow-shadow', rgba(${option.rgb}, 0.3))
}
```

## Remembering the user's choice

To avoid resetting the glow on every page load, the footer stores the selected preset key in `localStorage`. On mount, an effect reads `glow-color`, matches it against the current preset list and applies the corresponding values; if nothing is saved yet, the first option in the list becomes the default. This means the glow feels like part of the user’s personal setup rather than a one‑off toggle.

```javascript
useEffect(() => {
  if (typeof window === 'undefined') return

  const saved = window.localStorage.getItem('glow-color')
  const currentOptions = options

  let option = saved ? currentOptions.find(o => o.value === saved) : undefined

  if (!option) {
    option = currentOptions
  }

  applyGlow(option)
}, [options])
```

Switching between presets is handled by a single helper. It looks up the option by value, updates the CSS variables, writes the new value to `localStorage` and closes the modal. The rest of the layout automatically reacts to the variable change, so there is no need to rerender large parts of the tree.

```javascript
const setGlow = (value: string) => {
  if (typeof document === 'undefined') return

  const option = options.find(o => o.value === value)
  if (!option) return

  applyGlow(option)
  window.localStorage.setItem('glow-color', value)
  setShowGlowModal(false)
}
```

## Hinting that the footer is adjustable

Because the control is intentionally subtle, the footer gives a small hint that the mark is interactive. A short line under the brand block can invite exploration, for example: “Tap the Ⓓ mark to adjust the glow.” This keeps the microcopy light and optional while still guiding users who are curious about personalization.

The mark itself can also have a very gentle pulse or halo on the first visit to suggest that it does something, then settle into a static state afterwards. Paired together, a one‑line hint and a soft motion cue make the footer feel like a quiet, discoverable playground for fine‑tuning the site’s atmosphere instead of just a static block at the bottom of the page.
