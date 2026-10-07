import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const INT_FIELDS = ['altitudeM', 'durationDays', 'sortOrder'] as const

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const dest = await prisma.destination.findUnique({ where: { id } })
  if (!dest) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(dest)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  for (const field of INT_FIELDS) {
    if (field in body) {
      if (body[field] === '' || body[field] === null) {
        body[field] = null
      } else {
        body[field] = parseInt(body[field], 10)
      }
    }
  }

  const dest = await prisma.destination.update({ where: { id }, data: body })
  return NextResponse.json(dest)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  try {
    await prisma.$transaction(async (tx) => {
      const hotels = await tx.hotel.findMany({
        where: { destinationId: id },
        select: { id: true },
      })
      const hotelIds = hotels.map((h) => h.id)

      if (hotelIds.length > 0) {
        await tx.review.updateMany({
          where: { hotelId: { in: hotelIds } },
          data: { hotelId: null },
        })
        await tx.bookingHotel.deleteMany({
          where: { hotelId: { in: hotelIds } },
        })
        await tx.roomPrice.deleteMany({
          where: { room: { hotelId: { in: hotelIds } } },
        })
        await tx.roomAmenity.deleteMany({
          where: { room: { hotelId: { in: hotelIds } } },
        })
        await tx.room.deleteMany({
          where: { hotelId: { in: hotelIds } },
        })
        await tx.hotelAmenity.deleteMany({
          where: { hotelId: { in: hotelIds } },
        })
        await tx.hotelImage.deleteMany({
          where: { hotelId: { in: hotelIds } },
        })
        await tx.hotel.deleteMany({
          where: { id: { in: hotelIds } },
        })
      }

      await tx.review.updateMany({
        where: { destinationId: id },
        data: { destinationId: null },
      })
      await tx.tourDestination.deleteMany({ where: { destinationId: id } })
      await tx.destinationWarning.deleteMany({ where: { destinationId: id } })
      await tx.destinationDay.deleteMany({ where: { destinationId: id } })
      await tx.destinationImage.deleteMany({ where: { destinationId: id } })
      await tx.destination.delete({ where: { id } })
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error deleting destination', error)
    return NextResponse.json({ error: 'No se pudo eliminar el destino' }, { status: 500 })
  }
}
