import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabaseClient'

const CATEGORIES = ['general', 'noun', 'verb', 'adjective', 'phrase', 'number', 'name']

export default function WordForm({ onSuccess }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    kk: '', ru: '', en: '', category: 'general', definition: '', example: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.kk.trim()) { setError(t('form.required')); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.from('words').insert({
      kk:         form.kk.trim(),
      ru:         form.ru.trim()         || null,
      en:         form.en.trim()         || null,
      category:   form.category,
      definition: form.definition.trim() || null,
      example:    form.example.trim()    || null,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
    setForm({ kk: '', ru: '', en: '', category: 'general', definition: '', example: '' })
    setTimeout(() => setSuccess(false), 3000)
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col gap-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
            {t('form.kk')} <span className="text-red-400">*</span>
          </span>
          <input name="kk" value={form.kk} onChange={handleChange} required
            placeholder="қазақша..."
            className="input-base"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
            {t('form.category')}
          </span>
          <select name="category" value={form.category} onChange={handleChange} className="input-base bg-white">
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{t(`categories.${c}`)}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">{t('form.ru')}</span>
          <input name="ru" value={form.ru} onChange={handleChange}
            placeholder="по-русски..."
            className="input-base border-blue-200 focus:ring-blue-200"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide">{t('form.en')}</span>
          <input name="en" value={form.en} onChange={handleChange}
            placeholder="in English..."
            className="input-base border-violet-200 focus:ring-violet-200"
          />
        </label>
      </div>

      {/* Definition — full width, amber themed */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-amber-500 uppercase tracking-wide">
          {t('form.definition')}
        </span>
        <textarea
          name="definition"
          value={form.definition}
          onChange={handleChange}
          placeholder={t('form.defPlaceholder')}
          rows={3}
          className="input-base border-amber-200 focus:ring-amber-200 resize-none"
        />
      </label>

      {/* Example sentence */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
          {t('form.example')}
        </span>
        <input name="example" value={form.example} onChange={handleChange}
          placeholder={t('form.exPlaceholder')}
          className="input-base"
        />
      </label>

      {error   && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-emerald-600 text-sm font-medium">{t('form.success')}</p>}

      {/* <button type="submit" disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white
                   font-semibold py-2.5 px-6 rounded-lg transition-colors self-start">
        {loading ? t('form.saving') : t('form.save')}
      </button> */}

      <button type="submit" disabled={loading} className="btn-primary">
  {loading ? t('form.saving') : t('form.save')}
</button>
    </form>
  )
}