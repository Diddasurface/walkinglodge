import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['', '/destinos', '/experiencias', '/galeria', '/guias', '/contacto']
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
  }))

  try {
    const destinations = await prisma.destination.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { sortOrder: 'asc' },
    })

    return [
      ...staticEntries,
      ...destinations.map((destination) => ({
        url: `${SITE_URL}/destinos/${destination.slug}`,
        lastModified: destination.updatedAt,
      })),
    ]
  } catch {
    return staticEntries
  }
}
