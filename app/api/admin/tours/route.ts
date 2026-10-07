import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const tours = await prisma.tour.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      prices: {
        where: { seasonId: null },
        orderBy: { paxMin: 'asc' },
        take: 1,
      },
    },
  })
  return NextResponse.json(tours.map(({ prices, ...tour }) => ({
    ...tour,
    basePrice: prices[0]?.price ?? null,
  })))
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const {
    type, titleEs, titleEn, subEs, subEn,
    durationDays, durationNights, levelEs, levelEn,
    coverImg, minPax, maxPax, basePrice,
  } = body

  if (!type || !titleEs || !durationDays) {
    return NextResponse.json({ error: 'Campos requeridos: tipo, título, duración' }, { status: 400 })
  }

  const slug = titleEs
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    + '-' + Date.now()

  const tour = await prisma.tour.create({
    data: {
      slug,
      type: type.toUpperCase(),
      titleEs,
      titleEn: titleEn || titleEs,
      subEs: subEs || '',
      subEn: subEn || subEs || '',
      durationDays: Number(durationDays),
      durationNights: Number(durationNights) || 0,
      levelEs: levelEs || 'Moderado',
      levelEn: levelEn || 'Moderate',
      coverImg: coverImg || 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80',
      minPax: Number(minPax) || 1,
      maxPax: Number(maxPax) || 20,
      published: false,
      createdById: session.user.id,
    },
  })

  if (basePrice) {
    await prisma.tourPrice.create({
      data: { tourId: tour.id, paxMin: 1, price: Number(basePrice), currency: 'USD' },
    })
  }

  return NextResponse.json(tour, { status: 201 })
}
