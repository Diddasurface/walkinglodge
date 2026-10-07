import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const data: Prisma.TourUncheckedUpdateInput = {}
  const textFields = ['type', 'titleEs', 'titleEn', 'subEs', 'subEn', 'levelEs', 'levelEn', 'coverImg'] as const
  const numberFields = ['durationDays', 'durationNights', 'minPax', 'maxPax'] as const
  const booleanFields = ['published', 'featured'] as const

  for (const field of textFields) {
    if (body[field] !== undefined) data[field] = field === 'type' ? String(body[field]).toUpperCase() : String(body[field])
  }
  for (const field of numberFields) {
    if (body[field] !== undefined) data[field] = Number(body[field])
  }
  for (const field of booleanFields) {
    if (body[field] !== undefined) data[field] = Boolean(body[field])
  }

  if (body.titleEs !== undefined && !String(body.titleEs).trim()) {
    return NextResponse.json({ error: 'El título es obligatorio' }, { status: 400 })
  }
  if (body.durationDays !== undefined && Number(body.durationDays) < 1) {
    return NextResponse.json({ error: 'La duración debe ser de al menos un día' }, { status: 400 })
  }

  const tour = await prisma.$transaction(async (tx) => {
    const updated = await tx.tour.update({ where: { id }, data })

    if (Object.prototype.hasOwnProperty.call(body, 'basePrice')) {
      const currentPrice = await tx.tourPrice.findFirst({
        where: { tourId: id, seasonId: null },
        orderBy: { paxMin: 'asc' },
      })

      if (body.basePrice === '' || body.basePrice === null) {
        if (currentPrice) await tx.tourPrice.delete({ where: { id: currentPrice.id } })
      } else if (currentPrice) {
        await tx.tourPrice.update({ where: { id: currentPrice.id }, data: { price: Number(body.basePrice) } })
      } else {
        await tx.tourPrice.create({
          data: { tourId: id, paxMin: 1, price: Number(body.basePrice), currency: 'USD' },
        })
      }
    }

    return updated
  })
  return NextResponse.json(tour)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  await prisma.tour.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
