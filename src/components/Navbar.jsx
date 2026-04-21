import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/',          label: '🔍 Search'    },
  { to: '/add',       label: '➕ Add word'  },
  { to: '/favorites', label: '⭐ Favorites' },
  { to: '/import',    label: '📥 Import'    },
]

export default function Navbar() {
  const { pathname } = useLocation()
  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 flex items-center gap-1 h-14">
        <span className="font-bold text-lg mr-4 text-emerald-700">🇰🇿 Сөздік</span>
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${pathname === to
                ? 'bg-emerald-100 text-emerald-800'
                : 'text-stone-600 hover:bg-stone-100'}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}