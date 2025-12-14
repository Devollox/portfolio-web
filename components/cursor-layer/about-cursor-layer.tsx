import { useAboutCursors } from 'hook/useAboutCursors'
import { useTheme } from 'next-themes'

const AboutCursorLayer = () => {
  const { cursors } = useAboutCursors()
  const { resolvedTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  const darkRgb = '20, 24, 32'
  const lightRgb = '245, 243, 220'

  return (
    <div
      style={{
        pointerEvents: 'none',
        position: 'fixed',
        inset: 0,
        zIndex: 50
      }}
    >
      {cursors.map(cursor => (
        <div
          key={cursor.id}
          style={{
            position: 'fixed',
            left: cursor.x,
            top: cursor.y,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: isDark ? `rgb(${lightRgb})` : `rgb(${darkRgb})`,
              boxShadow: isDark
                ? `0 0 8px rgba(${lightRgb}, 0.6)`
                : `0 0 6px rgba(${darkRgb}, 0.5)`,
              border: isDark
                ? '1px solid rgba(10,10,10,0.9)'
                : '1px solid rgba(255,255,255,0.8)'
            }}
          />
          <span
            style={{
              padding: '1px 6px',
              borderRadius: 999,
              background: isDark
                ? 'rgba(10,10,12,0.9)'
                : 'rgba(245, 243, 240, 0.96)',
              color: isDark ? '#f7f7ff' : '#181818',
              fontSize: '9px',
              whiteSpace: 'nowrap',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(6px)'
            }}
          >
            {cursor.name}
          </span>
        </div>
      ))}
    </div>
  )
}

export default AboutCursorLayer
