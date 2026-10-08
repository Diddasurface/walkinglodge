import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const rows = await prisma.booking.findMany({
    include: { user: { select: { name: true, email: true, phone: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(rows.map(b => ({
    id: b.id,
    reference: b.reference,
    clientName: b.user?.name ?? b.contactName ?? 'Sin nombre',
    clientEmail: b.user?.email ?? b.contactEmail ?? '',
    source: b.source,
    status: b.status,
    totalAmount: b.totalAmount,
    currency: b.currency,
    pax: b.pax,
    startDate: b.startDate,
    endDate: b.endDate,
    specialRequests: b.specialRequests,
    contactPhone: b.contactPhone ?? b.user?.phone ?? null,
    nationality: b.nationality,
    destinationInterest: b.destinationInterest,
    requestedDates: b.requestedDates,
    message: b.message,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  })))
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const { userId, totalAmount, pax, startDate, endDate, specialRequests } = body

  if (!userId || !totalAmount || !pax || !startDate || !endDate) {
    return NextResponse.json({ error: 'Campos requeridos: cliente, monto, pax, fechas' }, { status: 400 })
  }

  const year = new Date().getFullYear()
  const reference = `WL-${year}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`

  const booking = await prisma.booking.create({
    data: {
      reference,
      userId,
      source: 'DASHBOARD',
      status: 'PENDING',
      totalAmount: Number(totalAmount),
      currency: 'USD',
      pax: Number(pax),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      specialRequests: specialRequests || null,
    },
  })
  return NextResponse.json(booking, { status: 201 })
}
