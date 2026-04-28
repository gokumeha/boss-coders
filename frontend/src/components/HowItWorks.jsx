import { HOW_IT_WORKS_STEPS } from '@shared/siteContent';

export default function HowItWorks() {
  return (
    <section id="how">
      <div className="container">
        <div className="section-tag reveal">How It Works</div>
        <h2 className="section-title reveal">Four Steps to Justice</h2>
        <p className="section-sub reveal">
          No lawyer needed. No fees. Just describe your problem and let AI guide
          you to your rights.
        </p>

        <div className="steps-flow">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div className="step-card reveal" key={step.number}>
              <div className="step-icon-wrap">
                <div className={`step-icon-inner ${step.iconClassName}`}>{step.icon}</div>
                <div className="step-num">{step.number}</div>
              </div>
              <div className="step-title">{step.title}</div>
              <p className="step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

