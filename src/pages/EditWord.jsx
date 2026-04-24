import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabaseClient'

const CATEGORIES = ['general', 'noun', 'verb', 'adjective', 'phrase', 'number', 'name']

export default function EditWord() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('words').select('*').eq('id', id).single()
      .then(({ data }) => setForm(data))
  }, [id])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const { error: err } = await supabase.from('words').update({
      kk: form.kk, ru: form.ru, en: form.en,
      category: form.category, definition: form.definition, example: form.example,
    }).eq('id', id)
    setLoading(false)
    if (err) { setError(err.message); return }
    navigate('/')
  }

  if (!form) return <p className="text-stone-400 text-center py-12">Loading...</p>

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-stone-800">Edit word</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col gap-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{t('form.kk')} *</span>
            <input name="kk" value={form.kk || ''} onChange={handleChange} required className="input-base"/>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{t('form.category')}</span>
            <select name="category" value={form.category || 'general'} onChange={handleChange} className="input-base bg-white">
              {CATEGORIES.map(c => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">{t('form.ru')}</span>
            <input name="ru" value={form.ru || ''} onChange={handleChange} className="input-base border-blue-200"/>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide">{t('form.en')}</span>
            <input name="en" value={form.en || ''} onChange={handleChange} className="input-base border-violet-200"/>
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wide">{t('form.definition')}</span>
          <textarea name="definition" value={form.definition || ''} onChange={handleChange}
            rows={2} className="input-base border-amber-200 resize-none"/>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{t('form.example')}</span>
          <input name="example" value={form.example || ''} onChange={handleChange} className="input-base"/>
        </label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
            {loading ? 'Saving...' : 'Save changes'}
          </button>
          <button type="button" onClick={() => navigate(-1)}
            className="text-stone-500 hover:text-stone-700 font-medium py-2.5 px-4">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}