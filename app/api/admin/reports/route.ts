import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const [
    bookingsByStatus,
    revenueData,
    clientsTotal,
    topToursRaw,
    reviewsData,
  ] = await Promise.all([
    prisma.booking.groupBy({ by: ['status'], _count: { id: true } }).catch(() => []),
    prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: 0 } })),
    prisma.user.count({ where: { role: 'CLIENT' } }).catch(() => 0),
    prisma.bookingTour.groupBy({
      by: ['tourId'],
      _count: { id: true },
      _sum: { totalPrice: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    }).catch(() => []),
    prisma.review.aggregate({ _avg: { rating: true } }).catch(() => ({ _avg: { rating: null } })),
  ])

  // Enrich topTours with tour names
  const tourIds = topToursRaw.map((r: any) => r.tourId)
  const tours = tourIds.length
    ? await prisma.tour.findMany({ where: { id: { in: tourIds } }, select: { id: true, titleEs: true } })
    : []

  const topTours = topToursRaw.map((r: any) => {
    const t = tours.find((x: any) => x.id === r.tourId)
    return {
      tourId: r.tourId,
      titleEs: t?.titleEs ?? '—',
      count: r._count.id,
      revenue: r._sum.totalPrice ?? 0,
    }
  })

  const statusMap: Record<string, number> = {}
  for (const row of bookingsByStatus as any[]) {
    statusMap[row.status] = row._count.id
  }

  return NextResponse.json({
    revenueTotal: (revenueData as any)._sum?.amount ?? 0,
    bookingsByStatus: statusMap,
    topTours,
    clientsTotal,
    reviewsAvg: (reviewsData as any)._avg?.rating ?? null,
  })
}
