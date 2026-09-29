import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const { type, titleEs, titleEn, subEs, subEn, daysEs, durationDays, durationNights, levelEs, levelEn, img } = body

  if (!type || !titleEs) {
    return NextResponse.json({ error: 'Campos requeridos' }, { status: 400 })
  }

  const slug = String(titleEs)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const tour = await prisma.tour.create({
    data: {
      slug: `${slug}-${Date.now()}`,
      type, titleEs, titleEn: titleEn || titleEs,
      subEs: subEs || '', subEn: subEn || subEs || '',
      durationDays: Number(durationDays || daysEs || 1),
      durationNights: Number(durationNights || 0),
      levelEs: levelEs || '', levelEn: levelEn || levelEs || '',
      coverImg: img || 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80',
      createdById: session.user.id,
    },
  })

  return NextResponse.json(tour, { status: 201 })
}
