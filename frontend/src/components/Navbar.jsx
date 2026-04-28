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
    '/assistant': copy.nav.assistant,
    '/resources': copy.nav.resources,
  };

  return (
    <header className="site-header">
      <Link className="brand-mark" to="/">
        <span className="brand-icon">NS</span>
        <span>
          Nyaya<span className="brand-accent">Saathi</span>
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
            <button className="nav-user" type="button" onClick={() => navigate('/assistant')}>
              {user.displayName?.split(' ')[0] || user.email}
            </button>
            <button className="nav-auth" type="button" onClick={signOutUser}>
              {copy.nav.signOut}
            </button>
          </>
        ) : (
          <button className="nav-auth" type="button" onClick={() => navigate('/signin')}>
            {copy.nav.signIn}
          </button>
        )}
      </div>
    </header>
  );
}

