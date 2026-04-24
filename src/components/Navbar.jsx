import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'


const LANGS = [
  {
    code: 'kk',
    label: 'KK',
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 12" width="20" height="12">
        <rect width="20" height="12" fill="#00AFCA"/>
        <circle cx="10" cy="6" r="2.5" fill="#FFE000"/>
        <path d="M13 4.5 Q14.5 6 13 7.5" stroke="#FFE000" strokeWidth="0.5" fill="none"/>
      </svg>
    ),
  },
  {
    code: 'ru',
    label: 'RU',
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 12" width="20" height="12">
        <rect width="20" height="4" fill="white"/>
        <rect y="4" width="20" height="4" fill="#0039A6"/>
        <rect y="8" width="20" height="4" fill="#D52B1E"/>
      </svg>
    ),
  },
  {
    code: 'en',
    label: 'EN',
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 12" width="20" height="12">
        <rect width="20" height="12" fill="#012169"/>
        <path d="M0 0L20 12M20 0L0 12" stroke="white" strokeWidth="2.5"/>
        <path d="M0 0L20 12M20 0L0 12" stroke="#C8102E" strokeWidth="1.5"/>
        <path d="M10 0V12M0 6H20" stroke="white" strokeWidth="3.5"/>
        <path d="M10 0V12M0 6H20" stroke="#C8102E" strokeWidth="2"/>
      </svg>
    ),
  },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const { isUser, isAdmin, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/',          icon: '🔍', label: t('nav.search'),    show: true    },
    { to: '/favorites', icon: '⭐', label: t('nav.favorites'), show: isUser  },
    { to: '/add',       icon: '➕', label: t('nav.addWord'),   show: isAdmin },
    { to: '/import',    icon: '📥', label: t('nav.import'),    show: isAdmin },
  ].filter(l => l.show)

  function close() { setMenuOpen(false) }

  return (
    <>
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/" onClick={close} className="flex items-center gap-2.5 shrink-0">
            <svg width="34" height="34" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
              <rect width="52" height="52" rx="10" fill="#059669"/>
              <rect x="3" y="3" width="46" height="46" rx="8" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.5"/>
              <text x="26" y="36" textAnchor="middle" fontSize="28" fontWeight="900" fill="white" fontFamily="Georgia, serif">PC</text>
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-xs text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Phraseological</span>
              <span className="text-[10px] text-emerald-600 tracking-widest font-normal" style={{ fontFamily: 'Georgia, serif' }}>CONCORDANCE</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-0.5 flex-1">
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
            {/* Language switcher — desktop */}
            <div className="hidden sm:flex items-center gap-0.5 border border-stone-200 rounded-lg p-1">
              {LANGS.map(({ code, flag, label }) => (
                <button key={code} onClick={() => i18n.changeLanguage(code)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors
                    ${i18n.language === code ? 'bg-emerald-600 text-white' : 'text-stone-500 hover:bg-stone-100'}`}>
                  {flag} {label}
                </button>
              ))}
            </div>

            {/* Auth — desktop */}
            <div className="hidden sm:flex items-center gap-2">
              {isUser ? (
                <>
                  {isAdmin && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Admin</span>}
                  <button onClick={signOut} className="text-sm text-stone-500 hover:text-red-500 transition-colors font-medium">{t('nav.signOut')}</button>
                </>
              ) : (
                <Link to="/login" className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors">
                  {t('nav.signIn')}
                </Link>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="sm:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Menu"
            >
              <span className={`block w-5 h-0.5 bg-stone-600 transition-transform duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}/>
              <span className={`block w-5 h-0.5 bg-stone-600 transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`}/>
              <span className={`block w-5 h-0.5 bg-stone-600 transition-transform duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}/>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-stone-100 bg-white px-4 py-3 flex flex-col gap-1">
            {links.map(({ to, icon, label }) => (
              <Link key={to} to={to} onClick={close}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors
                  ${pathname === to ? 'bg-emerald-100 text-emerald-800' : 'text-stone-700 hover:bg-stone-100'}`}>
                <span className="text-lg">{icon}</span><span>{label}</span>
              </Link>
            ))}

            {/* Language switcher — mobile */}
            <div className="flex items-center gap-2 px-3 py-3 border-t border-stone-100 mt-1">
              {LANGS.map(({ code, flag, label }) => (
                <button key={code} onClick={() => { i18n.changeLanguage(code); close() }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors
                    ${i18n.language === code ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  
                  
                  <span className="flex items-center gap-1.5">
  <span className="rounded-sm overflow-hidden">{flag}</span>
  <span>{label}</span>
</span>
                </button>
              ))}
            </div>

            {/* Auth — mobile */}
            <div className="px-3 py-2 border-t border-stone-100">
              {isUser ? (
                <div className="flex items-center justify-between">
                  {isAdmin && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Admin</span>}
                  <button onClick={() => { signOut(); close() }}
                    className="text-base text-red-500 font-medium py-2">
                    {t('nav.signOut')}
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={close}
                  className="block w-full text-center bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors">
                  {t('nav.signIn')}
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Tap outside to close */}
      {menuOpen && (
        <div className="fixed inset-0 z-10" onClick={close}/>
      )}
    </>
  )
}