import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const [tours, guides, destinations, hotels, bookings] = await Promise.all([
    prisma.tour.count().catch(() => 0),
    prisma.guide.count().catch(() => 0),
    prisma.destination.count().catch(() => 0),
    prisma.hotel.count().catch(() => 0),
    prisma.booking.count().catch(() => 0),
  ])

  return NextResponse.json({ tours, guides, destinations, hotels, bookings })
}
