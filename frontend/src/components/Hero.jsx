import { lazy, Suspense } from 'react';

import { APP_COPY, HERO_STATS } from '@shared/siteContent';

import HeroParticles from './HeroParticles';

const HeroScene = lazy(() => import('./HeroScene'));

export default function Hero({ onPrimaryClick, onSecondaryClick }) {
  return (
    <section className="hero-section" id="hero">
      <HeroParticles />

      <div className="hero-content">
        <div className="hero-badge">{APP_COPY.heroBadge}</div>
        <h1 className="hero-title">
          {APP_COPY.heroTitleLineOne}
          <br />
          <em>{APP_COPY.heroTitleLineTwo}</em>
          <br />
          {APP_COPY.heroTitleLineThree}
        </h1>
        <p className="hero-description">{APP_COPY.heroDescription}</p>

        <div className="hero-actions">
          <button className="btn-hero-primary" type="button" onClick={onPrimaryClick}>
            {APP_COPY.heroPrimaryCta}
          </button>
          <button className="btn-hero-ghost" type="button" onClick={onSecondaryClick}>
            {APP_COPY.heroSecondaryCta}
          </button>
        </div>

        <div className="hero-stats">
          {HERO_STATS.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <div className="stat-num">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-3d-side">
        <Suspense fallback={<div className="scene-canvas scene-canvas--fallback" />}>
          <HeroScene />
        </Suspense>
      </div>

      <div className="hero-scroll-hint">
        <div className="scroll-line" />
        {APP_COPY.heroScrollHint}
      </div>
    </section>
  );
}
