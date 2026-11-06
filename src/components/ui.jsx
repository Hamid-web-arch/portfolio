import { profile } from '../data'
import { useLang } from './lang'
import { ArrowIcon, GithubIcon, LinkedinIcon, MailIcon, WhatsappIcon } from './icons'

export function Section({ id, title, children }) {
  return (
    <section id={id} className="reveal mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      {title && (
        <h2 className="mb-10 flex items-center gap-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
          <span className="h-px flex-1 bg-linear-to-r from-line-strong to-transparent" />
        </h2>
      )}
      {children}
    </section>
  )
}

export function ProjectCard({ p }) {
  const { lang, tr } = useLang()
  return (
    <article
      className={`glow-card group relative flex flex-col rounded-card border border-line bg-surface p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-primary/40 ${
        p.featured ? 'border-primary/20 lg:p-8' : ''
      }`}
    >
      {p.featured && (
        <span className="mb-3 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-text">
          ★ {tr.featured}
        </span>
      )}
      <h3 className={`font-semibold ${p.featured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>{p.title}</h3>
      <p className={`mt-3 leading-relaxed text-muted ${p.featured ? 'text-base' : 'flex-1 text-sm'}`}>{p.desc[lang]}</p>
      {p.highlights && (
        <div className="mt-5 flex-1">
          <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-subtle">{tr.features}</h4>
          <BulletList items={p.highlights[lang]} className="text-fg-soft" />
        </div>
      )}
      <ul className="mt-5 flex flex-wrap gap-2">
        {p.tags.map((tag) => (
          <li key={tag} className="rounded-md bg-chip px-2 py-1 font-mono text-xs text-fg-soft">
            {tag}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex gap-4 text-sm font-medium">
        {p.live && (
          <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary-text hover:text-fg">
            {tr.live} <ArrowIcon className="h-4 w-4" />
          </a>
        )}
        <a href={p.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-fg-soft hover:text-fg">
          <GithubIcon className="h-4 w-4" /> {tr.code}
        </a>
      </div>
    </article>
  )
}

export function BulletList({ items, className = 'text-muted' }) {
  if (!items?.length) return null
  return (
    <ul className={`space-y-2 text-sm ${className}`}>
      {items.map((it) => (
        <li key={it} className="flex gap-2">
          <span className="text-primary-text">▸</span>
          {it}
        </li>
      ))}
    </ul>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`glow-card rounded-card border border-line bg-surface p-6 backdrop-blur-sm ${className}`}>{children}</div>
}

export function Contact() {
  const { tr } = useLang()
  return (
    <Section id="contact" title={tr.nav.contact}>
      <div className="glow-card rounded-3xl border border-line bg-surface p-8 text-center backdrop-blur-sm sm:p-14">
        <h3 className="text-3xl font-bold sm:text-4xl">{tr.contactTitle}</h3>
        <p className="mx-auto mt-4 max-w-lg text-muted">{tr.contactText}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {profile.whatsapp.map((w) => (
            <a
              key={w.url}
              href={w.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-btn bg-primary px-5 py-3 font-semibold text-on-primary transition hover:bg-primary-hover"
            >
              <WhatsappIcon className="h-5 w-5 shrink-0" /> {w.label}
            </a>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 break-all rounded-btn border border-line-strong px-5 py-3 font-semibold transition hover:border-primary/60"
          >
            <MailIcon className="h-5 w-5 shrink-0" /> {profile.email}
          </a>
        </div>
        <div className="mt-8 flex justify-center gap-6 text-muted">
          <a href={profile.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-fg">
            <GithubIcon className="h-5 w-5" /> GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-fg">
            <LinkedinIcon className="h-5 w-5" /> LinkedIn
          </a>
        </div>
      </div>
    </Section>
  )
}
