import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rows = await prisma.tour.findMany({
      where: { published: true },
      orderBy: { createdAt: 'asc' },
      include: {
        prices: { orderBy: { price: 'asc' } },
      },
    })

    const tours = rows.map((t, i) => {
      const basePrice = t.prices.find((price) => price.seasonId === null)
      const fallbackPrice = t.prices.find((price) => price.seasonId !== null)

      return {
        id: i + 1,
        type: t.type as 'ADV' | 'NAT' | 'CUL' | 'LUX' | 'FAM',
        title: { es: t.titleEs, en: t.titleEn },
        sub:   { es: t.subEs ?? '', en: t.subEn ?? '' },
        days:  {
          es: `${t.durationDays} ${t.durationDays === 1 ? 'día' : 'días'} / ${t.durationNights} ${t.durationNights === 1 ? 'noche' : 'noches'}`,
          en: `${t.durationDays} ${t.durationDays === 1 ? 'day' : 'days'} / ${t.durationNights} ${t.durationNights === 1 ? 'night' : 'nights'}`,
        },
        price: String(basePrice?.price ?? fallbackPrice?.price ?? 0),
        level: { es: t.levelEs, en: t.levelEn },
        img:   t.coverImg,
        featured: t.featured,
      }
    })

    return NextResponse.json(tours, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
