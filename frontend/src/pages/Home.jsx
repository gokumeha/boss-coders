import { lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  APP_COPY,
  CATEGORIES,
  FEATURES,
  HERO_METRICS,
  HOME_READING,
  RESOURCE_SOURCES,
  getFeatureDestination,
} from '@shared/siteContent';
import { useLanguage } from '../context/LanguageContext';

const HeroScene = lazy(() => import('../components/HeroScene'));

const QUICK_ACTIONS = [
  {
    id: 'assistant',
    mark: 'AI',
    title: 'Open AI Assistant',
    description: 'Ask a legal question in plain language and get structured next steps.',
    to: '/assistant',
  },
  {
    id: 'categories',
    mark: 'CASE',
    title: 'Browse Case Categories',
    description: 'Start from the right legal track before you draft or escalate anything.',
    to: '/categories',
  },
  {
    id: 'resources',
    mark: 'LAW',
    title: 'View Legal Sources',
    description: 'Check connected research and official access pathways before acting.',
    to: '/resources',
  },
];

const TRUST_SIGNALS = [
  {
    mark: 'AUTH',
    title: 'Protected access',
    description: 'Core legal workflows stay behind verified Google sign-in.',
  },
  {
    mark: 'DOC',
    title: 'Structured guidance',
    description: 'Responses are organized like a legal brief, not a chat dump.',
  },
  {
    mark: 'COURT',
    title: 'Public-path follow-up',
    description: 'Research and court access are tied to official public pathways.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { copy } = useLanguage();

  const quickActions = [
    {
      id: 'assistant',
      mark: 'AI',
      title: 'Open AI Assistant',
      description: 'Ask a legal question in plain language and get structured next steps.',
      to: '/assistant',
    },
    {
      id: 'categories',
      mark: 'CASE',
      title: 'Browse Case Categories',
      description: 'Start from the right legal track before you draft or escalate anything.',
      to: '/categories',
    },
    {
      id: 'resources',
      mark: 'LAW',
      title: 'View Legal Sources',
      description: 'Check connected research and official access pathways before acting.',
      to: '/resources',
    },
  ];

  return (
    <div className="page-stack">
      <section className="hero-surface hero-surface--refined scroll-reveal-target">
        <div className="hero-copy">
          <p className="eyebrow">{copy.home.heroEyebrow || APP_COPY.homeEyebrow}</p>
          <h1>{copy.home.heroTitle || APP_COPY.homeTitle}</h1>
          <p>{copy.home.heroDescription || APP_COPY.homeDescription}</p>

          <div className="hero-actions">
            <button className="primary-action" onClick={() => navigate('/assistant')} type="button">
              {copy.home.primaryCta || APP_COPY.homePrimaryCta}
            </button>
            <Link className="secondary-action" to="/resources">
              {copy.home.secondaryCta || APP_COPY.homeSecondaryCta}
            </Link>
          </div>

          <div className="metric-strip metric-strip--compact">
            {HERO_METRICS.map((metric) => (
              <div className="metric-card" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual hero-visual--refined">
          <Suspense fallback={<div className="scene-canvas scene-canvas--fallback" />}>
            <HeroScene />
          </Suspense>
        </div>
      </section>

      <section className="trust-grid scroll-reveal-target">
        {TRUST_SIGNALS.map((signal) => (
          <article className="trust-card" key={signal.title}>
            <span className="trust-card__mark">{signal.mark}</span>
            <div>
              <h3>{signal.title}</h3>
              <p>{signal.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="document-panel hero-brief-panel scroll-reveal-target">
            <div className="document-panel__head">
              <span className="document-kicker">Case Intake Brief</span>
              <span className="document-mark">DOC</span>
            </div>
        <h2>{copy.home.heroBriefTitle}</h2>
        <ul className="plain-list">
          {copy.home.heroBriefPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="section-block section-block--tight scroll-reveal-target">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">{copy.home.keyActionsEyebrow}</p>
            <h2>{copy.home.keyActionsTitle}</h2>
          </div>
        </div>

        <div className="feature-grid feature-grid--featured">
          {quickActions.map((action) => (
            <Link className="feature-card feature-card--interactive feature-card--legal" key={action.id} to={action.to}>
              <span className="feature-icon-mark">{action.mark}</span>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="split-panel split-panel--balanced scroll-reveal-target">
        <article className="glass-panel scroll-reveal-target">
          <div className="section-heading section-heading--compact">
            <p className="eyebrow">{copy.home.commonCategoriesEyebrow}</p>
            <h2>{copy.home.commonCategoriesTitle}</h2>
          </div>

          <div className="mini-card-grid">
            {CATEGORIES.slice(0, 4).map((category) => (
              <Link className="mini-card mini-card--link mini-card--document" key={category.id} to={`/categories/${category.id}`}>
                <strong>{category.title}</strong>
                <span>{category.shortDescription}</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="glass-panel scroll-reveal-target">
          <div className="section-heading section-heading--compact">
            <p className="eyebrow">{copy.home.sourceBackedEyebrow}</p>
            <h2>{copy.home.sourceBackedTitle}</h2>
          </div>

          <div className="mini-card-grid">
            {RESOURCE_SOURCES.map((resource) => (
              <Link className="mini-card mini-card--link mini-card--document" key={resource.id} to="/resources">
                <strong>{resource.title}</strong>
                <span>{resource.description}</span>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="section-block section-block--tight scroll-reveal-target">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">{copy.home.builtForClarityEyebrow}</p>
            <h2>{copy.home.builtForClarityTitle}</h2>
          </div>
          <Link className="text-link" to="/features">
            {copy.home.viewAllFeatures}
          </Link>
        </div>

        <div className="feature-grid feature-grid--featured">
          {FEATURES.slice(0, 3).map((feature) => (
            <Link className="feature-card feature-card--interactive" key={feature.id} to={getFeatureDestination(feature)}>
              <span className="feature-index">Feature</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-block section-block--tight scroll-reveal-target">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">{copy.home.furtherReadingEyebrow}</p>
            <h2>{copy.home.furtherReadingTitle}</h2>
            <p className="section-note">
              {copy.home.furtherReadingNote}
            </p>
          </div>
        </div>

        <div className="resource-grid home-reading-grid">
          {HOME_READING.map((item) => (
            <a
              className="glass-panel glass-panel--document home-reading-card"
              href={item.url}
              key={item.id}
              rel="noreferrer"
              target="_blank"
            >
              <div className={`home-reading-card__media home-reading-card__media--${item.visual}`}>
                <span className="home-reading-card__badge">{item.source}</span>
                <span className="home-reading-card__stamp">{item.visual}</span>
              </div>
              <div className="home-reading-card__body">
                <div className="news-card__meta">
                  <span>{item.source}</span>
                  <span>{item.publishedAt}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <span className="text-link">Read article</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
