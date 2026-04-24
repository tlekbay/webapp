import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext' 
import { Link } from 'react-router-dom'

export default function WordCard({ word, isFav, onFavToggle, onDelete }) {
  const { t } = useTranslation()
  const { isAdmin, isUser } = useAuth()  
  const [loading, setLoading] = useState(false)

  async function toggleFav() {
  setLoading(true)
  if (isFav) {
    await supabase.from('favorites')
      .delete()
      .eq('word_id', word.id)
      .eq('user_id', (await supabase.auth.getUser()).data.user.id)
  } else {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('favorites').insert({ word_id: word.id, user_id: user.id })
  }
  onFavToggle(word.id)
  setLoading(false)
}

  async function handleDelete() {
    if (!confirm(`${t('word.confirmDel')}: "${word.kk}"?`)) return
    await supabase.from('words').delete().eq('id', word.id)
    onDelete(word.id)
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xl font-bold text-stone-900">{word.kk}</h2>
          {word.category && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              {t(`categories.${word.category}`, word.category)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
    {isUser && (
      <button onClick={toggleFav} disabled={loading}
        className="text-xl hover:scale-110 transition-transform">
        {isFav ? '⭐' : '☆'}
      </button>
    )}
    {isAdmin && (
  <>
    <Link to={`/edit/${word.id}`}
      className="text-stone-400 hover:text-emerald-600 transition-colors text-sm"
      title="Edit">
      ✏️
    </Link>
    <button onClick={handleDelete}
      className="text-stone-400 hover:text-red-500 transition-colors text-sm"
      title={t('word.delete')}>
      ❌
    </button>
  </>
)}
  </div>
      </div>

      {/* Translations */}
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

      {/* Definition */}
      {word.definition && (
        <div className="bg-amber-50 rounded-lg px-3 py-2 text-sm">
          <div className="text-xs text-amber-500 font-medium uppercase tracking-wide mb-0.5">
            {t('word.definition')}
          </div>
          <p className="text-amber-900">{word.definition}</p>
        </div>
      )}

      {/* Example */}
      {word.example && (
        <p className="text-sm text-stone-400 italic border-t border-stone-100 pt-2">
          <span className="text-stone-300 text-xs uppercase tracking-wide mr-1 not-italic">
            {t('word.example')}:
          </span>
          "{word.example}"
        </p>
      )}
    </div>
  )
}