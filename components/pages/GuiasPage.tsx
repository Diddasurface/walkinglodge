'use client'

import { useEffect, useState } from 'react'
import PageHero from '@/components/PageHero'
import { PAGE_T } from '@/lib/i18n'
import type { Lang, Guide } from '@/lib/types'

const ACCENT = '#E5A547'
const DISPLAY_FONT = 'var(--font-oswald), Oswald, sans-serif'

interface GuiasPageProps {
  lang: Lang
}

export default function GuiasPage({ lang }: GuiasPageProps) {
  const tr = PAGE_T[lang]
  const [guides, setGuides] = useState<Guide[]>([])

  useEffect(() => {
    fetch('/api/guides')
      .then((r) => r.json())
      .then(setGuides)
  }, [])

  return (
    <div className="page page-guias">
      <PageHero
        eyebrow={lang === 'es' ? '03 — EQUIPO' : '03 — TEAM'}
        title={tr.guiasHero}
        lead={tr.guiasLead}
        accent={ACCENT}
        bg="https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?w=1920&q=80&auto=format&fit=crop"
      />

      <div className="guias-stats">
        {[
          { value: '72', label: lang === 'es' ? 'exploradores certificados' : 'certified explorers' },
          { value: '12', label: lang === 'es' ? 'años promedio en ruta' : 'avg years on trail' },
          { value: '9', label: lang === 'es' ? 'idiomas hablados' : 'languages spoken' },
          { value: '100%', label: lang === 'es' ? 'locales de Madre de Dios' : 'local to Madre de Dios' },
        ].map((s) => (
          <div key={s.label}>
            <strong style={{ fontFamily: DISPLAY_FONT, color: 'var(--ink-0)' }}>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="guias-grid">
        {guides.map((g, i) => (
          <article key={i} className="guia-card">
            <div className="guia-img" style={{ backgroundImage: `url(${g.img})` }}>
              <div className="guia-shade" />
              <div className="guia-overlay">
                <div className="guia-langs">
                  {g.langs.map((l) => <span key={l}>{l}</span>)}
                </div>
              </div>
            </div>
            <div className="guia-body">
              <span className="guia-base">{g.base[lang]}</span>
              <h3 className="guia-name" style={{ fontFamily: DISPLAY_FONT }}>{g.name}</h3>
              <p className="guia-bio">{g.bio[lang]}</p>
              <div className="guia-meta">
                <div>
                  <span>{tr.guiasSpec}</span>
                  <strong>{g.spec[lang]}</strong>
                </div>
                <div>
                  <span>{tr.guiasYears}</span>
                  <strong style={{ color: ACCENT }}>{g.years}</strong>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
