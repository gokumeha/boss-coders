import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const { copy } = useLanguage();
  const { signInWithGoogle, error, isFirebaseConfigured, user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  async function handleGoogleSignIn() {
    setLoading(true);

    try {
      await signInWithGoogle();
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-stack page-stack--narrow">
      <section className="sign-in-hero">
        <div className="sign-in-panel">
          <p className="eyebrow">Google Sign-In</p>
          <h1>{copy.signIn.title}</h1>
          <p>{copy.signIn.description}</p>

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
            className="primary-action primary-action--wide"
            disabled={!isFirebaseConfigured || loading}
            type="button"
            onClick={handleGoogleSignIn}
          >
            {loading ? 'Opening Google...' : copy.common.continueWithGoogle}
          </button>
        </div>
      </section>
    </div>
  );
}
