import { lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  APP_COPY,
  FEATURES,
  HERO_METRICS,
  HOME_FLOW_STEPS,
  CATEGORIES,
} from '@shared/siteContent';
import { useLanguage } from '../context/LanguageContext';

const HeroScene = lazy(() => import('../components/HeroScene'));
const ScalesCanvas = lazy(() => import('../components/ScalesCanvas'));

export default function Home() {
  const navigate = useNavigate();
  const { copy } = useLanguage();

  return (
    <div className="page-stack">
      <section className="hero-surface">
        <div className="hero-copy">
          <p className="eyebrow">{copy.home.heroEyebrow || APP_COPY.homeEyebrow}</p>
          <h1>{copy.home.heroTitle || APP_COPY.homeTitle}</h1>
          <p>{copy.home.heroDescription || APP_COPY.homeDescription}</p>
          <div className="hero-actions">
            <button className="primary-action" type="button" onClick={() => navigate('/signin')}>
              {copy.home.primaryCta || APP_COPY.homePrimaryCta}
            </button>
            <Link className="secondary-action" to="/features">
              {copy.home.secondaryCta || APP_COPY.homeSecondaryCta}
            </Link>
          </div>
          <div className="metric-strip">
            {HERO_METRICS.map((metric) => (
              <div className="metric-card" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <Suspense fallback={<div className="scene-canvas scene-canvas--fallback" />}>
            <HeroScene />
          </Suspense>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Flow</p>
          <h2>Use Google-style progression instead of one overloaded screen.</h2>
        </div>
        <div className="feature-grid">
          {HOME_FLOW_STEPS.map((step) => (
            <article className="feature-card" key={step.id}>
              <span className="feature-index">{step.eyebrow}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Feature Routes</p>
            <h2>Every important capability now has its own page.</h2>
          </div>
          <Link className="text-link" to="/features">
            View all features
          </Link>
        </div>
        <div className="feature-grid">
          {FEATURES.map((feature) => (
            <Link className="feature-card feature-card--interactive" key={feature.id} to={`/features/${feature.id}`}>
              <span className="feature-index">Feature</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="canvas-band">
        <div className="canvas-band__copy">
          <p className="eyebrow">Source-aware guidance</p>
          <h2>Research and action now live in the same product journey.</h2>
          <p>
            Use the assistant for plain-language next steps, then deepen your
            confidence with connected research and official court pathways.
          </p>
          <div className="hero-actions">
            <Link className="secondary-action" to="/resources">
              Browse resources
            </Link>
          </div>
        </div>
        <div className="canvas-band__visual">
          <Suspense fallback={<div className="scales-canvas scales-canvas--fallback" />}>
            <ScalesCanvas />
          </Suspense>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Category Routes</p>
            <h2>Choose a legal area before you enter the workspace.</h2>
          </div>
          <Link className="text-link" to="/categories">
            View all categories
          </Link>
        </div>
        <div className="feature-grid">
          {CATEGORIES.map((category) => (
            <Link className="feature-card feature-card--interactive" key={category.id} to={`/categories/${category.id}`}>
              <span className="feature-index">Category</span>
              <h3>{category.title}</h3>
              <p>{category.shortDescription}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

