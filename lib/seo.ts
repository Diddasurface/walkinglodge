import type { Metadata } from 'next'

export const SITE_URL = 'https://walkinglodge.com'
export const SITE_NAME = 'Walking Lodge'
export const DEFAULT_DESCRIPTION =
  'Lodge amazonico a dos horas rio abajo de Puerto Maldonado, con alojamiento y actividades de naturaleza en Madre de Dios, Peru.'
export const DEFAULT_OG_IMAGE = '/images/lodge-day.webp'

interface PageMetadataOptions {
  title: string
  description: string
  path: string
  image?: string
  noIndex?: boolean
}

export function createPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
    openGraph: {
      type: 'website',
      locale: 'es_PE',
      alternateLocale: ['en_US'],
      url: canonicalPath,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: image, width: 1920, height: 1081, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}
