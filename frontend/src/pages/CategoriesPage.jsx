import { Link } from 'react-router-dom';

import { CATEGORIES } from '@shared/siteContent';

export default function CategoriesPage() {
  return (
    <div className="page-stack page-stack--narrow">
      <section className="page-hero page-hero--structured">
        <p className="eyebrow">Categories</p>
        <h1>Pick the legal path before you start writing.</h1>
        <p>
          Each category page gives context, common next steps, and a clearer
          starting point before you ask the legal guide.
        </p>
      </section>

      <section className="feature-grid">
        {CATEGORIES.map((category) => (
          <Link className="feature-card feature-card--interactive feature-card--legal" key={category.id} to={`/categories/${category.id}`}>
            <span className="feature-icon-mark">{category.id.slice(0, 4).toUpperCase()}</span>
            <h2>{category.title}</h2>
            <p>{category.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
