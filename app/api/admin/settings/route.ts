import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: ['logoUrl'] } },
  })

  const settings = Object.fromEntries(rows.map((row) => [row.key, row.value]))
  return NextResponse.json({
    logoUrl: settings.logoUrl ?? '',
  })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const logoUrl = String(body.logoUrl ?? '').trim()

  if (logoUrl && !logoUrl.startsWith('/uploads/') && !/^https?:\/\//i.test(logoUrl)) {
    return NextResponse.json({ error: 'Logo invalido' }, { status: 400 })
  }

  await prisma.siteSetting.upsert({
    where: { key: 'logoUrl' },
    update: { value: logoUrl },
    create: { key: 'logoUrl', value: logoUrl },
  })

  return NextResponse.json({ logoUrl })
}
