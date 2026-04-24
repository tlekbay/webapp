import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabaseClient'
import WordCard from '../components/WordCard'

export default function Favorites() {
  const { t } = useTranslation()
  const [words, setWords]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    supabase
      .from('favorites')
      .select('word_id, words(*)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setWords((data || []).map(f => f.words).filter(Boolean))
        setLoading(false)
      })
  }, [])

  function handleFavToggle(id) { setWords(prev => prev.filter(w => w.id !== id)) }
  function handleDelete(id)    { setWords(prev => prev.filter(w => w.id !== id)) }

  if (loading) return <p className="text-stone-400 text-center py-12">{t('favorites.loading')}</p>

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{t('favorites.title')}</h1>
        <p className="text-stone-500 text-sm">{words.length} {t('favorites.saved')}</p>
      </div>

      {words.length === 0 && (
        <div className="text-center py-12 text-stone-400">
          <p className="text-4xl mb-2">⭐</p>
          <p>{t('favorites.empty')}</p>
          <p className="text-sm mt-1">{t('favorites.emptyHint')}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {words.map(word => (
          <WordCard key={word.id} word={word} isFav={true}
            onFavToggle={handleFavToggle} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}