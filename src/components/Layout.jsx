import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { profile } from '../data'
import { useLang, useTheme } from './context'
import BackgroundFX from './BackgroundFX'
import { GithubIcon, LinkedinIcon, MailIcon, WhatsappIcon } from './icons'

const YEAR = new Date().getFullYear()

// Hər naviqasiyada: #hash varsa ora, yoxdursa səhifənin başına scroll.
// `key` hər klikdə dəyişir — eyni linkə (məs. "Əlaqə") ikinci dəfə basanda da işləyir.
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash, key])
  return null
}

export default function Layout() {
  const { lang, setLang, tr } = useLang()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // Mobil menyu Escape ilə bağlanır
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const links = [
    { to: '/', label: tr.nav.home, end: true },
    { to: '/#projects', label: tr.nav.projects, hash: true },
    { to: '/about', label: tr.nav.about },
    { to: '#contact', label: tr.nav.contact, hash: true },
  ]

  const linkClass = (active) => `text-sm transition hover:text-fg ${active ? 'text-primary-text' : 'text-muted'}`

  const renderLink = (l, mobile) =>
    l.hash ? (
      <Link
        key={l.to}
        to={l.to === '#contact' ? `${pathname}#contact` : l.to}
        onClick={() => setMenuOpen(false)}
        className={mobile ? 'block py-3 text-fg-soft' : linkClass(false)}
      >
        {l.label}
      </Link>
    ) : (
      <NavLink
        key={l.to}
        to={l.to}
        end={l.end}
        onClick={() => setMenuOpen(false)}
        className={({ isActive }) => (mobile ? `block py-3 ${isActive ? 'text-primary-text' : 'text-fg-soft'}` : linkClass(isActive))}
      >
        {l.label}
      </NavLink>
    )

  return (
    <div className="relative min-h-screen bg-bg text-fg antialiased selection:bg-primary/30">
      <a href="#main" className="skip-link">
        {tr.skip}
      </a>
      <BackgroundFX />
      <ScrollManager />

      <header className="sticky top-0 z-50 border-b border-line-soft bg-bg/70 backdrop-blur">
        <nav aria-label={tr.navLabel} className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="font-mono text-lg font-bold" aria-label={`${tr.nav.home} — Həmid Ağabəyov`}>
            <span className="text-primary-text">&lt;</span>HA<span className="text-primary-text">/&gt;</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">{links.map((l) => renderLink(l, false))}</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === 'az' ? 'en' : 'az')}
              className="rounded-lg border border-line px-3 py-1.5 font-mono text-xs uppercase hover:border-primary/50"
              aria-label={tr.switchLang}
              lang={lang === 'az' ? 'en' : 'az'}
            >
              {lang === 'az' ? 'EN' : 'AZ'}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg border border-line p-1.5 hover:border-primary/50"
              aria-label={theme === 'dark' ? tr.lightMode : tr.darkMode}
              title={theme === 'dark' ? tr.lightMode : tr.darkMode}
            >
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg border border-line p-2 md:hidden"
              aria-label={menuOpen ? tr.menuClose : tr.menuOpen}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d={menuOpen ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} />
              </svg>
            </button>
          </div>
        </nav>
        {menuOpen && (
          <div id="mobile-menu" className="border-t border-line-soft px-4 pb-4 md:hidden">
            {links.map((l) => renderLink(l, true))}
          </div>
        )}
      </header>

      <main id="main" tabIndex={-1} className="relative z-10 outline-none">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-line-soft py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-subtle sm:flex-row sm:px-6">
          <span>
            © {YEAR} {profile.name}. {tr.rights}
          </span>
          <div className="flex gap-4">
            <a href={profile.whatsapp[0].url} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:text-fg">
              <WhatsappIcon className="h-5 w-5" />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email" className="hover:text-fg">
              <MailIcon className="h-5 w-5" />
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-fg">
              <GithubIcon className="h-5 w-5" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-fg">
              <LinkedinIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
