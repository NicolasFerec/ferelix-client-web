import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'

// Detect browser language
function detectLanguage() {
  const browserLang = navigator.language || navigator.userLanguage
  const langCode = browserLang.split('-')[0].toLowerCase()
  
  // Supported languages: en, fr
  if (langCode === 'fr') {
    return 'fr'
  }
  
  // Default to English
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: detectLanguage(),
  fallbackLocale: 'en',
  messages: {
    en,
    fr
  }
})

export default i18n

