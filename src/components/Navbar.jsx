import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

const LANGS = [
  { code: 'kk', flag: '🇰🇿', label: 'KK' },
  { code: 'ru', flag: '🇷🇺', label: 'RU' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const { isUser, isAdmin, user, signOut } = useAuth()

  // Build nav links based on role
  const links = [
    { to: '/',          icon: '🔍', label: t('nav.search'),    show: true        },
    { to: '/favorites', icon: '⭐', label: t('nav.favorites'), show: isUser      },
    { to: '/add',       icon: '➕', label: t('nav.addWord'),   show: isAdmin     },
    { to: '/import',    icon: '📥', label: t('nav.import'),    show: isAdmin     },
  ].filter(l => l.show)

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <svg width="38" height="38" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
            <rect width="52" height="52" rx="10" fill="#059669"/>
            <rect x="3" y="3" width="46" height="46" rx="8" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.5"/>
            <text x="26" y="36" textAnchor="middle" fontSize="28" fontWeight="900" fill="white" fontFamily="Georgia, serif">PC</text>
          </svg>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-sm text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Phraseological</span>
            <span className="text-xs text-emerald-600 tracking-widest font-normal" style={{ fontFamily: 'Georgia, serif' }}>CONCORDANCE</span>
          </div>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
          {links.map(({ to, icon, label }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm font-medium
                          transition-colors whitespace-nowrap
                ${pathname === to ? 'bg-emerald-100 text-emerald-800' : 'text-stone-600 hover:bg-stone-100'}`}>
              <span>{icon}</span><span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Language switcher */}
          <div className="flex items-center gap-0.5 border border-stone-200 rounded-lg p-1">
            {LANGS.map(({ code, flag, label }) => (
              <button key={code} onClick={() => i18n.changeLanguage(code)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors
                  ${i18n.language === code ? 'bg-emerald-600 text-white' : 'text-stone-500 hover:bg-stone-100'}`}>
                {flag} {label}
              </button>
            ))}
          </div>

          {/* Auth button */}
          {isUser ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                  Admin
                </span>
              )}
              <button onClick={signOut}
                className="text-sm text-stone-500 hover:text-red-500 transition-colors font-medium">
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/login"
              className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white
                         font-medium px-3 py-1.5 rounded-lg transition-colors">
              Sign in
            </Link>
          )}
        </div>

      </div>
    </nav>
  )
}