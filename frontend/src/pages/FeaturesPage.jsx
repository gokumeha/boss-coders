import { Link } from 'react-router-dom';

import { FEATURES } from '@shared/siteContent';

export default function FeaturesPage() {
  return (
    <div className="page-stack page-stack--narrow">
      <section className="page-hero">
        <p className="eyebrow">Features</p>
        <h1>Explore the product by capability, not by scrolling forever.</h1>
        <p>
          Each feature now lives in a route-aware page structure so the app can
          grow without turning the main experience into a dumping ground.
        </p>
      </section>

      <section className="feature-grid">
        {FEATURES.map((feature) => (
          <Link className="feature-card feature-card--interactive" key={feature.id} to={`/features/${feature.id}`}>
            <span className="feature-index">Feature</span>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
            <ul className="plain-list">
              {feature.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </Link>
        ))}
      </section>
    </div>
  );
}

