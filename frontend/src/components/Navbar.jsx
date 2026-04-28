import { NAV_LINKS } from '@shared/siteContent';

export default function Navbar({ onPrimaryClick, scrollProgress }) {
  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <div
          className="scroll-progress__bar"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
        />
      </div>
      <nav className="site-nav" id="navbar">
        <div className="nav-logo">
          <div className="nav-logo-icon">⚖</div>
          <div className="nav-logo-text">
            Nyaya<span>Saathi</span>
          </div>
        </div>

        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <button className="nav-cta" type="button" onClick={onPrimaryClick}>
          Get Free Help
        </button>
      </nav>
    </>
  );
}

