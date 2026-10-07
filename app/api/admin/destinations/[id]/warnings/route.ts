import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const warnings = await prisma.destinationWarning.findMany({
    where: { destinationId: id },
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json(warnings)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { textEs, textEn, severity } = body

  if (!textEs) return NextResponse.json({ error: 'El texto es requerido' }, { status: 400 })

  const agg = await prisma.destinationWarning.aggregate({
    where: { destinationId: id },
    _max: { sortOrder: true },
  })

  const warning = await prisma.destinationWarning.create({
    data: {
      destinationId: id,
      textEs,
      textEn: textEn || textEs,
      severity: severity || 'warning',
      sortOrder: (agg._max.sortOrder ?? -1) + 1,
    },
  })
  return NextResponse.json(warning, { status: 201 })
}
