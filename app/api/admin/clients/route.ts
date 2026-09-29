import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const rows = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    include: { _count: { select: { bookings: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(rows.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    isActive: u.isActive,
    bookingCount: u._count.bookings,
    createdAt: u.createdAt,
  })))
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const { name, email, phone, password } = body

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Campos requeridos: nombre, email, contraseña' }, { status: 400 })
  }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 })

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashed, phone: phone || null, role: 'CLIENT' },
  })

  return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 })
}
