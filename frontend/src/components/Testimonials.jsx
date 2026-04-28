import { TESTIMONIALS } from '@shared/siteContent';

export default function Testimonials() {
  return (
    <section id="testimonials">
      <div className="container">
        <div className="section-tag reveal section-tag--light">Stories of Impact</div>
        <h2 className="section-title reveal section-title--light">
          Real People,
          <br />
          Real Relief
        </h2>
        <p className="section-sub reveal section-sub--light">
          Stories from people who found their footing through clearer legal guidance.
        </p>

        <div className="testi-grid">
          {TESTIMONIALS.map((story) => (
            <div className="testi-card reveal" key={story.name}>
              <div className="testi-quote">&quot;</div>
              <p className="testi-text">{story.quote}</p>
              <div className="testi-author">
                <div className="testi-avatar">{story.avatar}</div>
                <div>
                  <div className="testi-name">{story.name}</div>
                  <div className="testi-loc">{story.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

