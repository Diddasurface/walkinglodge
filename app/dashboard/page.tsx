'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { useLang } from '@/components/LangProvider'

import { ThemeProvider, useTheme } from './_lib/theme'
import { Sidebar } from './_layout/Sidebar'
import { Topbar } from './_layout/Topbar'
import { OverviewSection }  from './_sections/OverviewSection'
import { ToursSection }     from './_sections/ToursSection'
import { GuiasSection }     from './_sections/GuiasSection'
import { DestinosSection }  from './_sections/DestinosSection'
import { GaleriaSection }   from './_sections/GaleriaSection'
import { MarcaSection }     from './_sections/MarcaSection'
import { HotelesSection }   from './_sections/HotelesSection'
import { ReservasSection }  from './_sections/ReservasSection'
import { ClientesSection }  from './_sections/ClientesSection'
import { ReportesSection }  from './_sections/ReportesSection'
import type {
  Section, Stats,
  AdminTour, AdminGuide, AdminDestination,
  AdminGalleryImage, AdminSettings, AdminHotel, AdminBooking, AdminClient, ReportData,
} from './_lib/types'

// ─── Inner component (has access to ThemeProvider context) ────────────────────

function DashboardInner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { lang } = useLang()
  const { theme } = useTheme()

  const [section, setSection]           = useState<Section>('overview')
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [stats, setStats]               = useState<Stats | null>(null)
  const [tours, setTours]               = useState<AdminTour[]>([])
  const [guides, setGuides]             = useState<AdminGuide[]>([])
  const [destinations, setDestinations] = useState<AdminDestination[]>([])
  const [galleryImages, setGalleryImages] = useState<AdminGalleryImage[]>([])
  const [settings, setSettings]         = useState<AdminSettings>({ logoUrl: '' })
  const [hotels, setHotels]             = useState<AdminHotel[]>([])
  const [bookings, setBookings]         = useState<AdminBooking[]>([])
  const [clients, setClients]           = useState<AdminClient[]>([])
  const [report, setReport]             = useState<ReportData | null>(null)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [s, t, g, d, ga, st, h, b, c, r] = await Promise.all([
      fetch('/api/admin/stats').then(x => x.ok ? x.json() : null).catch(() => null),
      fetch('/api/admin/tours').then(x => x.ok ? x.json() : []).catch(() => []),
      fetch('/api/admin/guides').then(x => x.ok ? x.json() : []).catch(() => []),
      fetch('/api/admin/destinations').then(x => x.ok ? x.json() : []).catch(() => []),
      fetch('/api/admin/gallery').then(x => x.ok ? x.json() : []).catch(() => []),
      fetch('/api/admin/settings').then(x => x.ok ? x.json() : { logoUrl: '' }).catch(() => ({ logoUrl: '' })),
      fetch('/api/admin/hotels').then(x => x.ok ? x.json() : []).catch(() => []),
      fetch('/api/admin/bookings').then(x => x.ok ? x.json() : []).catch(() => []),
      fetch('/api/admin/clients').then(x => x.ok ? x.json() : []).catch(() => []),
      fetch('/api/admin/reports').then(x => x.ok ? x.json() : null).catch(() => null),
    ])
    setStats(s); setTours(t); setGuides(g); setDestinations(d)
    setGalleryImages(ga); setSettings(st); setHotels(h); setBookings(b); setClients(c); setReport(r)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (status === 'authenticated') fetchAll()
  }, [status, fetchAll])

  if (status === 'loading') {
    return (
      <div className={`${theme === 'dark' ? 'dark' : ''} flex items-center justify-center min-h-screen bg-slate-100 dark:bg-[#0b0c0d]`}>
        <div className="w-7 h-7 border-2 border-[#E5A547]/30 border-t-[#E5A547] rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return null

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} flex h-screen overflow-hidden bg-slate-100 dark:bg-[#0b0c0d]`}>
      <Sidebar section={section} setSection={setSection} session={session} lang={lang} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 ml-0 md:ml-55">
        <Topbar section={section} lang={lang} onMenuClick={() => setSidebarOpen(p => !p)} />

        <main className="flex-1 overflow-y-auto p-6">
          {section === 'overview'  && <OverviewSection lang={lang} stats={stats} tours={tours} guides={guides} loading={loading} setSection={setSection} />}
          {section === 'tours'     && <ToursSection lang={lang} tours={tours} loading={loading} onRefresh={fetchAll} />}
          {section === 'guias'     && <GuiasSection lang={lang} guides={guides} loading={loading} onRefresh={fetchAll} />}
          {section === 'destinos'  && <DestinosSection lang={lang} destinations={destinations} loading={loading} onRefresh={fetchAll} />}
          {section === 'galeria'   && <GaleriaSection lang={lang} images={galleryImages} loading={loading} onRefresh={fetchAll} />}
          {section === 'marca'     && <MarcaSection lang={lang} settings={settings} loading={loading} onRefresh={fetchAll} />}
          {section === 'hoteles'   && <HotelesSection lang={lang} hotels={hotels} destinations={destinations} loading={loading} onRefresh={fetchAll} />}
          {section === 'reservas'  && <ReservasSection lang={lang} bookings={bookings} clients={clients} loading={loading} onRefresh={fetchAll} />}
          {section === 'clientes'  && <ClientesSection lang={lang} clients={clients} loading={loading} onRefresh={fetchAll} />}
          {section === 'reportes'  && <ReportesSection lang={lang} report={report} loading={loading} />}
        </main>
      </div>
    </div>
  )
}

// ─── Page export — wraps with ThemeProvider ───────────────────────────────────

export default function DashboardPage() {
  return (
    <ThemeProvider>
      <DashboardInner />
    </ThemeProvider>
  )
}
