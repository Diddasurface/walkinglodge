import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { mediaId } = await params
  const body = await req.json()

  const item = await prisma.destinationImage.update({
    where: { id: mediaId },
    data: {
      ...(body.captionEs !== undefined && { captionEs: body.captionEs || null }),
      ...(body.captionEn !== undefined && { captionEn: body.captionEn || null }),
      ...(body.thumbUrl  !== undefined && { thumbUrl:  body.thumbUrl  || null }),
      ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
    },
  })
  return NextResponse.json(item)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { mediaId } = await params
  await prisma.destinationImage.delete({ where: { id: mediaId } })
  return NextResponse.json({ ok: true })
}
