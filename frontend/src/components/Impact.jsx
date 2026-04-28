import { IMPACT_STATS } from '@shared/siteContent';

export default function Impact() {
  return (
    <section id="impact">
      <div className="container">
        <div className="section-tag reveal">Social Impact</div>
        <h2 className="section-title reveal">
          The Scale of the Problem
          <br />
          We&apos;re Solving
        </h2>
        <p className="section-sub reveal">
          India&apos;s justice gap is massive. NyayaSaathi is designed to reduce
          confusion, cost, and delay at the first point of need.
        </p>

        <div className="impact-grid">
          {IMPACT_STATS.map((stat) => (
            <div className="impact-card reveal" key={stat.label}>
              <div className="impact-num">{stat.value}</div>
              <div className="impact-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

