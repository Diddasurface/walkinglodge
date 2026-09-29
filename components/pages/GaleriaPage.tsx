'use client'

import { useEffect, useState } from 'react'
import PageHero from '@/components/PageHero'
import type { Lang } from '@/lib/types'

const ACCENT = '#E5A547'
const DISPLAY_FONT = 'var(--font-oswald), Oswald, sans-serif'

interface GalleryImage {
  id: string
  url: string
  titleEs: string
  titleEn: string
  captionEs: string | null
  captionEn: string | null
  category: string
}

export default function GaleriaPage({ lang }: { lang: Lang }) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<GalleryImage | null>(null)

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then(setImages)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page page-galeria">
      <PageHero
        eyebrow={lang === 'es' ? '03 - NATURALEZA' : '03 - NATURE'}
        title={lang === 'es' ? 'Galeria' : 'Gallery'}
        lead={lang === 'es'
          ? 'Fotografias del rio, el bosque, la fauna y las actividades alrededor del lodge.'
          : 'Photographs of the river, forest, wildlife, and activities around the lodge.'}
        accent={ACCENT}
        bg="/images/lago-sandoval.webp"
      />

      <section className="gallery-grid-wrap">
        {loading ? (
          <div className="gallery-loading">...</div>
        ) : images.map((img, i) => (
          <button
            key={img.id}
            className={`gallery-card gallery-card-${i % 5}`}
            onClick={() => setActive(img)}
          >
            <span className="gallery-img" style={{ backgroundImage: `url(${img.url})` }} />
            <span className="gallery-shade" />
            <span className="gallery-meta">
              <span className="gallery-kicker">{img.category}</span>
              <strong style={{ fontFamily: DISPLAY_FONT }}>{lang === 'es' ? img.titleEs : img.titleEn}</strong>
            </span>
          </button>
        ))}
      </section>

      {active && (
        <div className="gallery-lightbox" onClick={() => setActive(null)} role="dialog" aria-modal="true">
          <button className="gallery-lightbox-close" onClick={() => setActive(null)}>x</button>
          <div className="gallery-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img src={active.url} alt={lang === 'es' ? active.titleEs : active.titleEn} />
            <div>
              <span>{active.category}</span>
              <h2 style={{ fontFamily: DISPLAY_FONT }}>{lang === 'es' ? active.titleEs : active.titleEn}</h2>
              <p>{lang === 'es' ? active.captionEs : active.captionEn}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
