import { useEffect, useRef } from 'react';

import { APP_COPY, CATEGORIES, SUPPORTED_LANGUAGES } from '@shared/siteContent';

import ResultDisplay from './ResultDisplay';

export default function AppForm({
  form,
  error,
  loading,
  result,
  onSubmit,
  onReset,
}) {
  const resultRef = useRef(null);
  const steps = form.getSteps(Boolean(result));

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.isSubmittable || loading) {
      return;
    }

    try {
      await onSubmit(form.buildPayload());
    } catch (_error) {
      // Error state is handled by the API hook and rendered here.
    }
  }

  return (
    <div className="container">
      <div className="app-layout">
        <div className="app-left">
          <div className="section-tag reveal">Free Legal Aid</div>
          <h2 className="section-title reveal">{APP_COPY.appHeadline}</h2>
          <p className="section-sub reveal app-subcopy">{APP_COPY.appDescription}</p>

          <div className="privacy-card reveal">
            <div className="privacy-title">{APP_COPY.privacyTitle}</div>
            <div className="privacy-text">{APP_COPY.privacyDescription}</div>
          </div>
        </div>

        <div className="app-right">
          <div className="step-ind" id="stepInd">
            {steps.map((step, index) => (
              <div className="step-ind-row" key={step.id}>
                <div className="si">
                  <div className={`si-circle ${step.state}`}>
                    {step.state === 'done' ? '✓' : step.id}
                  </div>
                  <span className={`si-label ${step.state}`}>{step.label}</span>
                </div>
                {index < steps.length - 1 ? <div className="si-line" /> : null}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="lang-section">
              <div className="lang-label">Select Language</div>
              <div className="lang-pills">
                {SUPPORTED_LANGUAGES.map((language) => (
                  <button
                    className={`lang-pill ${
                      form.language === language.value ? 'active' : ''
                    }`}
                    key={language.value}
                    type="button"
                    onClick={() => form.setLanguage(language.value)}
                  >
                    {language.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="cat-label">Select Category</div>
            <div className="cat-grid">
              {CATEGORIES.map((category) => (
                <button
                  className={`cat-card ${
                    form.category === category.id ? 'sel' : ''
                  }`}
                  key={category.id}
                  type="button"
                  onClick={() => form.setCategory(category.id)}
                >
                  <span className="ci">{category.icon}</span>
                  <span className="cat-card-copy">
                    <span className="ct">{category.title}</span>
                    <span className="cd">{category.shortDescription}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="input-label">Describe Your Situation</div>
            <textarea
              className="query-textarea"
              maxLength={form.maxQueryLength}
              placeholder={APP_COPY.queryPlaceholder}
              value={form.query}
              onChange={(event) => form.setQuery(event.target.value)}
            />
            <div className="char-ct">
              {form.charCount}/{form.maxQueryLength}
            </div>

            {error ? <div className="err-box">{error}</div> : null}

            <button
              className="btn-submit"
              disabled={!form.isSubmittable || loading}
              type="submit"
            >
              {loading ? 'Analysing Your Situation...' : 'Get My Legal Guidance'}
            </button>
          </form>

          {loading ? (
            <div className="loading-box">
              <div className="loader" />
              <div className="loading-t">Analysing your situation...</div>
              <div className="loading-s">
                Identifying applicable Indian laws and your rights
              </div>
            </div>
          ) : null}

          {result ? (
            <div className="result-box" ref={resultRef}>
              <ResultDisplay result={result} onReset={onReset} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

