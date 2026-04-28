import { CATEGORIES } from '@shared/siteContent';

export default function Categories({ onSelectCategory }) {
  return (
    <section id="categories">
      <div className="container">
        <div className="section-tag reveal">Legal Categories</div>
        <h2 className="section-title reveal">
          What Issue
          <br />
          Can We Help With?
        </h2>
        <p className="section-sub reveal">
          Six major areas of Indian law, made accessible for everyone.
        </p>

        <div className="cats-grid">
          {CATEGORIES.map((category) => (
            <button
              className="big-cat reveal"
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
            >
              <div className="big-cat-arrow">→</div>
              <span className="big-cat-icon">{category.icon}</span>
              <div className="big-cat-title">{category.title}</div>
              <p className="big-cat-desc">{category.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

