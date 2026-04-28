import { FOOTER_LINKS } from '@shared/siteContent';

function FooterColumn({ title, items }) {
  return (
    <div className="footer-col">
      <h4>{title}</h4>
      {items.map((item) => (
        <a href="#app" key={item}>
          {item}
        </a>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo footer-logo">
              <div className="nav-logo-icon">⚖</div>
              <div className="nav-logo-text footer-logo-text">
                Nyaya<span>Saathi</span>
              </div>
            </div>
            <p>
              Free AI-powered legal aid for every Indian. Know your rights, draft
              your complaint, and reach the right authority without legal jargon.
            </p>
            <p className="footer-note">
              Built for social impact with an architecture that is ready for AI APIs.
            </p>
          </div>

          <FooterColumn title="Legal Areas" items={FOOTER_LINKS.legalAreas} />
          <FooterColumn title="Languages" items={FOOTER_LINKS.languages} />
          <FooterColumn title="Resources" items={FOOTER_LINKS.resources} />
        </div>

        <div className="footer-bottom">
          <span>© 2026 NyayaSaathi. General legal information only.</span>
          <span>Made for accessible justice.</span>
        </div>
      </div>
    </footer>
  );
}

