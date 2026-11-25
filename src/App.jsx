import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { AppContext, useLang } from './components/context'
import { t } from './data'
import Home from './pages/Home'
import About from './pages/About'

function NotFound() {
  const { tr } = useLang()
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-6xl font-bold text-primary-text">404</p>
      <p className="text-xl">{tr.notFound}</p>
      <Link to="/" className="text-primary-text hover:text-fg">
        ← {tr.backHome}
      </Link>
    </div>
  )
}

const read = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}
const save = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

export default function App() {
  const [lang, setLang] = useState(() => read('lang', 'az'))
  // default: qaranlıq tema
  const [theme, setTheme] = useState(() => read('theme', 'dark'))

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t[lang].metaTitle
    document.querySelector('meta[name="description"]')?.setAttribute('content', t[lang].metaDescription)
    save('lang', lang)
  }, [lang])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b0f17' : '#f8fafc')
    save('theme', theme)
  }, [theme])

  const ctx = useMemo(() => ({ lang, setLang, theme, setTheme }), [lang, theme])

  return (
    <AppContext.Provider value={ctx}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}
