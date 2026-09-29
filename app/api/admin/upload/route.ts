import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED   = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 })

  if (!ALLOWED.includes(file.type))
    return NextResponse.json({ error: 'Tipo no permitido. Usa JPG, PNG, WEBP, GIF o SVG' }, { status: 400 })

  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: 'El archivo supera los 5 MB' }, { status: 400 })

  const bytes  = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext      = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')

  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, filename), buffer)

  return NextResponse.json({ url: `/uploads/${filename}` })
}
