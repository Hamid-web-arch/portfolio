import { createContext, useContext } from 'react'
import { t } from '../data'

export const AppContext = createContext({ lang: 'az', setLang: () => {}, theme: 'dark', setTheme: () => {} })

export function useLang() {
  const { lang, setLang } = useContext(AppContext)
  return { lang, setLang, tr: t[lang] }
}

export function useTheme() {
  const { theme, setTheme } = useContext(AppContext)
  return { theme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark') }
}
