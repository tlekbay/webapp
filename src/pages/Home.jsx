import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabaseClient'
import SearchBar from '../components/SearchBar'
import WordCard from '../components/WordCard'

let cachedWords = null

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-6 bg-stone-200 rounded-lg w-32"/>
        <div className="h-6 bg-stone-200 rounded-lg w-16"/>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-14 bg-blue-50 rounded-xl"/>
        <div className="h-14 bg-violet-50 rounded-xl"/>
      </div>
    </div>
  )
}

export default function Home() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [words, setWords] = useState(cachedWords || [])
  const [favIds, setFavIds] = useState(new Set())
  const [loading, setLoading] = useState(false)
  

  useEffect(() => {
    supabase.from('favorites').select('word_id').then(({ data }) => {
      if (data) setFavIds(new Set(data.map(f => f.word_id)))
    })
  }, [])

  const search = useCallback(async (q) => {
    setLoading(true)
    let qb = supabase
  .from('words')
  .select('id, kk, ru, en, category, definition, example') // no created_at etc.
  .order('created_at', { ascending: false })
    // let qb = supabase.from('words').select('*').order('created_at', { ascending: false })
    if (q.trim()) {
      qb = qb.or(`kk.ilike.%${q}%,ru.ilike.%${q}%,en.ilike.%${q}%`)
    } else {
      qb = qb.limit(50)
    }
    const { data } = await qb
    const result = data || []
    if (!q.trim()) cachedWords = result  // cache only the default list
    setWords(result)
    setLoading(false)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query, search])

  useEffect(() => {
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (!user) return
    supabase.from('favorites')
      .select('word_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) setFavIds(new Set(data.map(f => f.word_id)))
      })
  })
}, [])

  function handleFavToggle(id) {
    setFavIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleDelete(id) {
    setWords(prev => prev.filter(w => w.id !== id))
  }

  return (
    <div className="flex flex-col gap-5 pb-24 sm:pb-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{t('search.title')}</h1>
        <p className="text-stone-500 text-sm">{t('search.subtitle')}</p>
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder={t('search.placeholder')} />

      {/* {loading && <p className="text-stone-400 text-sm text-center">{t('search.searching')}</p>} */}

      {loading && (
  <div className="flex flex-col gap-3">
    {[1,2,3].map(i => <SkeletonCard key={i}/>)}
  </div>
)}

      {!loading && words.length === 0 && query && (
        <div className="text-center py-12 text-stone-400">
          <p className="text-4xl mb-2">🔎</p>
          <p>{t('search.notFound')} "<strong>{query}</strong>"</p>
          <p className="text-sm mt-1">{t('search.notFoundHint')}</p>
        </div>
      )}

      {!loading && words.length === 0 && !query && (
        <div className="text-center py-12 text-stone-400">
          <p className="text-4xl mb-2">📖</p>
          <p>{t('search.empty')}</p>
          <p className="text-sm mt-1">{t('search.emptyHint')}</p>
        </div>
      )}

      

      <div className="flex flex-col gap-3">
        {words.map(word => (
          <WordCard
            key={word.id}
            word={word}
            isFav={favIds.has(word.id)}
            onFavToggle={handleFavToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}

