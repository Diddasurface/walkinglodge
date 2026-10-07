import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Administracion',
  robots: { index: false, follow: false, nocache: true },
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession()
  if (!session) redirect('/login')

  return children
}
