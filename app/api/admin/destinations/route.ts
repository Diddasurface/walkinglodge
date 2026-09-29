import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const destinations = await prisma.destination.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(destinations)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const { nameEs, nameEn, regionEs, regionEn, shortEs, shortEn, subEs, subEn, descEs, descEn, coverImg, tag, altitudeM, latitude, longitude } = body

  if (!nameEs || !regionEs || !coverImg || !tag) {
    return NextResponse.json({ error: 'Campos requeridos: nombre, región, imagen, tag' }, { status: 400 })
  }

  const slug = nameEs
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    + '-' + Date.now()

  const dest = await prisma.destination.create({
    data: {
      slug,
      nameEs, nameEn: nameEn || nameEs,
      regionEs, regionEn: regionEn || regionEs,
      shortEs: shortEs || '', shortEn: shortEn || shortEs || '',
      subEs: subEs || '', subEn: subEn || subEs || '',
      descEs: descEs || '', descEn: descEn || descEs || '',
      coverImg, tag,
      altitudeM: altitudeM ? Number(altitudeM) : null,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      published: false,
      createdById: session.user.id,
    },
  })
  return NextResponse.json(dest, { status: 201 })
}
