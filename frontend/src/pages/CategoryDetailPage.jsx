import { Link, useParams } from 'react-router-dom';

import { LEGAL_CATEGORY_MAP } from '@shared/siteContent';

export default function CategoryDetailPage() {
  const { categoryId } = useParams();
  const category = LEGAL_CATEGORY_MAP[categoryId];

  if (!category) {
    return (
      <div className="page-stack page-stack--narrow">
        <section className="page-hero">
          <h1>Category not found</h1>
          <Link className="secondary-action" to="/categories">
            Back to categories
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack page-stack--narrow">
      <section className="page-hero page-hero--structured">
        <p className="eyebrow">Category detail</p>
        <h1>{category.title}</h1>
        <p>{category.description}</p>
        <div className="hero-actions">
          {category.focusAreas.map((area) => (
            <span className="trust-chip" key={area}>
              {area}
            </span>
          ))}
        </div>
      </section>

      <section className="split-panel split-panel--balanced">
        <article className="glass-panel glass-panel--document category-article">
          <div className="section-heading section-heading--compact">
            <p className="eyebrow">Editorial Brief</p>
            <h2>How this category usually unfolds</h2>
          </div>

          {category.articleParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>

        <aside className="glass-panel glass-panel--document category-context-card">
          <span className="category-context-card__mark">
            {category.id.slice(0, 4).toUpperCase()}
          </span>
          <h2>What to preserve early</h2>
          <ul className="plain-list">
            {category.evidenceChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="section-block section-block--tight">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Relevant Law</p>
            <h2>Rules and statutes that usually shape the dispute</h2>
          </div>
        </div>

        <div className="resource-grid">
          {category.lawNotes.map((law) => (
            <article className="info-surface info-surface--detail" key={law.title}>
              <strong>{law.title}</strong>
              <p>{law.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block section-block--tight">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Indian Cases</p>
            <h2>Landmark decisions that still shape this category</h2>
          </div>
        </div>

        <div className="feature-grid">
          {category.famousCases.map((caseItem) => (
            <article className="feature-card feature-card--legal" key={caseItem.name}>
              <span className="feature-index">{caseItem.year}</span>
              <h3>{caseItem.name}</h3>
              <p>{caseItem.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block section-block--tight">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Recent Reporting</p>
            <h2>Selected India-specific developments tied to this category</h2>
            <p className="section-note">Selected references current through April 28, 2026.</p>
          </div>
        </div>

        <div className="resource-grid">
          {category.newsItems.map((item) => (
            <article className="glass-panel glass-panel--document news-card" key={item.title}>
              <div className="news-card__meta">
                <span>{item.source}</span>
                <span>{item.publishedAt}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <a
                className="text-link"
                href={item.url}
                rel="noreferrer"
                target="_blank"
              >
                Read article
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="split-panel">
        <article className="glass-panel glass-panel--document">
          <h2>Typical next steps</h2>
          <ul className="plain-list">
            {category.nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </article>

        <article className="glass-panel glass-panel--document">
          <h2>Continue the journey</h2>
          <p>
            Open the AI assistant for this legal category, then validate your
            direction with connected resources if needed.
          </p>
          <div className="panel-actions">
            <Link className="primary-action" to="/assistant">
              AI Assistant
            </Link>
            <Link className="secondary-action" to="/resources">
              Browse research
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
