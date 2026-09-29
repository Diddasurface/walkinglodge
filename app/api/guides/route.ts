import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rows = await prisma.guide.findMany({
      where: { published: true },
      orderBy: { createdAt: 'asc' },
    })

    const guides = rows.map((g) => ({
      name:  g.name,
      base:  { es: g.baseEs, en: g.baseEn },
      years: g.years,
      langs: g.langs.split(',').map((l) => l.trim()),
      spec:  { es: g.specEs, en: g.specEn },
      bio:   { es: g.bioEs,  en: g.bioEn },
      img:   g.img,
    }))

    return NextResponse.json(guides)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
