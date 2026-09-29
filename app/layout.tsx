import type { Metadata } from 'next'
import { Oswald, Inter } from 'next/font/google'
import './globals.css'
import LangProvider from '@/components/LangProvider'
import SessionProvider from '@/components/providers/SessionProvider'
import {
  createPageMetadata,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo'

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
})

const homeMetadata = createPageMetadata({
  title: 'Walking Lodge | Lodge amazonico en Puerto Maldonado',
  description: DEFAULT_DESCRIPTION,
  path: '/',
})

export const metadata: Metadata = {
  ...homeMetadata,
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Walking Lodge | Lodge amazonico en Puerto Maldonado',
    template: '%s | Walking Lodge',
  },
  applicationName: SITE_NAME,
  keywords: [
    'lodge Puerto Maldonado',
    'lodge Madre de Dios',
    'lodge Tambopata',
    'alojamiento selva amazonica Peru',
    'tours Puerto Maldonado',
    'Lago Sandoval',
    'collpa de guacamayos',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'travel',
}

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Walking Lodge Madre de Dios',
    url: SITE_URL,
    inLanguage: ['es', 'en'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    image: [
      `${SITE_URL}/images/lodge-day.webp`,
      `${SITE_URL}/images/lodge-night.webp`,
      `${SITE_URL}/images/lago-sandoval.webp`,
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Puerto Maldonado',
      addressRegion: 'Madre de Dios',
      addressCountry: 'PE',
    },
    priceRange: '$$',
  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${oswald.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
        />
        <SessionProvider>
          <LangProvider>{children}</LangProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
