import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function WordCard({ word, isFav, onFavToggle, onDelete }) {
  const [loading, setLoading] = useState(false)

  async function toggleFav() {
    setLoading(true)
    if (isFav) {
      await supabase.from('favorites').delete().eq('word_id', word.id)
    } else {
      await supabase.from('favorites').insert({ word_id: word.id })
    }
    onFavToggle(word.id)
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm(`Delete "${word.kk}"?`)) return
    await supabase.from('words').delete().eq('id', word.id)
    onDelete(word.id)
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">{word.kk}</h2>
          {word.category && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              {word.category}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleFav}
            disabled={loading}
            className="text-xl hover:scale-110 transition-transform"
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFav ? '⭐' : '☆'}
          </button>
          <button
            onClick={handleDelete}
            className="text-stone-400 hover:text-red-500 transition-colors text-sm"
            title="Delete word"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {word.ru && (
          <div className="bg-blue-50 rounded-lg px-3 py-2">
            <div className="text-xs text-blue-400 font-medium uppercase tracking-wide mb-0.5">RU</div>
            <div className="text-blue-900 font-medium">{word.ru}</div>
          </div>
        )}
        {word.en && (
          <div className="bg-violet-50 rounded-lg px-3 py-2">
            <div className="text-xs text-violet-400 font-medium uppercase tracking-wide mb-0.5">EN</div>
            <div className="text-violet-900 font-medium">{word.en}</div>
          </div>
        )}
      </div>

      {word.example && (
        <p className="text-sm text-stone-500 italic border-t border-stone-100 pt-2">
          "{word.example}"
        </p>
      )}
    </div>
  )
}