import WordForm from '../components/WordForm'

export default function AddWord() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800 mb-1">Add a word</h1>
        <p className="text-stone-500 text-sm">Add a new Kazakh word with translations</p>
      </div>
      <WordForm />
    </div>
  )
}