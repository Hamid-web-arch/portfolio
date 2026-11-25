import { Link } from 'react-router-dom'
import { profile, projects } from '../data'
import { useLang } from '../components/context'
import { Contact, ProjectCard, Section } from '../components/ui'
import { useReveal } from '../components/useReveal'
import BugHunt from '../components/BugHunt'
import { ArrowIcon, GithubIcon, LinkedinIcon, MailIcon, WhatsappIcon } from '../components/icons'

const featured = projects.filter((p) => p.featured)
const others = projects.filter((p) => !p.featured)

export default function Home() {
  const { tr } = useLang()
  useReveal()

  return (
    <>
      {/* hero */}
      <section className="mx-auto flex min-h-[calc(100svh-72px)] max-w-6xl flex-col-reverse items-center justify-center gap-12 px-4 py-16 sm:px-6 md:flex-row">
        <div className="flex-1">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary-text">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            {tr.location} · {tr.openTo}
          </div>
          <p className="font-mono text-primary-text">{tr.hello}</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-6xl">{profile.name}</h1>
          <p className="mt-4 bg-linear-to-r from-primary via-accent to-accent-2 bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">
            {tr.role}
          </p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{tr.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="rounded-btn bg-primary px-6 py-3 font-semibold text-on-primary transition hover:bg-primary-hover">
              {tr.cta}
            </a>
            <Link to="/about" className="rounded-btn border border-line-strong px-6 py-3 font-semibold transition hover:border-primary/60">
              {tr.aboutBtn}
            </Link>
          </div>
          <div className="mt-8 flex gap-4 text-muted">
            <a href={profile.whatsapp[0].url} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:text-fg">
              <WhatsappIcon className="h-6 w-6" />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email" className="hover:text-fg">
              <MailIcon className="h-6 w-6" />
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-fg">
              <GithubIcon className="h-6 w-6" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-fg">
              <LinkedinIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary to-accent-2 opacity-30 blur-2xl" />
          <img
            src={profile.avatar}
            alt={profile.name}
            width={288}
            height={288}
            fetchPriority="high"
            decoding="async"
            className="relative h-56 w-56 rounded-full border-4 border-line object-cover sm:h-72 sm:w-72"
          />
        </div>
      </section>

      {/* projects */}
      <Section id="projects" title={tr.projectsTitle}>
        <div className="grid gap-6 lg:grid-cols-2">
          {featured.map((p, i) => (
            // tək sayda əsas layihə varsa, sonuncu kart geniş ekranda bütün sətri tutur
            <ProjectCard
              key={p.title}
              p={p}
              className={featured.length % 2 === 1 && i === featured.length - 1 ? 'lg:col-span-2' : ''}
            />
          ))}
        </div>
        <h3 className="mb-6 mt-14 font-mono text-sm uppercase tracking-wider text-subtle">{tr.otherProjects}</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {others.map((p) => (
            <ProjectCard key={p.title} p={p} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href={profile.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-fg-soft hover:text-fg">
            <GithubIcon className="h-5 w-5" /> {tr.more} <ArrowIcon className="h-4 w-4" />
          </a>
        </div>
      </Section>

      {/* mini oyun */}
      <Section id="play" title={tr.gameTitle}>
        <BugHunt />
      </Section>

      <Contact />
    </>
  )
}
