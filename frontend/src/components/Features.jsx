import { FEATURES } from '@shared/siteContent';

export default function Features() {
  return (
    <section id="features">
      <div className="container">
        <div className="section-tag reveal">Features</div>
        <h2 className="section-title reveal">
          Everything You Need
          <br />
          to Fight for Your Rights
        </h2>
        <p className="section-sub reveal">
          Designed for first-generation litigants and anyone who has never set
          foot in a courtroom.
        </p>

        <div className="features-grid">
          {FEATURES.map((feature) => (
            <div className="feat-card reveal" key={feature.title}>
              <span className="feat-icon">{feature.icon}</span>
              <div className="feat-title">{feature.title}</div>
              <p className="feat-desc">{feature.description}</p>
              <span className="feat-tag">{feature.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
