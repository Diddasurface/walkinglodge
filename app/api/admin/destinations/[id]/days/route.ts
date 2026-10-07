import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const days = await prisma.destinationDay.findMany({
    where: { destinationId: id },
    orderBy: { dayNumber: 'asc' },
  })
  return NextResponse.json(days)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { titleEs, titleEn, descEs, descEn, mealsEs, mealsEn } = body

  if (!titleEs) return NextResponse.json({ error: 'El título es requerido' }, { status: 400 })

  const agg = await prisma.destinationDay.aggregate({
    where: { destinationId: id },
    _max: { dayNumber: true },
  })
  const dayNumber = (agg._max.dayNumber ?? 0) + 1

  const day = await prisma.destinationDay.create({
    data: { destinationId: id, dayNumber, titleEs, titleEn: titleEn || titleEs, descEs, descEn, mealsEs, mealsEn },
  })
  return NextResponse.json(day, { status: 201 })
}
