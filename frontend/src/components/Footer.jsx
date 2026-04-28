import { Link } from 'react-router-dom';

import { FOOTER_SECTIONS } from '@shared/siteContent';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="brand-mark brand-mark--footer">
            <span className="brand-icon">NS</span>
            <span>
              Nyaya<span className="brand-accent">Saathi</span>
            </span>
          </div>
          <p>
            Guided legal navigation, structured intake, and research-aware next
            steps for people who need clarity before they need a lawyer.
          </p>
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
        <span>General legal information only, not formal legal advice.</span>
        <span>Built for scalable legal access.</span>
      </div>
    </footer>
  );
}

