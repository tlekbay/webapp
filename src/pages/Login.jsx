import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [mode, setMode]       = useState('login') // 'login' | 'signup'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)

    if (mode === 'login') {
      const err = await signIn(email, password)
      if (err) setError(err.message)
      else navigate('/')
    } else {
      const err = await signUp(email, password)
      if (err) setError(err.message)
      else setSuccess('Account created! You can now sign in.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[100dvh] sm:min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 w-full max-w-sm">

        {/* Logo mark */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Georgia, serif' }}>PC</span>
          </div>
        </div>

        <h1 className="text-xl font-bold text-stone-800 text-center mb-1">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </h1>
        <p className="text-stone-400 text-sm text-center mb-6">
          Phraseological Concordance
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Email</span>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="you@example.com"
              className="input-base"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Password</span>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="••••••••" minLength={6}
              className="input-base"
            />
          </label>

          {error   && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-emerald-600 text-sm">{success}</p>}

          <button type="submit" disabled={loading}
            className="btn-primary">
            {loading ? '...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-400 mt-4">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}
            className="text-emerald-600 font-medium hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}