import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const d = await prisma.destination.findUnique({
    where: { slug },
    include: {
      images:   { orderBy: { sortOrder: 'asc' } },
      warnings: { orderBy: { sortOrder: 'asc' } },
      days:     { orderBy: { dayNumber: 'asc' } },
      reviews:  {
        where: { published: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  })

  if (!d || !d.published) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    id:             d.id,
    slug:           d.slug,
    name:           { es: d.nameEs,       en: d.nameEn },
    region:         { es: d.regionEs,     en: d.regionEn },
    short:          { es: d.shortEs,      en: d.shortEn },
    sub:            { es: d.subEs,        en: d.subEn },
    desc:           { es: d.descEs,       en: d.descEn },
    experience:     { es: d.experienceEs ?? '', en: d.experienceEn ?? '' },
    img:            d.coverImg,
    imgLight:       d.slug === 'lodge-madre-de-dios' ? '/images/lodge-day.webp' : undefined,
    imgDark:        d.slug === 'lodge-madre-de-dios' ? '/images/lodge-night.webp' : undefined,
    tag:            d.tag,
    altitudeM:      d.altitudeM,
    durationDays:   d.durationDays,
    mapAddress:     d.mapAddress,
    contactEmail:   d.contactEmail,
    contactWhatsapp: d.contactWhatsapp,
    images: d.images.map(i => ({
      id:       i.id,
      type:     i.type,
      url:      i.url,
      provider: i.provider ?? null,
      thumbUrl: i.thumbUrl ?? null,
      caption:  { es: i.captionEs ?? i.altEs ?? '', en: i.captionEn ?? i.altEn ?? '' },
    })),
    warnings: d.warnings.map(w => ({ id: w.id, text: { es: w.textEs, en: w.textEn }, severity: w.severity })),
    days: d.days.map(day => ({
      id:        day.id,
      dayNumber: day.dayNumber,
      title:     { es: day.titleEs, en: day.titleEn },
      desc:      { es: day.descEs ?? '', en: day.descEn ?? '' },
      meals:     { es: day.mealsEs ?? '', en: day.mealsEn ?? '' },
    })),
    reviews: d.reviews.map(r => ({
      id:        r.id,
      rating:    r.rating,
      comment:   r.comment,
      userName:  r.user.name,
      createdAt: r.createdAt,
    })),
  })
}
