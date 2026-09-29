'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Lang } from '@/lib/types'
import s from './LoginPage.module.css'

const ACCENT = '#E5A547'

const copy = {
  es: {
    region: 'MADRE DE DIOS · PERU',
    tagline: 'Tu refugio\nen la selva\ncomienza aqui',
    headline: 'Inicia sesión',
    sub: 'Accede a tu cuenta para gestionar reservas y estadias en el lodge.',
    email: 'Correo electrónico',
    password: 'Contraseña',
    remember: 'Recordarme',
    forgot: '¿Olvidaste tu contraseña?',
    submit: 'Entrar',
    or: 'o continúa con',
    noAccount: '¿No tienes cuenta?',
    register: 'Crear cuenta',
    back: 'Volver al inicio',
    emailPlaceholder: 'hola@ejemplo.com',
    passwordPlaceholder: '••••••••',
    successTitle: '¡Bienvenido!',
    successText: 'Sesión iniciada. Redirigiendo a tu cuenta…',
  },
  en: {
    region: 'MADRE DE DIOS · PERU',
    tagline: 'Your forest\nlodge stay\nstarts here',
    headline: 'Sign in',
    sub: 'Access your account to manage lodge bookings and stays.',
    email: 'Email address',
    password: 'Password',
    remember: 'Remember me',
    forgot: 'Forgot your password?',
    submit: 'Sign in',
    or: 'or continue with',
    noAccount: "Don't have an account?",
    register: 'Create account',
    back: 'Back to home',
    emailPlaceholder: 'hello@example.com',
    passwordPlaceholder: '••••••••',
    successTitle: 'Welcome!',
    successText: 'Signed in. Redirecting to your account…',
  },
}

const CHIPS = ['Madre de Dios', 'Puerto Maldonado', 'Canopy', 'Lago Sandoval']

interface LoginPageProps {
  lang: Lang
}

export default function LoginPage({ lang }: LoginPageProps) {
  const t = copy[lang]
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const upd =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [k]: e.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    setLoading(false)
    if (res?.ok) {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 1200)
    } else {
      setError(lang === 'es' ? 'Correo o contraseña incorrectos.' : 'Incorrect email or password.')
    }
  }

  return (
    <div className={s.root}>

      {/* ── Left panel ── */}
      <div className={s.panel}>
        <div
          className={s.panelBg}
          style={{
            backgroundImage:
              'url(/uploads/1778347444962-3lozdulfu64.jpg)',
          }}
        />
        <div className={s.panelOverlay} />

        {/* Brand */}
        <div className={s.panelBrand}>
          <GlobeLogo color={ACCENT} />
          <div className={s.brandText}>
            <span className={s.brandName}>AMAZON</span>
            <span className={s.brandSub}>EXPERIENCE</span>
          </div>
        </div>

        {/* Bottom */}
        <div className={s.panelBottom}>
          <span className={s.panelEyebrow}>
            <span className={s.panelEyebrowBar} />
            {t.region}
          </span>
          <h2 className={s.panelHeadline}>
            {t.tagline.split('\n').map((line, i) => (
              <span key={i} style={{ display: 'block' }}>{line}</span>
            ))}
          </h2>
          <div className={s.panelChips}>
            {CHIPS.map((name) => (
              <span key={name} className={s.chip}>{name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className={s.formSide}>

        {/* Mobile brand */}
        <div className={s.mobileBrand}>
          <GlobeLogo color={ACCENT} />
          <div className={s.brandText}>
            <span className={s.brandName}>AMAZON</span>
            <span className={s.brandSub}>EXPERIENCE</span>
          </div>
        </div>

        <div className={s.card}>
          {success ? (
            <SuccessState t={t} />
          ) : (
            <>
              <div className={s.formHeader}>
                <h1 className={s.formTitle}>{t.headline}</h1>
                <p className={s.formSubtitle}>{t.sub}</p>
              </div>

              <form className={s.form} onSubmit={submit}>

                {/* Email */}
                <div className={s.field}>
                  <label className={s.label}>{t.email}</label>
                  <input
                    className={s.input}
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={form.email}
                    onChange={upd('email')}
                    required
                  />
                </div>

                {/* Password */}
                <div className={s.field}>
                  <div className={s.labelRow}>
                    <label className={s.label}>{t.password}</label>
                    <button type="button" className={s.forgotBtn}>{t.forgot}</button>
                  </div>
                  <div className={s.inputWrap}>
                    <input
                      className={s.input}
                      type={showPass ? 'text' : 'password'}
                      placeholder={t.passwordPlaceholder}
                      value={form.password}
                      onChange={upd('password')}
                      required
                    />
                    <button
                      type="button"
                      className={s.eyeBtn}
                      onClick={() => setShowPass((v) => !v)}
                      aria-label={showPass ? 'Ocultar' : 'Mostrar'}
                    >
                      {showPass ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <label className={s.checkLabel}>
                  <span className={s.checkBox}>
                    <input
                      type="checkbox"
                      checked={form.remember}
                      onChange={upd('remember')}
                    />
                    <span className={s.checkMark}>
                      {form.remember && (
                        <svg viewBox="0 0 10 8" width="10" height="8" fill="none" stroke={ACCENT} strokeWidth="1.5">
                          <path d="M1 4l3 3 5-6" />
                        </svg>
                      )}
                    </span>
                  </span>
                  <span className={s.checkText}>{t.remember}</span>
                </label>

                {/* Error */}
                {error && <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '-4px' }}>{error}</p>}

                {/* Submit */}
                <button type="submit" className={s.submitBtn} disabled={loading}>
                  {loading ? (
                    <svg className={s.spinner} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  ) : (
                    <>
                      {t.submit}
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className={s.divider}>
                <span className={s.dividerLine} />
                <span className={s.dividerText}>{t.or}</span>
                <span className={s.dividerLine} />
              </div>

              {/* Google */}
              <button type="button" className={s.googleBtn}>
                <GoogleIcon />
                Google
              </button>

              {/* Register */}
              <p className={s.registerRow}>
                {t.noAccount}{' '}
                <Link href="/registro" className={s.registerLink}>{t.register}</Link>
              </p>

              {/* Back */}
              <Link href="/" className={s.backLink}>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
                {t.back}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ── */

function SuccessState({ t }: { t: typeof copy['es'] }) {
  return (
    <div className={s.successCard}>
      <div className={s.successIcon}>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h3 className={s.successTitle}>{t.successTitle}</h3>
      <p className={s.successText}>{t.successText}</p>
    </div>
  )
}

function GlobeLogo({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 32 32" width="30" height="30">
      <circle cx="16" cy="16" r="14" fill="none" stroke={color} strokeWidth="1.4" />
      <path d="M2 16 H30 M16 2 Q22 16 16 30 Q10 16 16 2 M4 9 H28 M4 23 H28" fill="none" stroke={color} strokeWidth="1" />
    </svg>
  )
}

function Eye() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOff() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
