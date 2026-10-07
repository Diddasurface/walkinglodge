import { getServerSession, type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60,
  },
  jwt: {
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.isActive) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        const activeUser = await prisma.user.update({
          where: { id: user.id },
          data: { sessionVersion: { increment: 1 } },
          select: { id: true, name: true, email: true, role: true, sessionVersion: true },
        })

        return activeUser
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        const loginUser = user as unknown as { role: string; sessionVersion: number }
        token.role = loginUser.role
        token.sessionVersion = loginUser.sessionVersion
        token.sessionValid = true
        return token
      }

      if (!token.id || token.sessionVersion === undefined) {
        token.sessionValid = false
        return token
      }

      try {
        const currentUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true, isActive: true, sessionVersion: true },
        })

        token.sessionValid = Boolean(
          currentUser?.isActive && currentUser.sessionVersion === token.sessionVersion
        )
        if (currentUser) token.role = currentUser.role
      } catch {
        token.sessionValid = false
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.sessionValid = token.sessionValid === true
      }
      return session
    },
  },
  events: {
    async signOut({ token }) {
      if (!token?.id || token.sessionVersion === undefined) return
      try {
        await prisma.user.updateMany({
          where: { id: token.id, sessionVersion: token.sessionVersion },
          data: { sessionVersion: { increment: 1 } },
        })
      } catch {
        // The browser cookie can still be cleared if the database is temporarily unavailable.
      }
    },
  },
}

export async function getCurrentSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !session.user.sessionValid) return null
  return session
}

export async function getAdminSession() {
  const session = await getCurrentSession()
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}
