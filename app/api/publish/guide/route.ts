import { NextRequest, NextResponse } from 'next/server'
import { getCurrentSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getCurrentSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const { name, baseEs, baseEn, years, langs, specEs, specEn, bioEs, bioEn, img } = body

  if (!name || !years) {
    return NextResponse.json({ error: 'Campos requeridos' }, { status: 400 })
  }

  const guide = await prisma.guide.create({
    data: {
      name,
      baseEs: baseEs || '', baseEn: baseEn || baseEs || '',
      years: Number(years),
      langs: Array.isArray(langs) ? langs.join(',') : (langs || 'ES'),
      specEs: specEs || '', specEn: specEn || specEs || '',
      bioEs: bioEs || '', bioEn: bioEn || bioEs || '',
      img: img || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
      createdById: session.user.id,
    },
  })

  return NextResponse.json(guide, { status: 201 })
}
