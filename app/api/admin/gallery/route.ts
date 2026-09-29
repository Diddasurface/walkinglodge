import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json(images)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const { url, titleEs, titleEn, captionEs, captionEn, category, sortOrder, published } = body

  if (!url || !titleEs) {
    return NextResponse.json({ error: 'Imagen y titulo son obligatorios' }, { status: 400 })
  }

  const image = await prisma.galleryImage.create({
    data: {
      url,
      titleEs,
      titleEn: titleEn || titleEs,
      captionEs: captionEs || null,
      captionEn: captionEn || captionEs || null,
      category: category || 'naturaleza',
      sortOrder: sortOrder ? Number(sortOrder) : 0,
      published: published ?? true,
    },
  })

  return NextResponse.json(image, { status: 201 })
}
