import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Walking Lodge',
    short_name: 'Walking Lodge',
    description: 'Lodge amazonico y actividades de naturaleza en Madre de Dios, Peru.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0c0d',
    theme_color: '#e5a547',
    lang: 'es-PE',
  }
}
