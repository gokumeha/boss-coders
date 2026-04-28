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
      <section className="page-hero">
        <p className="eyebrow">Category detail</p>
        <h1>{category.title}</h1>
        <p>{category.description}</p>
      </section>

      <section className="split-panel">
        <article className="glass-panel">
          <h2>Typical next steps</h2>
          <ul className="plain-list">
            {category.nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </article>

        <article className="glass-panel">
          <h2>Continue the journey</h2>
          <p>
            Open the assistant with this category in mind, then validate your
            direction with connected resources if needed.
          </p>
          <div className="panel-actions">
            <Link className="primary-action" to="/assistant">
              Open assistant
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

