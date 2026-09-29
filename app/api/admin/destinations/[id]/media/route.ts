import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseVideoUrl } from '@/lib/media'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const items = await prisma.destinationImage.findMany({
    where: { destinationId: id },
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { type, url, thumbUrl, captionEs, captionEn } = body

  if (!url) return NextResponse.json({ error: 'URL requerida' }, { status: 400 })

  const last = await prisma.destinationImage.findFirst({
    where: { destinationId: id },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  })
  const nextOrder = (last?.sortOrder ?? -1) + 1

  let provider: string | null = null
  let resolvedThumb: string | null = thumbUrl || null

  if (type === 'video') {
    const parsed = parseVideoUrl(url)
    if (!parsed) return NextResponse.json({ error: 'URL de video no reconocida' }, { status: 400 })
    provider = parsed.provider
    if (!resolvedThumb && parsed.autoThumb) resolvedThumb = parsed.autoThumb
  }

  const item = await prisma.destinationImage.create({
    data: {
      destinationId: id,
      type: type ?? 'image',
      url,
      provider,
      thumbUrl: resolvedThumb,
      captionEs: captionEs || null,
      captionEn: captionEn || null,
      sortOrder: nextOrder,
    },
  })

  return NextResponse.json(item, { status: 201 })
}
