import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rows = await prisma.tour.findMany({
      where: { published: true },
      orderBy: { createdAt: 'asc' },
      include: {
        prices: { orderBy: { price: 'asc' }, take: 1 },
      },
    })

    const tours = rows.map((t, i) => ({
      id: i + 1,
      type: t.type as 'ADV' | 'NAT' | 'CUL' | 'LUX' | 'FAM',
      title: { es: t.titleEs, en: t.titleEn },
      sub:   { es: t.subEs ?? '', en: t.subEn ?? '' },
      days:  {
        es: `${t.durationDays} ${t.durationDays === 1 ? 'día' : 'días'} / ${t.durationNights} ${t.durationNights === 1 ? 'noche' : 'noches'}`,
        en: `${t.durationDays} ${t.durationDays === 1 ? 'day' : 'days'} / ${t.durationNights} ${t.durationNights === 1 ? 'night' : 'nights'}`,
      },
      price: String(t.prices[0]?.price ?? 0),
      level: { es: t.levelEs, en: t.levelEn },
      img:   t.coverImg,
    }))

    return NextResponse.json(tours)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
