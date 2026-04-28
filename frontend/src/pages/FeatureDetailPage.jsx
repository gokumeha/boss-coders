import { Link, Navigate, useParams } from 'react-router-dom';

import { FEATURE_MAP } from '@shared/siteContent';

export default function FeatureDetailPage() {
  const { featureId } = useParams();
  const feature = FEATURE_MAP[featureId];

  if (featureId === 'google-sign-in') {
    return <Navigate replace to="/signin" />;
  }

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
      <section className="page-hero page-hero--structured scroll-reveal-target">
        <p className="eyebrow">Feature detail</p>
        <h1>{feature.title}</h1>
        <p>{feature.tagline}</p>
      </section>

      <section className="split-panel split-panel--balanced scroll-reveal-target">
        <article className="glass-panel glass-panel--document category-article scroll-reveal-target">
          <div className="section-heading section-heading--compact">
            <p className="eyebrow">Feature Overview</p>
            <h2>{feature.spotlightTitle || 'Why this matters'}</h2>
          </div>
          <p>{feature.description}</p>
          <p>{feature.details}</p>
          {(feature.spotlightParagraphs || []).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>

        <article className="glass-panel glass-panel--document scroll-reveal-target">
          <h2>Key outcomes</h2>
          <ul className="plain-list">
            {feature.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <div className="panel-actions">
            <Link className="primary-action" to="/assistant">
              Open AI Assistant
            </Link>
            <Link className="secondary-action" to="/resources">
              Open resources
            </Link>
          </div>
        </article>
      </section>

      {(feature.detailSections || []).length ? (
        <section className="resource-grid scroll-reveal-target">
          {feature.detailSections.map((section) => (
            <article className="glass-panel glass-panel--document" key={section.title}>
              <h2>{section.title}</h2>
              <ul className="plain-list">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}
