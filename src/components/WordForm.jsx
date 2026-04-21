import { useState } from 'react'
import { supabase } from '../supabaseClient'

const CATEGORIES = ['general', 'noun', 'verb', 'adjective', 'phrase', 'number', 'name']

export default function WordForm({ onSuccess }) {
  const [form, setForm] = useState({ kk: '', ru: '', en: '', category: 'general', example: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.kk.trim()) { setError('Kazakh word is required'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.from('words').insert({
      kk: form.kk.trim(),
      ru: form.ru.trim() || null,
      en: form.en.trim() || null,
      category: form.category,
      example: form.example.trim() || null,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
    setForm({ kk: '', ru: '', en: '', category: 'general', example: '' })
    setTimeout(() => setSuccess(false), 3000)
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col gap-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
            Kazakh word <span className="text-red-400">*</span>
          </span>
          <input name="kk" value={form.kk} onChange={handleChange} required
            placeholder="қазақша..."
            className="input-base"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Category</span>
          <select name="category" value={form.category} onChange={handleChange} className="input-base bg-white">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Russian</span>
          <input name="ru" value={form.ru} onChange={handleChange}
            placeholder="по-русски..."
            className="input-base border-blue-200 focus:ring-blue-200"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide">English</span>
          <input name="en" value={form.en} onChange={handleChange}
            placeholder="in English..."
            className="input-base border-violet-200 focus:ring-violet-200"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Example sentence</span>
        <input name="example" value={form.example} onChange={handleChange}
          placeholder="Example sentence in Kazakh..."
          className="input-base"
        />
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-emerald-600 text-sm font-medium">✓ Word added successfully!</p>}

      <button type="submit" disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white
                   font-semibold py-2.5 px-6 rounded-lg transition-colors self-start">
        {loading ? 'Saving...' : 'Add word'}
      </button>
    </form>
  )
}