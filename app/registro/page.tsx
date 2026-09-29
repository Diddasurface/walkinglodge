'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLang } from '@/components/LangProvider'

const ACCENT = '#E5A547'

const copy = {
  es: {
    title: 'Crear cuenta',
    sub: 'Únete y empieza a publicar tus servicios turísticos.',
    name: 'Nombre completo',
    email: 'Correo electrónico',
    password: 'Contraseña',
    submit: 'Registrarse',
    haveAccount: '¿Ya tienes cuenta?',
    login: 'Iniciar sesión',
    back: 'Volver al inicio',
    errorExists: 'El correo ya está registrado.',
    errorGeneral: 'Ocurrió un error. Inténtalo de nuevo.',
  },
  en: {
    title: 'Create account',
    sub: 'Join and start publishing your travel services.',
    name: 'Full name',
    email: 'Email address',
    password: 'Password',
    submit: 'Sign up',
    haveAccount: 'Already have an account?',
    login: 'Sign in',
    back: 'Back to home',
    errorExists: 'Email already registered.',
    errorGeneral: 'An error occurred. Please try again.',
  },
}

export default function RegistroPage() {
  const { lang } = useLang()
  const t = copy[lang]
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.status === 409) {
      setError(t.errorExists)
      setLoading(false)
      return
    }
    if (!res.ok) {
      setError(t.errorGeneral)
      setLoading(false)
      return
    }

    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: '2rem' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px' }}>
        <Link href="/" style={{ color: '#666', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2rem', textDecoration: 'none' }}>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
          {t.back}
        </Link>

        <h1 style={{ fontFamily: 'var(--font-oswald)', fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>{t.title}</h1>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2rem' }}>{t.sub}</p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(['name', 'email', 'password'] as const).map((k) => (
            <div key={k}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '6px' }}>{t[k]}</label>
              <input
                type={k === 'password' ? 'password' : k === 'email' ? 'email' : 'text'}
                value={form[k]}
                onChange={upd(k)}
                required
                style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '0.7rem 1rem', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          ))}

          {error && <p style={{ color: '#e53e3e', fontSize: '0.85rem' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ background: ACCENT, color: '#000', border: 'none', borderRadius: '8px', padding: '0.8rem', fontWeight: 600, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '0.5rem' }}
          >
            {loading ? '…' : t.submit}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.85rem', marginTop: '1.5rem' }}>
          {t.haveAccount}{' '}
          <Link href="/login" style={{ color: ACCENT, textDecoration: 'none' }}>{t.login}</Link>
        </p>
      </div>
    </div>
  )
}
