import { trackPageView } from './analytics';
import { StrategyDeck } from './StrategyDeck';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { content, projects, homeProjects, type Project, type Company, type Media, type ComparisonItem } from './content';
import { ContactLink } from './ContactLink';
import './style.css';
const caseUrl = (slug: string) => `${import.meta.env.BASE_URL}cases/${slug}/`;
function ProjectMedia({ media }: { media: Media }) {
  return <div className={`project-image ${media.layout}`}>
    <img src={media.image} alt={media.alt}/>
  </div>;
}
function ProjectCard({ project, next = false }: { project: Project; next?: boolean }) {
  return <article className="project" id={next ? undefined : project.slug}>
    <ProjectMedia media={project}/>
    <h3>{project.title}</h3><p>{project.description}</p>
    <a className="project-link" href={caseUrl(project.slug)} aria-label={`${next ? 'Перейти' : 'Подробнее'}: ${project.title}`}>{next ? 'ПЕРЕЙТИ' : 'ПОДРОБНЕЕ'} ›</a>
  </article>;
}
function CaseComparison({ items }: { items: ComparisonItem[] }) {
  return <div className={`case-comparison${items.length === 1 ? ' case-comparison-single' : ''}`}>{items.map(item => <figure key={item.label}>
    <div className="project-image phone">{item.image ? <img src={item.image} alt={item.alt}/> : <div className="phone-placeholder">{item.placeholder ?? 'Скриншот будет добавлен'}</div>}</div>
    {!item.hideCaption && <figcaption><h3>{item.label}</h3><p>{item.caption}</p></figcaption>}
  </figure>)}</div>;
}
function ContactFooter() {
  return <footer className="contact-footer"><ContactLink value={content.links.telegram}>{content.contactLabel}</ContactLink></footer>;
}
function Experience({ company }: { company: Company }) {
  return <section className="experience" aria-label={company.name}><header className="company-header"><h2><img src={company.logo} alt=""/>{company.name}</h2><p className="company-meta"><span>{company.role}</span><span aria-hidden="true">•</span><span>{company.period}</span></p></header><div className="projects">{company.projects.map(project => <ProjectCard key={project.slug} project={project}/>)}</div></section>;
}
function HomePage() {
  return <main className="portfolio home-page"><header className="intro"><img className="avatar" src={content.avatar} alt={content.avatarAlt}/><h1>{content.name}</h1><p className="role">{content.role}</p><p className="bio">{content.intro}</p><nav className="contacts" aria-label="Контакты"><ContactLink value={content.links.cv}>CV</ContactLink><span className="separator" aria-hidden="true">/</span><ContactLink value={content.links.email} email>EMAIL</ContactLink><span className="separator" aria-hidden="true">/</span><ContactLink value={content.links.telegram}>TELEGRAM</ContactLink></nav></header><div className="experiences">{content.companies.map(company => <Experience key={company.name} company={company}/>)}</div><ContactFooter/><StrategyDeck/></main>;
}
function CasePage({ project }: { project: Project }) {
  const next = homeProjects.find(item => item.slug === project.next);
  return <main className={`portfolio case-page case-${project.slug}`}>
    <a className="back-link" href={import.meta.env.BASE_URL}>‹ НАЗАД</a>
    <header className="case-header"><h1><img className={project.logoWide ? 'wide-logo' : ''} src={project.logo} alt=""/><span>{project.caseTitle ?? project.title}</span></h1><p className="case-intro">{project.caseIntro ?? project.description}</p>
      {project.metrics && <dl className="metrics">{project.metrics.map(metric => <div key={metric.value}><dt>{metric.value}</dt><dd><span className="metric-desktop">{metric.label}</span><span className="metric-tablet">{metric.tabletLabel || metric.label}</span><span className="metric-mobile">{metric.mobileLabel || metric.label}</span></dd></div>)}</dl>}
    </header>
    <div className="case-content"><ProjectMedia media={project}/>
      {project.blocks.map((block,index) => block.type === 'comparison' ? <CaseComparison key={index} items={block.items}/> : block.type === 'images' ? <div className="case-gallery" key={index}>{block.items.map(media => <ProjectMedia key={media.image} media={media}/>)}</div> : <div className="case-notes" key={index}>{block.items.map(item => <section className="case-note" key={`${item.number}-${item.title}`}><span className="note-number" aria-hidden="true">{item.number}</span><div><h2>{item.title}</h2>{item.subtitle && <h3>{item.subtitle}</h3>}<p>{item.text}</p></div></section>)}</div>)}
    </div>
    {next && <section className="next-project" aria-labelledby="next-title"><h2 id="next-title">СЛЕДУЮЩИЙ ПРОЕКТ</h2><ProjectCard project={next} next/></section>}
    <ContactFooter/>
  </main>;
}
function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const path = pathname.replace(/\/+$/, '');
  const selected = projects.find(project => path === `/cases/${project.slug}`);
  useEffect(() => {
    document.title = selected ? `${selected.caseTitle ?? selected.title} — ${content.name}` : `${content.name} — ${content.role}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', selected?.caseIntro || selected?.description || content.intro);
    trackPageView();
  }, [selected, pathname]);
  useEffect(() => {
    const root = document.getElementById('root')!;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animation: Animation | undefined;
    let revision = 0;
    let navigating = false;
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const fade = async (from: number, to: number, duration: number) => {
      animation?.cancel();
      if (reducedMotion.matches || typeof root.animate !== 'function') return;
      animation = root.animate([{ opacity: from }, { opacity: to }], { duration, easing: 'ease-out', fill: 'forwards' });
      await animation.finished.catch(() => {});
    };
    void fade(0, 1, 180);
    const navigate = async (url: URL, push: boolean) => {
      const current = ++revision;
      navigating = true;
      await fade(Number(getComputedStyle(root).opacity), 0, 140);
      if (current !== revision) return;
      if (push) window.history.pushState(null, '', url);
      flushSync(() => setPathname(url.pathname));
      window.scrollTo({ top: 0, behavior: 'instant' });
      const main = root.querySelector('main');
      main?.setAttribute('tabindex', '-1');
      main?.focus({ preventScroll: true });
      await fade(0, 1, 180);
      if (current === revision) navigating = false;
    };
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href);
      const targetPath = url.pathname.replace(/\/+$/, '');
      const knownRoute = targetPath === '' || projects.some(project => targetPath === `/cases/${project.slug}`);
      if (url.origin !== location.origin || url.hash || url.search || !knownRoute) return;
      event.preventDefault();
      if (!navigating && url.pathname !== location.pathname) void navigate(url, true);
    };
    const onPopState = () => { void navigate(new URL(location.href), false); };
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPopState);
    return () => {
      revision++;
      history.scrollRestoration = previousRestoration;
      animation?.cancel();
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);
  return selected ? <CasePage project={selected}/> : path === '' ? <HomePage/> : <main className="portfolio"><h1>Страница не найдена</h1><a className="project-link" href="/">‹ НА ГЛАВНУЮ</a></main>;
}
createRoot(document.getElementById('root')!).render(<App/>);