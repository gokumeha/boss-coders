import { Link } from 'react-router-dom';

import { FEATURES } from '@shared/siteContent';

export default function FeaturesPage() {
  return (
    <div className="page-stack page-stack--narrow">
      <section className="page-hero page-hero--structured">
        <p className="eyebrow">Features</p>
        <h1>Explore the product by capability, not by scrolling forever.</h1>
        <p>
          Each capability is presented as a clear legal-tech workflow layer so the
          platform remains understandable as it grows.
        </p>
      </section>

      <section className="feature-grid">
        {FEATURES.map((feature) => (
          <Link className="feature-card feature-card--interactive feature-card--legal" key={feature.id} to={`/features/${feature.id}`}>
            <span className="feature-icon-mark">{feature.icon}</span>
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
