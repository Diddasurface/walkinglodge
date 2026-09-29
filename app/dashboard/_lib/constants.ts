import type { Section } from './types'

export const TYPE_CFG: Record<string, { es: string; en: string; cls: string }> = {
  ADV: { es: 'Aventura', en: 'Adventure', cls: 'bg-blue-500/15 text-blue-700 dark:text-blue-400' },
  NAT: { es: 'Naturaleza', en: 'Nature', cls: 'bg-green-500/15 text-green-700 dark:text-green-400' },
  CUL: { es: 'Cultura', en: 'Culture', cls: 'bg-purple-500/15 text-purple-700 dark:text-purple-400' },
  LUX: { es: 'Lujo', en: 'Luxury', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-400' },
  FAM: { es: 'Familia', en: 'Family', cls: 'bg-pink-500/15 text-pink-700 dark:text-pink-400' },
}

export const TAG_CLS: Record<string, string> = {
  rio: 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
  bosque: 'bg-green-500/15 text-green-700 dark:text-green-400',
  fauna: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
}

export const NAV: { id: Section; es: string; en: string; icon: string; soon?: true }[] = [
  { id: 'overview', es: 'Resumen', en: 'Overview', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { id: 'destinos', es: 'Destinos', en: 'Destinations', icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' },
  { id: 'galeria', es: 'Galeria', en: 'Gallery', icon: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 11.5l2.5 3.01L14.5 10l4.5 6H5l3.5-4.5z' },
  { id: 'marca', es: 'Marca', en: 'Brand', icon: 'M12 2l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-4zm0 4.2L8 8v4.2c0 2.6 1.6 4.8 4 5.8 2.4-1 4-3.2 4-5.8V8l-4-1.8z' },
  { id: 'tours', es: 'Tours', en: 'Tours', icon: 'M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z' },
  { id: 'hoteles', es: 'Hoteles', en: 'Hotels', icon: 'M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z' },
  { id: 'guias', es: 'Guias', en: 'Guides', icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
  { id: 'reservas', es: 'Reservas', en: 'Bookings', icon: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' },
  { id: 'clientes', es: 'Clientes', en: 'Clients', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
  { id: 'reportes', es: 'Reportes', en: 'Reports', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z', soon: true },
]

export const SECTION_TITLE: Record<Section, { es: string; en: string }> = {
  overview: { es: 'Resumen', en: 'Overview' },
  destinos: { es: 'Destinos', en: 'Destinations' },
  galeria: { es: 'Galeria', en: 'Gallery' },
  marca: { es: 'Marca', en: 'Brand' },
  tours: { es: 'Tours & Experiencias', en: 'Tours & Experiences' },
  hoteles: { es: 'Hoteles', en: 'Hotels' },
  guias: { es: 'Guias', en: 'Guides' },
  reservas: { es: 'Reservas', en: 'Bookings' },
  clientes: { es: 'Clientes', en: 'Clients' },
  reportes: { es: 'Reportes', en: 'Reports' },
}
