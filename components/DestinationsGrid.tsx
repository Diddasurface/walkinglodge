'use client'

import { T } from '@/lib/i18n'
import type { Destination, Lang } from '@/lib/types'

const ACCENT = '#E5A547'
const DISPLAY_FONT = 'var(--font-oswald), Oswald, sans-serif'

interface DestinationsGridProps {
  lang: Lang
  destinations: Destination[]
  loading: boolean
}

function SkeletonCard({ cls }: { cls: string }) {
  return (
    <div className={`dest-card ${cls}`} style={{ background: 'rgba(255,255,255,0.04)' }}>
      <div className="dest-img" style={{ background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div className="dest-info">
        <div>
          <div style={{ width: 80, height: 10, borderRadius: 4, background: 'rgba(255,255,255,0.08)', marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ width: 140, height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.1)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        </div>
      </div>
    </div>
  )
}

export default function DestinationsGrid({ lang, destinations, loading }: DestinationsGridProps) {
  const tr = T[lang]
  const items = destinations.slice(0, 6)

  return (
    <section className="destinations" id="destinations">
      <div className="section-head">
        <div>
          <span className="section-eyebrow">
            <span className="section-eyebrow-bar" style={{ background: ACCENT }} />
            02 - {lang === 'es' ? 'ACTIVIDADES' : 'ACTIVITIES'}
          </span>
          <h2 className="section-title" style={{ fontFamily: DISPLAY_FONT }}>
            {tr.sectionDestinos}
          </h2>
        </div>
        <p className="section-sub">{tr.sectionDestinosSub}</p>
      </div>

      <div className="dest-grid">
        {loading
          ? [0, 1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} cls={`dest-card-${i}`} />)
          : items.map((d, i) => (
              <a key={d.id} href={`/destinos/${d.id}`} className={`dest-card dest-card-${i}`}>
                <div className="dest-img" style={{ backgroundImage: `url(${d.img})` }}>
                  <div className="dest-img-shade" />
                </div>
                <div className="dest-info">
                  <div>
                    <span className="dest-region">{d.sub[lang]}</span>
                    <h3 className="dest-name" style={{ fontFamily: DISPLAY_FONT }}>
                      {d.short[lang].replace('\n', ' ')}
                    </h3>
                  </div>
                  <span className="dest-arrow" style={{ color: ACCENT }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </span>
                </div>
              </a>
            ))
        }
      </div>
    </section>
  )
}
