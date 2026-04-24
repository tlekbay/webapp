export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Search...'}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white
                   focus:outline-none focus:ring-2 focus:ring-emerald-300 text-stone-800
                   placeholder-stone-400 shadow-sm"
      />
    </div>
  )
}