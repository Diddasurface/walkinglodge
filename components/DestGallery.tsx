'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { parseVideoUrl } from '@/lib/media'

const ACCENT = '#E5A547'
const MAX_VISIBLE = 6

export interface GalleryItem {
  id: string
  type: 'image' | 'video'
  url: string
  provider: string | null
  thumbUrl: string | null
  caption: { es: string; en: string }
}

interface DestGalleryProps {
  items: GalleryItem[]
  lang: 'es' | 'en'
}

function thumb(item: GalleryItem) {
  return item.type === 'video' ? (item.thumbUrl ?? '') : item.url
}

function embedUrl(item: GalleryItem) {
  return parseVideoUrl(item.url)?.embedUrl ?? item.url
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PlayBadge({ size = 48 }: { size?: number }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size,
      borderRadius: '50%',
      background: `rgba(229,165,71,0.92)`,
      backdropFilter: 'blur(6px)',
      flexShrink: 0,
    }}>
      <svg viewBox="0 0 24 24" width={size * 0.38} height={size * 0.38} fill="white">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  )
}

function ZoomBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 42, height: 42,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.14)',
      border: '1.5px solid rgba(255,255,255,0.35)',
      backdropFilter: 'blur(6px)',
    }}>
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="white" strokeWidth="2.2">
        <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        <path d="M11 8v6M8 11h6" />
      </svg>
    </span>
  )
}

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({
  items, idx, lang, onClose, onPrev, onNext, onSelect,
}: {
  items: GalleryItem[]; idx: number; lang: 'es' | 'en'
  onClose: () => void; onPrev: () => void; onNext: () => void
  onSelect: (i: number) => void
}) {
  const thumbsRef = useRef<HTMLDivElement>(null)
  const active = items[idx]

  // keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft')  { e.preventDefault(); onPrev() }
      if (e.key === 'ArrowRight') { e.preventDefault(); onNext() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  // scroll-lock
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // scroll thumbnail into view
  useEffect(() => {
    if (!thumbsRef.current) return
    const el = thumbsRef.current.children[idx] as HTMLElement | undefined
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [idx])

  return (
    <div className="dlb" onClick={onClose} role="dialog" aria-modal="true">
      {/* Close */}
      <button className="dlb-close" onClick={onClose} aria-label={lang === 'es' ? 'Cerrar' : 'Close'}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Content wrapper — stop propagation so clicking media doesn't close */}
      <div className="dlb-stage" onClick={e => e.stopPropagation()}>

        {/* ── Media ── */}
        <div className="dlb-media">
          {active.type === 'image' && (
            <img key={active.id} src={active.url} alt={active.caption[lang]} className="dlb-img" />
          )}
          {active.type === 'video' && active.provider === 'direct' && (
            <video key={active.id} src={active.url} controls autoPlay className="dlb-frame" />
          )}
          {active.type === 'video' && active.provider !== 'direct' && (
            <iframe
              key={active.id}
              src={embedUrl(active)}
              className="dlb-frame"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* ── Meta: caption + counter ── */}
        <div className="dlb-meta">
          <span className="dlb-caption">{active.caption[lang]}</span>
          <span className="dlb-counter">{idx + 1} / {items.length}</span>
        </div>

        {/* ── Thumbnail strip ── */}
        {items.length > 1 && (
          <div className="dlb-thumbs" ref={thumbsRef}>
            {items.map((item, i) => {
              const t = thumb(item)
              return (
                <button
                  key={item.id}
                  className={`dlb-thumb${i === idx ? ' dlb-thumb--on' : ''}`}
                  onClick={() => onSelect(i)}
                  aria-label={`${lang === 'es' ? 'Ir a' : 'Go to'} ${i + 1}`}
                >
                  {t
                    ? <img src={t} alt="" loading="lazy" />
                    : <span className="dlb-thumb-fill" />
                  }
                  {item.type === 'video' && (
                    <span className="dlb-thumb-play">
                      <svg viewBox="0 0 24 24" width="10" height="10" fill="white"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Navigation arrows ── */}
      {items.length > 1 && (
        <>
          <button className="dlb-arrow dlb-arrow--l" onClick={e => { e.stopPropagation(); onPrev() }} aria-label={lang === 'es' ? 'Anterior' : 'Previous'}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button className="dlb-arrow dlb-arrow--r" onClick={e => { e.stopPropagation(); onNext() }} aria-label={lang === 'es' ? 'Siguiente' : 'Next'}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </>
      )}
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function DestGallery({ items, lang }: DestGalleryProps) {
  const [idx, setIdx] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const close  = useCallback(() => setIdx(null), [])
  const prev   = useCallback(() => setIdx(i => i !== null ? (i - 1 + items.length) % items.length : null), [items.length])
  const next   = useCallback(() => setIdx(i => i !== null ? (i + 1) % items.length : null), [items.length])
  const select = useCallback((i: number) => setIdx(i), [])

  if (!items.length) return null

  const visible   = items.slice(0, MAX_VISIBLE)
  const remaining = items.length - MAX_VISIBLE

  return (
    <>
      {/* ── Grid ── */}
      <div className={`dg-grid dg-grid--${Math.min(visible.length, 3)}`}>
        {visible.map((item, i) => {
          const t = thumb(item)
          const isHero    = i === 0
          const isVideo   = item.type === 'video'
          const showMore  = i === visible.length - 1 && remaining > 0

          return (
            <div
              key={item.id}
              className={[
                'dg-cell',
                isHero  ? 'dg-cell--hero'  : '',
                isVideo ? 'dg-cell--video' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setIdx(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setIdx(i)}
              aria-label={item.caption[lang] || `${lang === 'es' ? 'Ver elemento' : 'View item'} ${i + 1}`}
            >
              {t
                ? <img src={t} alt={item.caption[lang]} className="dg-img" loading={i < 3 ? 'eager' : 'lazy'} />
                : <span className="dg-fill" />
              }

              <span className="dg-overlay">
                {isVideo ? <PlayBadge size={isHero ? 60 : 46} /> : <ZoomBadge />}
              </span>

              {item.caption[lang] && !showMore && (
                <span className="dg-caption">{item.caption[lang]}</span>
              )}

              {showMore && (
                <span className="dg-more">
                  +{remaining}
                  <span style={{ display: 'block', fontSize: '0.55em', letterSpacing: '0.2em', marginTop: 4, opacity: 0.7, textTransform: 'uppercase' }}>
                    {lang === 'es' ? 'más' : 'more'}
                  </span>
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Lightbox ── */}
      {mounted && idx !== null && createPortal(
        <Lightbox
          items={items}
          idx={idx}
          lang={lang}
          onClose={close}
          onPrev={prev}
          onNext={next}
          onSelect={select}
        />,
        document.body
      )}
    </>
  )
}
