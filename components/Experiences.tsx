'use client'

import { T } from '@/lib/i18n'
import type { Tour, Lang } from '@/lib/types'

const ACCENT = '#E5A547'
const DISPLAY_FONT = 'var(--font-oswald), Oswald, sans-serif'

const TYPE_LABEL: Record<string, { es: string; en: string }> = {
  ADV: { es: 'Aventura',   en: 'Adventure' },
  NAT: { es: 'Naturaleza', en: 'Nature' },
  CUL: { es: 'Cultura',    en: 'Culture' },
  LUX: { es: 'Lujo',       en: 'Luxury' },
  FAM: { es: 'Familia',    en: 'Family' },
}

interface ExperiencesProps {
  lang: Lang
  tours: Tour[]
  loading: boolean
}

function SkeletonCard() {
  return (
    <article className="exp-card">
      <div className="exp-img" style={{ background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div className="exp-body">
        <div style={{ width: '70%', height: 22, borderRadius: 4, background: 'rgba(255,255,255,0.08)', marginBottom: 10, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ width: '90%', height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.05)', marginBottom: 20, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ width: '60%', height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
    </article>
  )
}

export default function Experiences({ lang, tours, loading }: ExperiencesProps) {
  const tr = T[lang]

  const items = tours.filter(t => t.featured).slice(0, 3)

  return (
    <section className="experiences" id="experiences">
      <div className="section-head">
        <div>
          <span className="section-eyebrow">
            <span className="section-eyebrow-bar" style={{ background: ACCENT }} />
            03 - {lang === 'es' ? 'EXPERIENCIAS' : 'EXPERIENCES'}
          </span>
          <h2 className="section-title" style={{ fontFamily: DISPLAY_FONT }}>
            {tr.sectionExperiencias}
          </h2>
        </div>
        <p className="section-sub">{tr.sectionExperienciasSub}</p>
      </div>

      <div className="exp-grid">
        {loading
          ? [0, 1, 2].map(i => <SkeletonCard key={i} />)
          : items.map((t, i) => {
              const typeKey = t.type
              const tag = (TYPE_LABEL[typeKey] ?? TYPE_LABEL.ADV)[lang]
              const price = t.price ? `USD ${t.price}` : '—'

              return (
                <article key={t.id} className="exp-card">
                  <div className="exp-img" style={{ backgroundImage: `url(${t.img})` }}>
                    <span className="exp-tag">{tag}</span>
                    <span className="exp-num" style={{ fontFamily: DISPLAY_FONT }}>0{i + 1}</span>
                  </div>
                  <div className="exp-body">
                    <h3 className="exp-title" style={{ fontFamily: DISPLAY_FONT }}>{t.title[lang]}</h3>
                    <p className="exp-sub">{t.sub[lang]}</p>
                    <div className="exp-meta">
                      <div className="exp-meta-row">
                        <span className="exp-meta-label">{tr.duration}</span>
                        <span className="exp-meta-val">{t.days[lang]}</span>
                      </div>
                      <div className="exp-meta-row">
                        <span className="exp-meta-label">{tr.from}</span>
                        <span className="exp-meta-val" style={{ color: ACCENT }}>
                          {price}<span className="exp-meta-pp">{tr.perPerson}</span>
                        </span>
                      </div>
                    </div>
                    <a href="/experiencias" className="exp-btn">
                      <span>{tr.bookNow}</span>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  </div>
                </article>
              )
            })}
      </div>
    </section>
  )
}
