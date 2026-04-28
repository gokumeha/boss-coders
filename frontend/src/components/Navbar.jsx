import { NavLink, Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PRIMARY_NAV_ITEMS, SUPPORTED_LANGUAGES } from '@shared/siteContent';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();
  const { language, setLanguage, copy } = useLanguage();

  const labelMap = {
    '/': copy.nav.home,
    '/features': copy.nav.features,
    '/categories': copy.nav.categories,
    '/resources': copy.nav.resources,
  };

  return (
    <header className="site-header">
      <Link className="brand-mark" to="/">
        <span className="brand-icon">NS</span>
        <span className="brand-copy">
          <strong className="brand-title">
            Nyaya<span className="brand-accent">Saathi</span>
          </strong>
          <span className="brand-subtitle">Legal-tech guidance platform</span>
        </span>
      </Link>

      <nav className="main-nav">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link--active' : ''}`
            }
            to={item.to}
          >
            {labelMap[item.to] || item.label}
          </NavLink>
        ))}
      </nav>

      <div className="nav-controls">
        <span className="nav-trust-pill">Protected workspace</span>
        <select
          className="language-select"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        >
          {SUPPORTED_LANGUAGES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {user ? (
          <>
            <div className="nav-user" role="status">
              <span className="nav-user__label">Signed in</span>
              <strong>{user.displayName?.split(' ')[0] || user.email}</strong>
            </div>
            <button className="nav-auth" type="button" onClick={signOutUser}>
              {copy.nav.signOut}
            </button>
          </>
        ) : (
          <button className="nav-auth nav-auth--google" type="button" onClick={() => navigate('/signin')}>
            <span className="nav-auth__icon" aria-hidden="true">
              G
            </span>
            <span>{copy.nav.signIn}</span>
          </button>
        )}
      </div>
    </header>
  );
}
