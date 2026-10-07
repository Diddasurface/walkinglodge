import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; warnId: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { warnId } = await params
  await prisma.destinationWarning.delete({ where: { id: warnId } })
  return NextResponse.json({ ok: true })
}
