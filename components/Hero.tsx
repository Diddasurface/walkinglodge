'use client'

import { useState, useEffect, useCallback } from 'react'
import { T } from '@/lib/i18n'
import type { Destination, Lang } from '@/lib/types'
import Coverflow from './Coverflow'

const ACCENT = '#E5A547'
const DISPLAY_FONT = 'var(--font-oswald), Oswald, sans-serif'
const AUTO_ADVANCE_MS = 6000

interface HeroProps {
  lang: Lang
  destinations: Destination[]
  loading: boolean
}

export default function Hero({ lang, destinations, loading }: HeroProps) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isLight, setIsLight] = useState(false)
  const tr = T[lang]
  const total = destinations.length

  const go = useCallback((next: number) => {
    if (total === 0) return
    setActive(((next % total) + total) % total)
  }, [total])

  const goNext = useCallback(() => go(active + 1), [active, go])
  const goPrev = useCallback(() => go(active - 1), [active, go])

  // reset index when destinations load
  useEffect(() => { setActive(0) }, [total])

  useEffect(() => {
    if (paused || total === 0) return
    const id = setTimeout(goNext, AUTO_ADVANCE_MS)
    return () => clearTimeout(id)
  }, [active, paused, goNext, total])

  useEffect(() => {
    const root = document.documentElement
    const syncTheme = () => setIsLight(root.classList.contains('light'))
    syncTheme()
    const observer = new MutationObserver(syncTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const imageFor = useCallback((d: Destination) => {
    if (isLight && d.imgLight) return d.imgLight
    if (!isLight && d.imgDark) return d.imgDark
    return d.img
  }, [isLight])

  // Loading skeleton
  if (loading || total === 0) {
    return (
      <section className="hero">
        <div className="hero-bg-stack">
          <div className="hero-bg active" style={{ background: '#0b0c0d' }}>
            <div className="hero-bg-vignette" />
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-text-col">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ width: 140, height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.07)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ width: '70%', height: 52, borderRadius: 6, background: 'rgba(255,255,255,0.07)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ width: '50%', height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            </div>
          </div>
        </div>
      </section>
    )
  }

  const current = destinations[active]

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background slides */}
      <div className="hero-bg-stack">
        {destinations.map((d, i) => (
          <div
            key={d.id}
            className={`hero-bg ${i === active ? 'active' : ''}`}
            style={{ backgroundImage: `url(${imageFor(d)})` }}
          >
            <div className="hero-bg-vignette" />
          </div>
        ))}
      </div>

      <div className="hero-content">
        <div className="hero-text-col">
          <div key={`txt-${active}`} className="hero-text-anim">
            <span className="hero-eyebrow">
              <span className="hero-eyebrow-bar" style={{ background: ACCENT }} />
              {current.region[lang]}
            </span>
            <h1 className="hero-title" style={{ fontFamily: DISPLAY_FONT }}>
              {current.name[lang].split('\n').map((line, i) => (
                <span key={i} className="hero-title-line" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="hero-desc">{current.desc[lang]}</p>
            <div className="hero-actions">
              <button className="btn-circle" style={{ background: ACCENT }} aria-label={tr.save}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M6 3h12v18l-6-4-6 4z" />
                </svg>
              </button>
              <a href="/destinos" className="btn-pill">
                <span>{tr.discover}</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="hero-cards-col">
          <Coverflow items={destinations} active={active} onSelect={go} lang={lang} accent={ACCENT} isLight={isLight} />
        </div>
      </div>

      {/* Controls */}
      <div className="hero-controls">
        <div className="hero-arrows">
          <button className="arrow-btn" onClick={goPrev} aria-label="Previous">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button className="arrow-btn" onClick={goNext} aria-label="Next">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
        <div className="hero-progress">
          <div className="hero-progress-track">
            <div
              key={`p-${active}-${paused}`}
              className="hero-progress-fill"
              style={{
                background: ACCENT,
                animation: paused ? 'none' : `progressFill ${AUTO_ADVANCE_MS}ms linear forwards`,
              }}
            />
          </div>
        </div>
        <div className="hero-counter" style={{ fontFamily: DISPLAY_FONT }}>
          <span className="counter-num" style={{ color: ACCENT }}>
            {String(active + 1).padStart(2, '0')}
          </span>
          <span className="counter-total">/ {String(total).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="hero-scroll-hint">
        <span>SCROLL</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  )
}
