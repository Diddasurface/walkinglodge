'use client'

import { useState, useEffect } from 'react'
import PageHero from '@/components/PageHero'
import { PAGE_T } from '@/lib/i18n'
import type { Lang, Tour } from '@/lib/types'

const ACCENT = '#E5A547'
const DISPLAY_FONT = 'var(--font-oswald), Oswald, sans-serif'

interface ExperienciasPageProps {
  lang: Lang
}

export default function ExperienciasPage({ lang }: ExperienciasPageProps) {
  const tr = PAGE_T[lang]
  const [filter, setFilter] = useState('all')
  const [tours, setTours] = useState<Tour[]>([])

  useEffect(() => {
    fetch('/api/tours')
      .then((r) => r.json())
      .then(setTours)
  }, [])

  const filtered = filter === 'all' ? tours : tours.filter((x) => x.type === filter.toUpperCase())

  const typeLabel = (type: string) => {
    const map: Record<string, string> = {
      ADV: tr.tipoAdv,
      CUL: tr.tipoCul,
      NAT: tr.tipoNat,
      LUX: tr.tipoLux,
      FAM: tr.tipoLux,
    }
    return map[type] ?? type
  }

  const filters = [
    ['all', tr.tipoAll],
    ['adv', tr.tipoAdv],
    ['cul', tr.tipoCul],
    ['nat', tr.tipoNat],
    ['lux', tr.tipoLux],
  ] as const

  return (
    <div className="page page-experiencias">
      <PageHero
        eyebrow={lang === 'es' ? '02 - PROGRAMAS' : '02 - PROGRAMS'}
        title={tr.expHero}
        lead={tr.expLead}
        accent={ACCENT}
        bg="/images/lago-sandoval.webp"
      />

      <div className="filter-bar">
        <span className="filter-label">{tr.filterTipo}</span>
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
          {filtered.length} {lang === 'es' ? 'experiencias' : 'experiences'}
        </span>
      </div>

      <div className="exp-list">
        {filtered.map((tour, i) => (
          <article key={tour.id} className="exp-row">
            <div className="exp-row-num" style={{ fontFamily: DISPLAY_FONT }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="exp-row-img" style={{ backgroundImage: `url(${tour.img})` }}>
              <div className="exp-row-shade" />
            </div>
            <div className="exp-row-body">
              <span className="exp-row-tag" style={{ color: ACCENT }}>
                {typeLabel(tour.type)}
              </span>
              <h3 className="exp-row-title" style={{ fontFamily: DISPLAY_FONT }}>
                {tour.title[lang]}
              </h3>
              <p className="exp-row-sub">{tour.sub[lang]}</p>
              <div className="exp-row-stats">
                <div>
                  <span>{tr.duration}</span>
                  <strong>{tour.days[lang]}</strong>
                </div>
                <div>
                  <span>{tr.level}</span>
                  <strong>{tour.level[lang]}</strong>
                </div>
                <div>
                  <span>{tr.from}</span>
                  <strong style={{ color: ACCENT }}>USD {tour.price}</strong>
                </div>
              </div>
            </div>
            <button className="exp-row-cta" style={{ borderColor: ACCENT, color: ACCENT }}>
              {tr.bookNow}
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
