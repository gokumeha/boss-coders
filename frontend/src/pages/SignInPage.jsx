import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { copy } = useLanguage();
  const { signInWithGoogle, error, isFirebaseConfigured, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const redirectTarget = useMemo(() => {
    const candidate = location.state?.from;

    if (typeof candidate === 'string' && candidate.startsWith('/')) {
      return candidate;
    }

    return '/';
  }, [location.state]);

  useEffect(() => {
    if (user) {
      navigate(redirectTarget, { replace: true });
    }
  }, [user, navigate, redirectTarget]);

  async function handleGoogleSignIn() {
    setLoading(true);

    try {
      await signInWithGoogle();
      navigate(redirectTarget, { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-stack auth-page">
      <section className="auth-shell">
        <div className="sign-in-panel sign-in-panel--redesigned">
          <p className="eyebrow">{copy.signIn.eyebrow}</p>
          <h1>{copy.signIn.title}</h1>
          <p>{copy.signIn.description}</p>

          <div className="trust-chip-row">
            {copy.signIn.chips.map((chip) => (
              <span className="trust-chip" key={chip}>{chip}</span>
            ))}
          </div>

          {!isFirebaseConfigured ? (
            <div className="form-error form-error--block">
              Firebase configuration is missing. Add the VITE_FIREBASE_* variables
              before testing Google sign-in.
            </div>
          ) : null}

          {error ? (
            <div className="form-error form-error--block">{error}</div>
          ) : null}

          <button
            className="primary-action primary-action--wide primary-action--auth"
            disabled={!isFirebaseConfigured || loading}
            type="button"
            onClick={handleGoogleSignIn}
          >
            <span className="action-mark">G</span>
            {loading ? copy.signIn.loadingGoogle : copy.common.continueWithGoogle}
          </button>

          <div className="auth-support-note">
            {copy.signIn.supportNote}
          </div>
        </div>

        <aside className="auth-brief">
          <article className="document-panel">
            <div className="document-panel__head">
              <span className="document-kicker">Platform Assurance</span>
              <span className="document-mark">DOC</span>
            </div>
            <h2>Designed for trust before action.</h2>
            <ul className="plain-list">
              <li>Protected sign-in before accessing guidance and research</li>
              <li>Structured legal workflows instead of cluttered dashboards</li>
              <li>Source-aware follow-up through public legal pathways</li>
            </ul>
          </article>

          <article className="auth-stat-sheet">
            <div className="auth-stat-sheet__item">
              <strong>AI Guidance</strong>
              <span>Plain-language legal direction for common issues</span>
            </div>
            <div className="auth-stat-sheet__item">
              <strong>Case Routing</strong>
              <span>Category-first flows for property, labour, fraud, police, and more</span>
            </div>
            <div className="auth-stat-sheet__item">
              <strong>Research Links</strong>
              <span>Indian Kanoon and official eCourts pathways in one platform</span>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
