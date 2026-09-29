import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rows = await prisma.destination.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    })

    const destinations = rows.map((d) => ({
      id: d.slug,
      region: { es: d.regionEs, en: d.regionEn },
      name:   { es: d.nameEs,   en: d.nameEn },
      short:  { es: d.shortEs,  en: d.shortEn },
      sub:    { es: d.subEs,    en: d.subEn },
      desc:        { es: d.descEs,   en: d.descEn },
      img:         d.coverImg,
      imgLight:    d.slug === 'lodge-madre-de-dios' ? '/images/lodge-day.webp' : undefined,
      imgDark:     d.slug === 'lodge-madre-de-dios' ? '/images/lodge-night.webp' : undefined,
      tag:         d.tag,
      altitudeM:   d.altitudeM ?? null,
    }))

    return NextResponse.json(destinations)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
