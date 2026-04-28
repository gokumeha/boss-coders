import { Link } from 'react-router-dom';

import { CATEGORIES } from '@shared/siteContent';
import { useLanguage } from '../context/LanguageContext';

export default function CategoriesPage() {
  const { copy } = useLanguage();

  return (
    <div className="page-stack page-stack--narrow">
      <section className="page-hero page-hero--structured scroll-reveal-target">
        <p className="eyebrow">{copy.pages.categoriesEyebrow}</p>
        <h1>{copy.pages.categoriesTitle}</h1>
        <p>{copy.pages.categoriesDescription}</p>
      </section>

      <section className="feature-grid scroll-reveal-target">
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
