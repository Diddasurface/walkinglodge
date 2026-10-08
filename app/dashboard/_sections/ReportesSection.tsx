'use client'

import { Spinner } from '../_ui/Spinner'
import { Badge } from '../_ui/Badge'
import type { ReportData } from '../_lib/types'

const STATUS_LABELS: Record<string, { es: string; en: string; cls: string }> = {
  NEW:         { es: 'Nuevo',       en: 'New',         cls: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400' },
  CONTACTED:   { es: 'Contactado',  en: 'Contacted',   cls: 'bg-sky-500/15 text-sky-700 dark:text-sky-400' },
  QUOTED:      { es: 'Cotizado',    en: 'Quoted',      cls: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400' },
  PENDING:     { es: 'Pendiente',   en: 'Pending',     cls: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400' },
  CONFIRMED:   { es: 'Confirmado',  en: 'Confirmed',   cls: 'bg-blue-500/15   text-blue-700   dark:text-blue-400' },
  PAID:        { es: 'Pagado',      en: 'Paid',        cls: 'bg-green-500/15  text-green-700  dark:text-green-400' },
  IN_PROGRESS: { es: 'En curso',    en: 'In progress', cls: 'bg-purple-500/15 text-purple-700 dark:text-purple-400' },
  COMPLETED:   { es: 'Completado',  en: 'Completed',   cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' },
  CANCELLED:   { es: 'Cancelado',   en: 'Cancelled',   cls: 'bg-red-500/15    text-red-700    dark:text-red-400' },
  REFUNDED:    { es: 'Reembolsado', en: 'Refunded',    cls: 'bg-orange-500/15 text-orange-700 dark:text-orange-400' },
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <div className="bg-white dark:bg-[#131516] rounded-xl p-5 border border-slate-200 dark:border-white/6">
      <p className="text-xs text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-oswald)' }}>
        <span className={accent}>{value}</span>
      </p>
      {sub && <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">{sub}</p>}
    </div>
  )
}

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#131516] rounded-xl border border-slate-200 dark:border-white/6 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-white/6">
        <h3 className="text-gray-900 dark:text-white text-sm font-medium">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

export function ReportesSection({ lang, report, loading }: {
  lang: string; report: ReportData | null; loading: boolean
}) {
  if (loading) return <Spinner />
  if (!report) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-gray-400 dark:text-zinc-500 text-sm">{lang === 'es' ? 'No hay datos disponibles aún' : 'No data available yet'}</p>
    </div>
  )

  const totalBookings = Object.values(report.bookingsByStatus).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label={lang === 'es' ? 'Ingresos totales' : 'Total revenue'}
          value={`$${report.revenueTotal.toLocaleString()}`}
          sub="USD · pagos completados"
          accent="text-[#E5A547]"
        />
        <KpiCard
          label={lang === 'es' ? 'Reservas totales' : 'Total bookings'}
          value={String(totalBookings)}
          sub={lang === 'es' ? 'todas las reservas' : 'all bookings'}
          accent="text-blue-600 dark:text-blue-400"
        />
        <KpiCard
          label={lang === 'es' ? 'Clientes' : 'Clients'}
          value={String(report.clientsTotal)}
          sub={lang === 'es' ? 'cuentas registradas' : 'registered accounts'}
          accent="text-purple-600 dark:text-purple-400"
        />
        <KpiCard
          label={lang === 'es' ? 'Rating promedio' : 'Average rating'}
          value={report.reviewsAvg !== null ? `${report.reviewsAvg.toFixed(1)} ★` : '—'}
          sub={lang === 'es' ? 'de todas las reseñas' : 'from all reviews'}
          accent="text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Bookings by status */}
        <SectionBox title={lang === 'es' ? 'Reservas por estado' : 'Bookings by status'}>
          {totalBookings === 0 ? (
            <p className="text-sm text-gray-400 dark:text-zinc-500">{lang === 'es' ? 'Sin reservas aún' : 'No bookings yet'}</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(STATUS_LABELS).map(([status, cfg]) => {
                const count = report.bookingsByStatus[status] ?? 0
                if (count === 0) return null
                const pct = Math.round((count / totalBookings) * 100)
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <Badge cls={cfg.cls}>{lang === 'es' ? cfg.es : cfg.en}</Badge>
                      <span className="text-xs text-gray-500 dark:text-zinc-400">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#E5A547] rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </SectionBox>

        {/* Top tours */}
        <SectionBox title={lang === 'es' ? 'Tours más reservados' : 'Most booked tours'}>
          {report.topTours.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-zinc-500">{lang === 'es' ? 'Sin datos aún' : 'No data yet'}</p>
          ) : (
            <div className="space-y-3">
              {report.topTours.map((t, i) => (
                <div key={t.tourId} className="flex items-center gap-3">
                  <span className="w-5 text-center text-xs font-bold text-gray-400 dark:text-zinc-600 shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white truncate">{t.titleEs}</p>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-500">
                      {t.count} {lang === 'es' ? 'reservas' : 'bookings'} · ${t.revenue.toLocaleString()} USD
                    </p>
                  </div>
                  <Badge cls="bg-[#E5A547]/15 text-amber-700 dark:text-amber-400 shrink-0">{t.count}</Badge>
                </div>
              ))}
            </div>
          )}
        </SectionBox>
      </div>
    </div>
  )
}
