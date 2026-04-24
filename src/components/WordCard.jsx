import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'

export default function WordCard({ word, isFav, onFavToggle, onDelete }) {
  const { t } = useTranslation()
  const { isAdmin, isUser } = useAuth()
  const [loading, setLoading] = useState(false)

  async function toggleFav() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (isFav) {
      await supabase.from('favorites').delete()
        .eq('word_id', word.id).eq('user_id', user.id)
    } else {
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
    <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col gap-3 shadow-sm active:shadow-md transition-shadow">

      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <h2 className="text-xl font-bold text-stone-900 break-words">{word.kk}</h2>
          {word.category && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full shrink-0">
              {t(`categories.${word.category}`, word.category)}
            </span>
          )}
        </div>

        {/* Action buttons — large touch targets */}
        <div className="flex items-center gap-1 shrink-0">
          {isUser && (
            <button onClick={toggleFav} disabled={loading}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-stone-100 active:bg-stone-200 transition-colors text-xl">
              {isFav ? '⭐' : '☆'}
            </button>
          )}
          {isAdmin && (
            <>
              <Link to={`/edit/${word.id}`}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-emerald-50 active:bg-emerald-100 transition-colors text-stone-400 hover:text-emerald-600 text-lg">
                ✎
              </Link>
              <button onClick={handleDelete}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-50 active:bg-red-100 transition-colors text-stone-400 hover:text-red-500">
                ✕
              </button>
            </>
          )}
        </div>
      </div>

      {/* Translations */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {word.ru && (
          <div className="bg-blue-50 rounded-xl px-3 py-2.5">
            <div className="text-xs text-blue-400 font-semibold uppercase tracking-wide mb-1">RU</div>
            <div className="text-blue-900 font-medium break-words">{word.ru}</div>
          </div>
        )}
        {word.en && (
          <div className="bg-violet-50 rounded-xl px-3 py-2.5">
            <div className="text-xs text-violet-400 font-semibold uppercase tracking-wide mb-1">EN</div>
            <div className="text-violet-900 font-medium break-words">{word.en}</div>
          </div>
        )}
      </div>

      {/* Definition */}
      {word.definition && (
        <div className="bg-amber-50 rounded-xl px-3 py-2.5 text-sm">
          <div className="text-xs text-amber-500 font-semibold uppercase tracking-wide mb-1">
            {t('word.definition')}
          </div>
          <p className="text-amber-900 break-words">{word.definition}</p>
        </div>
      )}

      {/* Example */}
      {word.example && (
        <p className="text-sm text-stone-400 italic border-t border-stone-100 pt-2.5 break-words">
          <span className="text-stone-300 text-xs uppercase tracking-wide not-italic mr-1">
            {t('word.example')}:
          </span>
          "{word.example}"
        </p>
      )}
    </div>
  )
}