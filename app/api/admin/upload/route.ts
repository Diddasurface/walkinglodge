import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const MAX_BYTES = 8 * 1024 * 1024 // 8 MB before optimization
const ALLOWED   = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const OPTIMIZABLE = new Set(['image/jpeg', 'image/png', 'image/webp'])
const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 })

  if (!ALLOWED.includes(file.type))
    return NextResponse.json({ error: 'Tipo no permitido. Usa JPG, PNG, WEBP, GIF o SVG' }, { status: 400 })

  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: 'El archivo supera los 8 MB' }, { status: 400 })

  const bytes  = await file.arrayBuffer()
  const sourceBuffer = Buffer.from(bytes)
  const shouldOptimize = OPTIMIZABLE.has(file.type)
  const ext = shouldOptimize ? 'webp' : (EXTENSION_BY_TYPE[file.type] ?? 'jpg')
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')

  await mkdir(uploadDir, { recursive: true })

  try {
    const outputBuffer = shouldOptimize
      ? await sharp(sourceBuffer)
          .rotate()
          .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 78, effort: 4 })
          .toBuffer()
      : sourceBuffer

    await writeFile(path.join(uploadDir, filename), outputBuffer)
  } catch {
    return NextResponse.json({ error: 'La imagen no se pudo procesar' }, { status: 400 })
  }

  return NextResponse.json({ url: `/uploads/${filename}` })
}
