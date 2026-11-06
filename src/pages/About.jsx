import { certificates, education, experience, languages, profile, projects, skills, volunteering } from '../data'
import { useLang } from '../components/lang'
import { BulletList, Card, Contact, Section } from '../components/ui'
import { useReveal } from '../components/useReveal'

const pick = (v, lang) => (typeof v === 'string' ? v : v[lang])

function Timeline({ items, color }) {
  const { lang } = useLang()
  return (
    <ol className="relative space-y-6 border-l border-line pl-6 sm:pl-8">
      {items.map((e) => (
        <li key={pick(e.org, lang) + pick(e.title, lang)} className="relative">
          <span
            className={`absolute -left-[31px] top-6 h-3.5 w-3.5 rounded-full border-2 border-bg sm:-left-[39px] ${color}`}
          />
          <Card className="sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
              <div>
                <h3 className="text-lg font-semibold sm:text-xl">{pick(e.title, lang)}</h3>
                <p className="text-fg-soft">{pick(e.org, lang)}</p>
              </div>
              <span className="text-sm text-subtle">{e.period[lang]}</span>
            </div>
            {e.points[lang].length > 0 && (
              <div className="mt-4">
                <BulletList items={e.points[lang]} />
              </div>
            )}
          </Card>
        </li>
      ))}
    </ol>
  )
}

export default function About() {
  const { lang, tr } = useLang()
  useReveal()

  const stats = [
    [lang === 'az' ? '1-ci' : '1st', tr.statDiploma],
    ['103 / 1600', tr.statSelected],
    [projects.filter((p) => p.featured).length, tr.statReal],
    [projects.filter((p) => p.live).length, tr.statLive],
  ]

  return (
    <>
      {/* intro */}
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-16 sm:px-6 sm:pt-24">
        <div className="grid items-start gap-10 md:grid-cols-[auto_1fr]">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-36 w-36 rounded-3xl border-4 border-line object-cover sm:h-44 sm:w-44"
          />
          <div>
            <p className="font-mono text-primary-text">{tr.aboutTitle}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">{tr.aboutLead}</h1>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-fg-soft">
              {tr.about.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(([n, label]) => (
            <Card key={label} className="p-4 sm:p-5">
              <div className="text-2xl font-bold text-primary-text sm:text-3xl">{n}</div>
              <div className="mt-1 text-xs text-muted sm:text-sm">{label}</div>
            </Card>
          ))}
        </div>
      </section>

      <Section id="experience" title={tr.experienceTitle}>
        <Timeline items={experience} color="bg-primary" />
      </Section>

      <Section id="education" title={tr.educationTitle}>
        <Timeline items={education} color="bg-accent" />
      </Section>

      <Section id="skills" title={tr.skillsTitle}>
        <div className="grid gap-6 md:grid-cols-3">
          {skills.map((s) => (
            <Card key={s.group}>
              <h3 lang="en" className="mb-4 font-mono text-sm uppercase tracking-wider text-primary-text">{s.group}</h3>
              <ul className="flex flex-wrap gap-2">
                {s.items.map((i) => (
                  <li key={i} className="rounded-lg border border-line px-3 py-1.5 text-sm text-fg-soft">
                    {i}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <Card className="mt-6">
          <h3 className="mb-4 font-mono text-sm uppercase tracking-wider text-primary-text">{tr.languagesTitle}</h3>
          <ul className="flex flex-wrap gap-2">
            {languages[lang].map((l) => (
              <li key={l} className="rounded-lg border border-line px-3 py-1.5 text-sm text-fg-soft">
                {l}
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section id="certificates" title={`${tr.certificatesTitle} (${certificates.main.length + certificates.skillsoft.length})`}>
        <div className="grid gap-4 md:grid-cols-3">
          {certificates.main.map((c) => (
            <Card key={c.name} className="border-primary/20">
              <h3 className="font-semibold leading-snug">{c.name}</h3>
              <p className="mt-2 text-sm text-muted">{c.org}</p>
              <p className="mt-1 font-mono text-xs text-subtle">{c.date}</p>
            </Card>
          ))}
        </div>
        <Card className="mt-6">
          <h3 className="mb-4 font-mono text-sm uppercase tracking-wider text-primary-text">
            {tr.skillsoftTitle} · 2026
          </h3>
          <ul className="grid gap-x-8 gap-y-2 text-sm text-fg-soft sm:grid-cols-2">
            {certificates.skillsoft.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="text-primary-text">✓</span>
                {c}
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section id="volunteering" title={tr.volunteeringTitle}>
        <div className="grid gap-4 md:grid-cols-2">
          {volunteering.map((v) => (
            <Card key={v.title}>
              <h3 className="font-semibold">{v.title}</h3>
              <p className="text-sm text-muted">{v.org}</p>
              <p className="mt-3 text-sm text-fg-soft">{v[lang]}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Contact />
    </>
  )
}
