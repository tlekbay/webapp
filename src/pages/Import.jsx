import { useState } from 'react'
import { supabase } from '../supabaseClient'

// Expected CSV format:
// kk,ru,en,category,example
// сәлем,привет,hello,phrase,Сәлем досым!

function parseCSV(text) {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim())
    const row = {}
    headers.forEach((h, i) => { row[h] = values[i] || null })
    return row
  }).filter(r => r.kk)
}

function parseJSON(text) {
  const data = JSON.parse(text)
  return (Array.isArray(data) ? data : data.words || []).filter(r => r.kk)
}

export default function Import() {
  const [status, setStatus] = useState(null)
  const [preview, setPreview] = useState([])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = ev.target.result
        const parsed = file.name.endsWith('.json') ? parseJSON(text) : parseCSV(text)
        setRows(parsed)
        setPreview(parsed.slice(0, 5))
        setStatus({ type: 'info', msg: `Found ${parsed.length} words. Preview below. Click Import to save.` })
      } catch {
        setStatus({ type: 'error', msg: 'Could not parse file. Check the format.' })
      }
    }
    reader.readAsText(file)
  }

  async function handleImport() {
    if (!rows.length) return
    setLoading(true)
    const { error, count } = await supabase
      .from('words')
      .upsert(rows, { onConflict: 'kk', ignoreDuplicates: true })
      .select()
    setLoading(false)
    if (error) {
      setStatus({ type: 'error', msg: error.message })
    } else {
      setStatus({ type: 'success', msg: `Successfully imported ${rows.length} words!` })
      setRows([])
      setPreview([])
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800 mb-1">Import words</h1>
        <p className="text-stone-500 text-sm">Upload a CSV or JSON file to bulk-add words</p>
      </div>

      {/* Format guide */}
      <div className="bg-stone-100 rounded-xl p-4 text-sm text-stone-600">
        <p className="font-semibold mb-2">CSV format (first row = headers):</p>
        <pre className="bg-white rounded-lg p-3 text-xs overflow-x-auto border border-stone-200">
{`kk,ru,en,category,example
сәлем,привет,hello,phrase,Сәлем досым!
су,вода,water,noun,Мен су ішемін.`}
        </pre>
        <p className="font-semibold mt-3 mb-2">JSON format:</p>
        <pre className="bg-white rounded-lg p-3 text-xs overflow-x-auto border border-stone-200">
{`[
  { "kk": "сәлем", "ru": "привет", "en": "hello", "category": "phrase" },
  { "kk": "су", "ru": "вода", "en": "water", "category": "noun" }
]`}
        </pre>
      </div>

      {/* Upload */}
      <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed
                        border-stone-300 rounded-xl p-10 cursor-pointer hover:border-emerald-400
                        hover:bg-emerald-50 transition-colors">
        <span className="text-4xl">📁</span>
        <span className="text-stone-500 text-sm">Click to upload CSV or JSON</span>
        <input type="file" accept=".csv,.json" onChange={handleFile} className="hidden" />
      </label>

      {/* Status */}
      {status && (
        <p className={`text-sm px-4 py-3 rounded-lg font-medium
          ${status.type === 'error'   ? 'bg-red-50 text-red-600'     : ''}
          ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : ''}
          ${status.type === 'info'    ? 'bg-blue-50 text-blue-700'   : ''}`}>
          {status.msg}
        </p>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <div>
          <h3 className="font-semibold text-stone-700 mb-2">Preview (first {preview.length})</h3>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-sm">
              <thead className="bg-stone-100 text-stone-500 text-xs uppercase">
                <tr>
                  {['kk', 'ru', 'en', 'category', 'example'].map(h => (
                    <th key={h} className="px-3 py-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-t border-stone-100">
                    <td className="px-3 py-2 font-medium">{row.kk}</td>
                    <td className="px-3 py-2 text-blue-700">{row.ru}</td>
                    <td className="px-3 py-2 text-violet-700">{row.en}</td>
                    <td className="px-3 py-2 text-stone-400">{row.category}</td>
                    <td className="px-3 py-2 text-stone-400 italic">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <button onClick={handleImport} disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white
                     font-semibold py-2.5 px-6 rounded-lg transition-colors self-start">
          {loading ? 'Importing...' : `Import ${rows.length} words`}
        </button>
      )}
    </div>
  )
}