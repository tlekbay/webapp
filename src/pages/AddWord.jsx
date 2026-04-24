import { useTranslation } from 'react-i18next'
import WordForm from '../components/WordForm'

export default function AddWord() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{t('form.title')}</h1>
        <p className="text-stone-500 text-sm">{t('form.subtitle')}</p>
      </div>
      <WordForm />
    </div>
  )
}