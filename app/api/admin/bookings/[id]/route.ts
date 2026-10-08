import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const VALID_STATUSES = new Set([
  'NEW', 'CONTACTED', 'QUOTED', 'PENDING', 'CONFIRMED', 'PAID',
  'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REFUNDED',
])

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  if (typeof body.status !== 'string' || !VALID_STATUSES.has(body.status)) {
    return NextResponse.json({ error: 'Estado no valido' }, { status: 400 })
  }

  const booking = await prisma.booking.update({ where: { id }, data: { status: body.status } })
  return NextResponse.json(booking)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  await prisma.booking.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
