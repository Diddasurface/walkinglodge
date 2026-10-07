'use client'

import { useEffect } from 'react'
import { SessionProvider as NextAuthSessionProvider, signOut, useSession } from 'next-auth/react'

function SessionRevocationWatcher() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.sessionValid === false) {
      signOut({ callbackUrl: '/login' })
    }
  }, [session, status])

  return null
}

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider refetchInterval={60} refetchOnWindowFocus>
      <SessionRevocationWatcher />
      {children}
    </NextAuthSessionProvider>
  )
}
