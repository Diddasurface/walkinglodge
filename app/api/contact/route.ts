import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 5
const attempts = new Map<string, number[]>()

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function isRateLimited(ip: string) {
  const now = Date.now()
  const recent = (attempts.get(ip) ?? []).filter(timestamp => now - timestamp < WINDOW_MS)
  recent.push(now)
  attempts.set(ip, recent)
  return recent.length > MAX_REQUESTS
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Demasiados intentos. Intenta nuevamente en unos minutos.' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud no valida' }, { status: 400 })
  }

  const name = text(body.name, 120)
  const email = text(body.email, 190).toLowerCase()
  const phone = text(body.phone, 50)
  const nationality = text(body.nationality, 100)
  const destination = text(body.dest, 160)
  const dates = text(body.dates, 160)
  const message = text(body.msg, 3000)
  const parsedPax = Number.parseInt(text(body.people, 3), 10)
  const pax = Number.isFinite(parsedPax) ? Math.min(Math.max(parsedPax, 1), 99) : 1

  if (!name || !EMAIL_RE.test(email) || !nationality || !message) {
    return NextResponse.json({ error: 'Completa nombre, correo, nacionalidad y mensaje.' }, { status: 400 })
  }

  const year = new Date().getFullYear()
  const reference = `WLQ-${year}-${randomUUID().slice(0, 8).toUpperCase()}`
  const inquiry = await prisma.booking.create({
    data: {
      reference,
      source: 'CONTACT',
      status: 'NEW',
      pax,
      contactName: name,
      contactEmail: email,
      contactPhone: phone || null,
      nationality,
      destinationInterest: destination || null,
      requestedDates: dates || null,
      message,
    },
  })

  return NextResponse.json({ ok: true, reference: inquiry.reference }, { status: 201 })
}
