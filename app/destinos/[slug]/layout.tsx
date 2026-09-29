import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { prisma } from '@/lib/prisma'
import { createPageMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const destination = await prisma.destination.findUnique({
    where: { slug },
    select: { nameEs: true, descEs: true, coverImg: true, published: true },
  })

  if (!destination?.published) {
    return { title: 'Actividad no encontrada', robots: { index: false, follow: false } }
  }

  return createPageMetadata({
    title: destination.nameEs.replaceAll('\n', ' '),
    description: destination.descEs,
    path: `/destinos/${slug}`,
    image: destination.coverImg,
  })
}

export default function DestinationLayout({ children }: { children: ReactNode }) {
  return children
}
