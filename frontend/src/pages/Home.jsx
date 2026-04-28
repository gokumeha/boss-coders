import { lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  APP_COPY,
  CATEGORIES,
  FEATURES,
  HERO_METRICS,
  RESOURCE_SOURCES,
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

  return (
    <div className="page-stack">
      <section className="hero-surface hero-surface--refined">
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

          <div className="hero-note-card">
            <div className="document-panel__head">
              <span className="document-kicker">Case Intake Brief</span>
              <span className="document-mark">DOC</span>
            </div>
            <h2>Start with a documented legal question.</h2>
            <ul className="plain-list">
              <li>State who is involved and what happened</li>
              <li>Capture timelines, proof, and the help needed</li>
              <li>Move from AI guidance to public legal pathways</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="trust-grid">
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

      <section className="section-block section-block--tight">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Key Actions</p>
            <h2>Clear routes for the actions people take most.</h2>
          </div>
        </div>

        <div className="feature-grid feature-grid--featured">
          {QUICK_ACTIONS.map((action) => (
            <Link className="feature-card feature-card--interactive feature-card--legal" key={action.id} to={action.to}>
              <span className="feature-icon-mark">{action.mark}</span>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="split-panel split-panel--balanced">
        <article className="glass-panel">
          <div className="section-heading section-heading--compact">
            <p className="eyebrow">Common Categories</p>
            <h2>Start with the closest legal track.</h2>
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

        <article className="glass-panel">
          <div className="section-heading section-heading--compact">
            <p className="eyebrow">Source-Backed</p>
            <h2>Answers should lead somewhere reliable.</h2>
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

      <section className="section-block section-block--tight">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Built For Clarity</p>
            <h2>The key things you need, without unnecessary noise.</h2>
          </div>
          <Link className="text-link" to="/features">
            View all features
          </Link>
        </div>

        <div className="feature-grid feature-grid--featured">
          {FEATURES.slice(0, 3).map((feature) => (
            <Link className="feature-card feature-card--interactive" key={feature.id} to={`/features/${feature.id}`}>
              <span className="feature-index">Feature</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
