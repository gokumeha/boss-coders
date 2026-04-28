import { Link } from 'react-router-dom';

import { FOOTER_SECTIONS } from '@shared/siteContent';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="brand-mark brand-mark--footer">
            <span className="brand-icon">NS</span>
            <span className="brand-copy">
              <strong className="brand-title">
                Nyaya<span className="brand-accent">Saathi</span>
              </strong>
              <span className="brand-subtitle">Legal-tech guidance platform</span>
            </span>
          </div>
          <p>
            Guided legal navigation, structured intake, and research-aware next
            steps for people who need clarity before they need formal counsel.
          </p>
          <div className="footer-trust-row">
            <span className="trust-chip">Protected sign-in</span>
            <span className="trust-chip">Public source pathways</span>
            <span className="trust-chip">Structured case flow</span>
          </div>
        </div>

        {FOOTER_SECTIONS.map((section) => (
          <div className="footer-column" key={section.title}>
            <h4>{section.title}</h4>
            {section.links.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <span>General legal information only. Not a substitute for formal legal advice.</span>
        <span>Designed for trust, clarity, and scalable legal access.</span>
      </div>
    </footer>
  );
}
