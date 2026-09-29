import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const rows = await prisma.hotel.findMany({
    include: {
      destination: { select: { nameEs: true } },
      _count: { select: { rooms: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(rows.map(h => ({
    id: h.id, slug: h.slug,
    nameEs: h.nameEs, nameEn: h.nameEn,
    stars: h.stars, coverImg: h.coverImg,
    destinationId: h.destinationId,
    destinationName: h.destination.nameEs,
    address: h.address, phone: h.phone, email: h.email,
    published: h.published,
    roomCount: h._count.rooms,
    createdAt: h.createdAt,
  })))
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const { nameEs, nameEn, stars, destinationId, coverImg, address, phone, email, website, checkInTime, checkOutTime } = body

  if (!nameEs || !stars || !destinationId) {
    return NextResponse.json({ error: 'Campos requeridos: nombre, estrellas, destino' }, { status: 400 })
  }

  const slug = nameEs
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    + '-' + Date.now()

  const hotel = await prisma.hotel.create({
    data: {
      slug,
      nameEs, nameEn: nameEn || nameEs,
      stars: Number(stars),
      destinationId,
      coverImg: coverImg || null,
      address: address || null,
      phone: phone || null,
      email: email || null,
      website: website || null,
      checkInTime: checkInTime || null,
      checkOutTime: checkOutTime || null,
      published: false,
      createdById: session.user.id,
    },
  })
  return NextResponse.json(hotel, { status: 201 })
}
