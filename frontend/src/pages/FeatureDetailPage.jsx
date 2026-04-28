import { Link, useParams } from 'react-router-dom';

import { FEATURE_MAP } from '@shared/siteContent';

export default function FeatureDetailPage() {
  const { featureId } = useParams();
  const feature = FEATURE_MAP[featureId];

  if (!feature) {
    return (
      <div className="page-stack page-stack--narrow">
        <section className="page-hero">
          <h1>Feature not found</h1>
          <Link className="secondary-action" to="/features">
            Back to features
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack page-stack--narrow">
      <section className="page-hero">
        <p className="eyebrow">Feature detail</p>
        <h1>{feature.title}</h1>
        <p>{feature.tagline}</p>
      </section>

      <section className="split-panel">
        <article className="glass-panel">
          <h2>Why this matters</h2>
          <p>{feature.description}</p>
          <p>{feature.details}</p>
        </article>
        <article className="glass-panel">
          <h2>What changed</h2>
          <ul className="plain-list">
            {feature.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <div className="panel-actions">
            <Link className="primary-action" to="/assistant">
              Open assistant
            </Link>
            <Link className="secondary-action" to="/resources">
              Open resources
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}

