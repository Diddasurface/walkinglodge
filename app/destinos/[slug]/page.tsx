'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useLang } from '@/components/LangProvider'
import { DestGallery } from '@/components/DestGallery'

const ACCENT = '#E5A547'
const DF = 'var(--font-oswald), Oswald, sans-serif'

interface Review { id: string; rating: number; comment: string | null; userName: string; createdAt: string }
interface DayItem { id: string; dayNumber: number; title: { es: string; en: string }; desc: { es: string; en: string }; meals: { es: string; en: string } }
interface WarnItem { id: string; text: { es: string; en: string }; severity: string }
interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  provider: string | null
  thumbUrl: string | null
  caption: { es: string; en: string }
}

interface DestDetail {
  slug: string
  name:           { es: string; en: string }
  region:         { es: string; en: string }
  sub:            { es: string; en: string }
  desc:           { es: string; en: string }
  experience:     { es: string; en: string }
  img: string
  imgLight?: string
  imgDark?: string
  tag: string
  altitudeM:      number | null
  durationDays:   number | null
  mapAddress:     string | null
  contactEmail:   string | null
  contactWhatsapp: string | null
  images:         MediaItem[]
  warnings:       WarnItem[]
  days:           DayItem[]
  reviews:        Review[]
}

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: ACCENT, letterSpacing: '2px', fontSize: '14px' }}>
      {Array.from({ length: 5 }, (_, i) => i < rating ? '★' : '☆').join('')}
    </span>
  )
}

const SEVERITY_STYLES: Record<string, { bg: string; border: string; icon: string }> = {
  info:    { bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.3)',  icon: 'ℹ' },
  warning: { bg: 'rgba(229,165,71,0.10)',  border: 'rgba(229,165,71,0.4)',  icon: '⚠' },
  danger:  { bg: 'rgba(239,68,68,0.09)',   border: 'rgba(239,68,68,0.35)',  icon: '⛔' },
}

