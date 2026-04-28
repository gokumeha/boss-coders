import { Link } from 'react-router-dom';

import { FEATURES, getFeatureDestination } from '@shared/siteContent';
import { useLanguage } from '../context/LanguageContext';

export default function FeaturesPage() {
  const { copy } = useLanguage();

  return (
    <div className="page-stack page-stack--narrow">
      <section className="page-hero page-hero--structured scroll-reveal-target">
        <p className="eyebrow">{copy.pages.featuresEyebrow}</p>
        <h1>{copy.pages.featuresTitle}</h1>
        <p>{copy.pages.featuresDescription}</p>
      </section>

      <section className="feature-grid scroll-reveal-target">
        {FEATURES.map((feature) => (
          <Link className="feature-card feature-card--interactive feature-card--legal" key={feature.id} to={getFeatureDestination(feature)}>
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
