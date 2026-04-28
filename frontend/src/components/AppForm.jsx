import { useEffect, useMemo } from 'react';

import { CATEGORIES, SUPPORTED_LANGUAGES } from '@shared/siteContent';

import { useLanguage } from '../context/LanguageContext';
import ResultDisplay from './ResultDisplay';

export default function AppForm({
  form,
  result,
  loading,
  error,
  onFieldChange,
  onSubmit,
  onReset,
  historyItems,
  historyLoading,
  onLanguageChange,
}) {
  const { copy } = useLanguage();

  useEffect(() => {
    onLanguageChange?.(form.language);
  }, [form.language, onLanguageChange]);

  const selectedCategory = useMemo(
    () => CATEGORIES.find((category) => category.id === form.category),
    [form.category],
  );

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.isSubmittable || loading) {
      return;
    }

    try {
      await onSubmit(form.buildPayload());
    } catch (_error) {
      // Surface comes from hook state.
    }
  }

  return (
    <div className="assistant-shell">
      <section className="assistant-intro-panel">
        <p className="eyebrow">{copy.assistant.title}</p>
        <h1>{copy.assistant.title}</h1>
        <p>{copy.assistant.description}</p>

        <div className="assistant-steps">
          <span className="assistant-step-chip">1. Pick language</span>
          <span className="assistant-step-chip">2. Choose category</span>
          <span className="assistant-step-chip">3. Describe the issue clearly</span>
        </div>
      </section>

      <div className="assistant-main">
        <form className="assistant-form assistant-form--minimal" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="field">
              <span>{copy.assistant.languageLabel}</span>
              <select
                className="field-control"
                value={form.language}
                onChange={(event) => {
                  onFieldChange?.();
                  form.setLanguage(event.target.value);
                }}
              >
                {SUPPORTED_LANGUAGES.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>{copy.assistant.categoryLabel}</span>
              <select
                className="field-control"
                value={form.category}
                onChange={(event) => {
                  onFieldChange?.();
                  form.setCategory(event.target.value);
                }}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>{copy.assistant.issueLabel}</span>
            <textarea
              className="field-textarea"
              maxLength={form.maxQueryLength}
              placeholder="Describe the issue, who is involved, what proof you have, and what outcome you need."
              value={form.query}
              onChange={(event) => {
                onFieldChange?.();
                form.setQuery(event.target.value);
              }}
            />
          </label>

          <div className="assistant-helper-row">
            <div className="assistant-helper-card">
              <strong>Write a real legal situation</strong>
              <span>
                Include who is involved, what happened, and what help you need.
              </span>
            </div>

            {selectedCategory ? (
              <div className="assistant-helper-card assistant-helper-card--soft">
                <strong>{selectedCategory.title}</strong>
                <span>{selectedCategory.shortDescription}</span>
              </div>
            ) : null}
          </div>

          <div className="form-meta">
            <span>
              {form.charCount}/{form.maxQueryLength}
            </span>
            {error ? <span className="form-error">{error}</span> : null}
          </div>

          <button
            className="primary-action"
            disabled={!form.isSubmittable || loading}
            type="submit"
          >
            {loading ? copy.assistant.loading : copy.assistant.submit}
          </button>
        </form>

        {selectedCategory ? (
          <section className="assistant-context-panel">
            <p className="eyebrow">Category context</p>
            <h2>{selectedCategory.title}</h2>
            <p>{selectedCategory.description}</p>
            <ul className="plain-list">
              {selectedCategory.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {result ? <ResultDisplay onReset={onReset} result={result} /> : null}

        <section className="assistant-history-panel">
          <div className="assistant-history-head">
            <p className="eyebrow">{copy.assistant.historyTitle}</p>
            {historyLoading ? <span>{copy.common.loading}...</span> : null}
          </div>

          {historyItems.length ? (
            <div className="history-list history-list--compact">
              {historyItems.map((item) => (
                <article className="history-item" key={item.id}>
                  <strong>{item.category}</strong>
                  <span>{item.summary}</span>
                </article>
              ))}
            </div>
          ) : (
            <p className="assistant-history-empty">{copy.assistant.historyEmpty}</p>
          )}
        </section>
      </div>
    </div>
  );
}