export default function DestinoDetailPage() {
  const { lang } = useLang()
  const params = useParams<{ slug: string }>()
  const [dest, setDest] = useState<DestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    if (!params?.slug) return
    const ctrl = new AbortController()
    fetch(`/api/destinations/${params.slug}`, { signal: ctrl.signal })
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { setDest(data); setLoading(false) })
      .catch(err => { if (err.name !== 'AbortError') { setNotFound(true); setLoading(false) } })
    return () => ctrl.abort()
  }, [params?.slug])

  useEffect(() => {
    const root = document.documentElement
    const syncTheme = () => setIsLight(root.classList.contains('light'))
    syncTheme()
    const observer = new MutationObserver(syncTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-0)' }}>
        <div style={{ width: 40, height: 40, border: `2px solid ${ACCENT}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  if (notFound || !dest) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', background: 'var(--bg-0)', color: 'var(--ink-0)' }}>
        <p style={{ fontFamily: DF, fontSize: '5rem', color: 'var(--ink-3)' }}>404</p>
        <p style={{ color: 'var(--ink-2)' }}>{lang === 'es' ? 'Destino no encontrado' : 'Destination not found'}</p>
        <Link href="/destinos" style={{ color: ACCENT, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          ← {lang === 'es' ? 'Volver a destinos' : 'Back to destinations'}
        </Link>
      </div>
    )
  }

  const mapsUrl = dest.mapAddress
    ? `https://maps.google.com/maps?q=${encodeURIComponent(dest.mapAddress)}`
    : null

  const whatsappUrl = dest.contactWhatsapp
    ? `https://wa.me/${dest.contactWhatsapp.replace(/\D/g, '')}`
    : null
  const heroImg = isLight && dest.imgLight ? dest.imgLight : !isLight && dest.imgDark ? dest.imgDark : dest.img

  return (
    <div className="dest-detail-page">
      {/* ── HERO ── */}
      <div className="dest-detail-hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="dest-detail-hero-shade" />
        <div className="dest-detail-hero-inner">
          <Link href="/destinos" className="dest-detail-back">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            {lang === 'es' ? 'Todos los destinos' : 'All destinations'}
          </Link>

          <div className="dest-detail-hero-meta">
            {dest.durationDays && (
              <span className="dest-detail-badge">
                {dest.durationDays} {lang === 'es' ? `día${dest.durationDays > 1 ? 's' : ''}` : `day${dest.durationDays > 1 ? 's' : ''}`}
              </span>
            )}
            {dest.altitudeM && (
              <span className="dest-detail-badge">
                {dest.altitudeM.toLocaleString()} m {lang === 'es' ? 's.n.m.' : 'a.s.l.'}
              </span>
            )}
          </div>

          <p className="dest-detail-sub">{dest.sub[lang] || dest.region[lang]}</p>
          <h1 className="dest-detail-title" style={{ fontFamily: DF }}>
            {dest.name[lang].replace('\n', ' ')}
          </h1>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="dest-detail-body">

        {/* Descripción + Experiencia */}
        {(dest.desc[lang] || dest.experience[lang]) && (
          <section className="dest-detail-section">
            <div className="dest-detail-section-head">
              <span className="section-eyebrow">
                <span className="section-eyebrow-bar" style={{ background: ACCENT }} />
                {lang === 'es' ? 'La Experiencia' : 'The Experience'}
              </span>
            </div>
            {dest.desc[lang] && (
              <p className="dest-detail-lead">{dest.desc[lang]}</p>
            )}
            {dest.experience[lang] && (
              <p className="dest-detail-text" style={{ whiteSpace: 'pre-line' }}>
                {dest.experience[lang]}
              </p>
            )}
          </section>
        )}

        {/* Galería */}
        {dest.images.length > 0 && (
          <section className="dest-detail-section">
            <div className="dest-detail-section-head">
              <span className="section-eyebrow">
                <span className="section-eyebrow-bar" style={{ background: ACCENT }} />
                {lang === 'es' ? 'Galería' : 'Gallery'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--ink-3)', letterSpacing: '0.1em' }}>
                {dest.images.length} {lang === 'es' ? 'elemento(s)' : 'item(s)'}
              </span>
            </div>
            <DestGallery items={dest.images} lang={lang} />
          </section>
        )}

        {/* Itinerario */}
        {dest.days.length > 0 && (
          <section className="dest-detail-section dest-detail-section--alt">
            <div className="dest-detail-section-head">
              <span className="section-eyebrow">
                <span className="section-eyebrow-bar" style={{ background: ACCENT }} />
                {lang === 'es'
                  ? `Itinerario · ${dest.durationDays ?? dest.days.length} días`
                  : `Itinerary · ${dest.durationDays ?? dest.days.length} days`}
              </span>
            </div>
            <div className="dest-detail-days">
              {dest.days.map((day) => (
                <div key={day.id} className="dest-detail-day">
                  <div className="dest-detail-day-num" style={{ fontFamily: DF, color: ACCENT }}>
                    {lang === 'es' ? 'Día' : 'Day'} {day.dayNumber}
                  </div>
                  <div className="dest-detail-day-content">
                    <h3 className="dest-detail-day-title" style={{ fontFamily: DF }}>{day.title[lang]}</h3>
                    {day.desc[lang] && (
                      <p className="dest-detail-day-desc">{day.desc[lang]}</p>
                    )}
                    {day.meals[lang] && (
                      <p className="dest-detail-day-meals">
                        <span style={{ color: ACCENT, marginRight: '6px' }}>🍽</span>
                        {day.meals[lang]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Advertencias */}
        {dest.warnings.length > 0 && (
          <section className="dest-detail-section">
            <div className="dest-detail-section-head">
              <span className="section-eyebrow">
                <span className="section-eyebrow-bar" style={{ background: ACCENT }} />
                {lang === 'es' ? 'Advertencias' : 'Important Notices'}
              </span>
            </div>
            <div className="dest-detail-warnings">
              {dest.warnings.map((w) => {
                const s = SEVERITY_STYLES[w.severity] ?? SEVERITY_STYLES.warning
                return (
                  <div key={w.id} className="dest-detail-warning" style={{ background: s.bg, borderColor: s.border }}>
                    <span className="dest-detail-warning-icon">{s.icon}</span>
                    <span>{w.text[lang]}</span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Ubicación + Contacto */}
        <div className="dest-detail-two-col">
          {mapsUrl && (
            <section className="dest-detail-section">
              <div className="dest-detail-section-head">
                <span className="section-eyebrow">
                  <span className="section-eyebrow-bar" style={{ background: ACCENT }} />
                  {lang === 'es' ? 'Ubicación' : 'Location'}
                </span>
              </div>
              <p className="dest-detail-map-addr">{dest.mapAddress}</p>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="dest-detail-map-btn" style={{ borderColor: ACCENT, color: ACCENT }}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" stroke="none"/>
                </svg>
                {lang === 'es' ? 'Ver en Google Maps' : 'View on Google Maps'}
              </a>
            </section>
          )}

          {(dest.contactEmail || dest.contactWhatsapp) && (
            <section className="dest-detail-section">
              <div className="dest-detail-section-head">
                <span className="section-eyebrow">
                  <span className="section-eyebrow-bar" style={{ background: ACCENT }} />
                  {lang === 'es' ? 'Contáctanos' : 'Contact Us'}
                </span>
              </div>
              <div className="dest-detail-contacts">
                {dest.contactEmail && (
                  <a href={`mailto:${dest.contactEmail}`} className="dest-detail-contact-item">
                    <span className="dest-detail-contact-icon" style={{ background: `${ACCENT}18`, color: ACCENT }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
                      </svg>
                    </span>
                    <div>
                      <span className="dest-detail-contact-label">{lang === 'es' ? 'Correo' : 'Email'}</span>
                      <span className="dest-detail-contact-val">{dest.contactEmail}</span>
                    </div>
                  </a>
                )}
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="dest-detail-contact-item">
                    <span className="dest-detail-contact-icon" style={{ background: 'rgba(37,211,102,0.12)', color: '#25d366' }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </span>
                    <div>
                      <span className="dest-detail-contact-label">WhatsApp</span>
                      <span className="dest-detail-contact-val">{dest.contactWhatsapp}</span>
                    </div>
                  </a>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Reseñas */}
        {dest.reviews.length > 0 && (
          <section className="dest-detail-section">
            <div className="dest-detail-section-head">
              <span className="section-eyebrow">
                <span className="section-eyebrow-bar" style={{ background: ACCENT }} />
                {lang === 'es' ? 'Reseñas de clientes' : 'Client Reviews'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--ink-3)', letterSpacing: '0.1em' }}>
                {dest.reviews.length} {lang === 'es' ? 'reseña(s)' : 'review(s)'}
              </span>
            </div>
            <div className="dest-detail-reviews">
              {dest.reviews.map((r) => (
                <div key={r.id} className="dest-detail-review">
                  <div className="dest-detail-review-head">
                    <div>
                      <p className="dest-detail-review-name">{r.userName}</p>
                      <Stars rating={r.rating} />
                    </div>
                    <span className="dest-detail-review-date">
                      {new Date(r.createdAt).toLocaleDateString(lang === 'es' ? 'es-PE' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  {r.comment && <p className="dest-detail-review-comment">{r.comment}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA final */}
        <div className="dest-detail-cta">
          <p className="dest-detail-cta-label" style={{ fontFamily: DF }}>
            {lang === 'es' ? '¿Listo para la aventura?' : 'Ready for the adventure?'}
          </p>
          <div className="dest-detail-cta-actions">
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="dest-detail-cta-btn dest-detail-cta-btn--primary" style={{ background: ACCENT, color: '#111' }}>
                {lang === 'es' ? 'Reservar por WhatsApp' : 'Book via WhatsApp'}
              </a>
            )}
            {dest.contactEmail && (
              <a href={`mailto:${dest.contactEmail}`} className="dest-detail-cta-btn dest-detail-cta-btn--outline" style={{ borderColor: ACCENT, color: ACCENT }}>
                {lang === 'es' ? 'Escribirnos por correo' : 'Send us an email'}
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
