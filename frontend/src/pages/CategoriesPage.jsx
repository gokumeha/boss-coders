import { Link } from 'react-router-dom';

import { CATEGORIES } from '@shared/siteContent';

export default function CategoriesPage() {
  return (
    <div className="page-stack page-stack--narrow">
      <section className="page-hero">
        <p className="eyebrow">Categories</p>
        <h1>Pick the legal path before you start writing.</h1>
        <p>
          Each category page gives context, common next steps, and a cleaner
          on-ramp into the assistant workspace.
        </p>
      </section>

      <section className="feature-grid">
        {CATEGORIES.map((category) => (
          <Link className="feature-card feature-card--interactive" key={category.id} to={`/categories/${category.id}`}>
            <span className="feature-index">Category</span>
            <h2>{category.title}</h2>
            <p>{category.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

