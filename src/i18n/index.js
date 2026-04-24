import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import kk from './kk'
import ru from './ru'
import en from './en'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { kk, ru, en },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n