import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  if ('sortOrder' in body) {
    body.sortOrder = body.sortOrder === '' || body.sortOrder === null ? 0 : Number(body.sortOrder)
  }

  const image = await prisma.galleryImage.update({ where: { id }, data: body })
  return NextResponse.json(image)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  await prisma.galleryImage.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
