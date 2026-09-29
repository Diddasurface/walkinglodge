'use client'

import type { Destination, Lang } from '@/lib/types'

interface CoverflowProps {
  items: Destination[]
  active: number
  onSelect: (i: number) => void
  lang: Lang
  accent: string
  isLight?: boolean
}

export default function Coverflow({ items, active, onSelect, lang, accent, isLight = false }: CoverflowProps) {
  const count = items.length

  function slotFor(i: number) {
    return ((i - active) + count) % count
  }

  return (
    <div className="coverflow">
      <div className="coverflow-track">
        {items.map((d, i) => {
          const slot = slotFor(i)
          const visible = slot <= 3
          const isActive = slot === 0
          // Active card sits behind; non-active cards fan out in front with decreasing offset
          const z = slot === 0 ? 1 : 100 - slot
          const tx = slot === 0 ? 0 : 300 + (slot - 1) * 132
          const scale = slot === 0 ? 1 : 0.86 - (slot - 1) * 0.04
          const rotY = slot === 0 ? 0 : -12
          const opacity = visible ? (slot === 0 ? 1 : 0.95 - (slot - 1) * 0.1) : 0

          return (
            <div
              key={d.id}
              className={`cf-card cf-style-glass ${isActive ? 'active' : ''}`}
              style={{
                transform: `translate3d(${tx}px, 0, 0) scale(${scale}) rotateY(${rotY}deg)`,
                zIndex: z,
                opacity,
                pointerEvents: visible ? 'auto' : 'none',
              }}
              onClick={() => onSelect(i)}
            >
              <div
                className="cf-card-img"
                style={{ backgroundImage: `url(${isLight && d.imgLight ? d.imgLight : !isLight && d.imgDark ? d.imgDark : d.img})` }}
              >
                <div className="cf-card-shade" />
              </div>
              <div className="cf-card-meta">
                <span className="cf-card-sub">{d.sub[lang]}</span>
                <h3 className="cf-card-title">
                  {d.short[lang].split('\n').map((line, j) => (
                    <span key={j}>{line}</span>
                  ))}
                </h3>
              </div>
              {isActive && (
                <div className="cf-card-ring" style={{ borderColor: accent }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
