import { lazy, Suspense } from 'react';

const ScalesCanvas = lazy(() => import('./ScalesCanvas'));

export default function AiShowcase({ onPrimaryClick }) {
  return (
    <section className="canvas3d-section">
      <Suspense fallback={<div className="scales-canvas scales-canvas--fallback" />}>
        <ScalesCanvas />
      </Suspense>
      <div className="canvas3d-overlay reveal">
        <div className="section-tag section-tag--light">AI + Law</div>
        <h2 className="section-title section-title--light">
          Justice, Balanced
          <br />
          by Intelligence
        </h2>
        <p className="section-sub section-sub--light">
          The backend is already structured for future AI providers, prompt
          orchestration, and external legal data sources without touching the UI
          layer.
        </p>
        <button
          className="btn-hero-primary btn-hero-primary--compact"
          type="button"
          onClick={onPrimaryClick}
        >
          Try It Now
        </button>
      </div>
    </section>
  );
}
