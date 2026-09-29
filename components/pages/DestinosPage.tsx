'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import { PAGE_T } from '@/lib/i18n'
import type { Lang, Destination } from '@/lib/types'

const ACCENT = '#E5A547'
const DISPLAY_FONT = 'var(--font-oswald), Oswald, sans-serif'

interface DestinosPageProps {
  lang: Lang
}

type DestinationWithTag = Destination & { tag: string }

export default function DestinosPage({ lang }: DestinosPageProps) {
  const tr = PAGE_T[lang]
  const [filter, setFilter] = useState('all')
  const [destinations, setDestinations] = useState<DestinationWithTag[]>([])
  const [loading, setLoading] = useState(true)
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    fetch('/api/destinations')
      .then((r) => r.json())
      .then(setDestinations)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const syncTheme = () => setIsLight(root.classList.contains('light'))
    syncTheme()
    const observer = new MutationObserver(syncTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const filtered =
    filter === 'all' ? destinations : destinations.filter((d) => d.tag === filter)

  const filters = [
    ['all', tr.filterAll],
    ['rio', tr.filterRio],
    ['fauna', tr.filterFauna],
    ['bosque', tr.filterBosque],
  ] as const

  return (
    <div className="page page-destinos">
      <PageHero
        eyebrow={lang === 'es' ? '01 - ACTIVIDADES' : '01 - ACTIVITIES'}
        title={tr.destinosHero}
        lead={tr.destinosLead}
        accent={ACCENT}
        bg="https://mistertravel.news/wp-content/uploads/2025/01/Canopy-ou-zipline-Paradise-Ecolodge-Madre-de-Dios.-Luis-Francisco-Gonzales-%C2%A9PROMPERU.jpg"
      />

      <div className="filter-bar">
        <span className="filter-label">{tr.filterRegion}</span>
        <div className="filter-chips">
          {filters.map(([v, l]) => (
            <button
              key={v}
              className={`chip ${filter === v ? 'chip-active' : ''}`}
              onClick={() => setFilter(v)}
              style={filter === v ? { borderColor: ACCENT, color: ACCENT } : undefined}
            >
              {l}
            </button>
          ))}
        </div>
        <span className="filter-count">
          {loading ? '...' : `${filtered.length} ${lang === 'es' ? 'actividades' : 'activities'}`}
        </span>
      </div>

      <div className="dest-catalog">
        {loading ? (
          <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <div style={{ width: 36, height: 36, border: `2px solid ${ACCENT}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : filtered.map((d, i) => (
          <Link key={d.id} href={`/destinos/${d.id}`} className="catalog-card">
            <div className="catalog-img" style={{ backgroundImage: `url(${isLight && d.imgLight ? d.imgLight : !isLight && d.imgDark ? d.imgDark : d.img})` }}>
              <div className="catalog-shade" />
              <span className="catalog-num" style={{ fontFamily: DISPLAY_FONT }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="catalog-body">
              <span className="catalog-region">{d.sub[lang]}</span>
              <h3 className="catalog-name" style={{ fontFamily: DISPLAY_FONT }}>
                {(d.short[lang] || d.name[lang]).replaceAll('\n', ' ')}
              </h3>
              <p className="catalog-desc">{d.desc[lang]}</p>
              <span className="catalog-link" style={{ color: ACCENT }}>
                {lang === 'es' ? 'Ver actividad' : 'View activity'}
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
