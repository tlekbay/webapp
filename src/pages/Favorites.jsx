import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import WordCard from '../components/WordCard'

export default function Favorites() {
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('favorites')
      .select('word_id, words(*)')
      .order('created_at', { ascending: false })
    setWords((data || []).map(f => f.words).filter(Boolean))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function handleFavToggle(wordId) {
    // When toggled off, remove from this page
    setWords(prev => prev.filter(w => w.id !== wordId))
  }

  function handleDelete(wordId) {
    setWords(prev => prev.filter(w => w.id !== wordId))
  }

  if (loading) return <p className="text-stone-400 text-center py-12">Loading favorites...</p>

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800 mb-1">Favorites</h1>
        <p className="text-stone-500 text-sm">{words.length} saved word{words.length !== 1 ? 's' : ''}</p>
      </div>

      {words.length === 0 && (
        <div className="text-center py-12 text-stone-400">
          <p className="text-4xl mb-2">⭐</p>
          <p>No favorites yet</p>
          <p className="text-sm mt-1">Star a word from the search page to save it here</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {words.map(word => (
          <WordCard
            key={word.id}
            word={word}
            isFav={true}
            onFavToggle={handleFavToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}