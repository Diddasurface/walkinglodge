import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; dayId: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { dayId } = await params
  await prisma.destinationDay.delete({ where: { id: dayId } })
  return NextResponse.json({ ok: true })
}
