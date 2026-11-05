import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_LOGO_URL } from '@/lib/site'

export async function GET() {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: ['logoUrl'] } },
  })

  const settings = Object.fromEntries(rows.map((row) => [row.key, row.value]))
  return NextResponse.json({
    logoUrl: settings.logoUrl || DEFAULT_LOGO_URL,
  })
}
