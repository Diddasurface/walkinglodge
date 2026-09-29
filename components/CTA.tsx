import { T } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

const ACCENT = '#E5A547'
const DISPLAY_FONT = 'var(--font-oswald), Oswald, sans-serif'

interface CTAProps {
  lang: Lang
}

export default function CTA({ lang }: CTAProps) {
  const tr = T[lang]

  return (
    <section className="cta" id="cta">
      <div
        className="cta-bg"
        style={{
          backgroundImage:
            'url(/images/lago-sandoval.webp)',
        }}
      />
      <div className="cta-shade" />
      <div className="cta-inner">
        <span className="section-eyebrow light">
          <span className="section-eyebrow-bar" style={{ background: ACCENT }} />
          {lang === 'es' ? 'EMPIEZA HOY' : 'START TODAY'}
        </span>
        <h2 className="cta-title" style={{ fontFamily: DISPLAY_FONT }}>
          {tr.ctaTitle.split('\n').map((l, i) => <span key={i}>{l}</span>)}
        </h2>
        <p className="cta-desc">{tr.ctaDesc}</p>
        <button className="btn-pill cta-btn" style={{ borderColor: ACCENT }}>
          <span style={{ color: ACCENT }}>{tr.ctaBtn}</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={ACCENT} strokeWidth="1.6">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  )
}
