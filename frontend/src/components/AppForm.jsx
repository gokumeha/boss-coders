import { useEffect, useMemo, useRef } from 'react';

import { CATEGORIES, SUPPORTED_LANGUAGES } from '@shared/siteContent';

import { useLanguage } from '../context/LanguageContext';
import ResultDisplay from './ResultDisplay';

export default function AppForm({
  form,
  result,
  submittedCase,
  loading,
  error,
  onFieldChange,
  onSubmit,
  onReset,
  historyItems,
  historyLoading,
  onLanguageChange,
  onSuggestedCategoryApply,
}) {
  const { copy } = useLanguage();
  const languageRef = useRef(null);
  const categoryRef = useRef(null);
  const describeRef = useRef(null);
  const guidanceRef = useRef(null);
  const submitRef = useRef(null);

  useEffect(() => {
    onLanguageChange?.(form.language);
  }, [form.language, onLanguageChange]);

  const selectedCategory = useMemo(
    () => CATEGORIES.find((category) => category.id === form.category),
    [form.category],
  );
  const progressSteps = form.getSteps(Boolean(result));

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

  function scrollToTarget(targetRef, shouldFocus = true) {
    const target = targetRef.current;

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    if (shouldFocus && typeof target.focus === 'function') {
      target.focus({ preventScroll: true });
    }
  }

  function handleProgressCardClick(stepLabel) {
    if (stepLabel === 'Language') {
      scrollToTarget(languageRef);
      return;
    }

    if (stepLabel === 'Category') {
      scrollToTarget(categoryRef);
      return;
    }

    if (stepLabel === 'Describe') {
      scrollToTarget(describeRef);
      return;
    }

    if (result) {
      scrollToTarget(guidanceRef, false);
      return;
    }

    scrollToTarget(submitRef, false);
  }

  return (
    <div className="assistant-shell">
      <section className="assistant-intro-panel assistant-intro-panel--spotlight iridescent-panel">
        <div className="assistant-hero-layout">
          <div className="assistant-hero-copy">
            <p className="eyebrow">{copy.assistant.title}</p>
            <h1>{copy.assistant.title}</h1>
            <p>{copy.assistant.description}</p>

            <div className="assistant-steps">
              <span className="assistant-step-chip">{copy.assistant.stepPickLanguage}</span>
              <span className="assistant-step-chip">{copy.assistant.stepChooseCategory}</span>
              <span className="assistant-step-chip">{copy.assistant.stepDescribeIssue}</span>
            </div>
          </div>

          <div className="assistant-hero-aside">
            <article className="assistant-lustre-card">
              <strong>{copy.result.generateDraft}</strong>
              <span>{copy.result.draftStudioDescription}</span>
            </article>

            <article className="assistant-lustre-card">
              <strong>{copy.result.timelineTitle}</strong>
              <span>{copy.result.timelineDescription}</span>
            </article>

            <article className="assistant-lustre-card">
              <strong>{copy.result.checklistTitle}</strong>
              <span>{copy.result.checklistDescription}</span>
            </article>
          </div>
        </div>

        <div className="assistant-progress-strip">
          {progressSteps.map((step) => (
            <button
              className={`assistant-progress-card assistant-progress-card--${step.state}`}
              key={step.id}
              onClick={() => handleProgressCardClick(step.label)}
              type="button"
            >
              <span className="assistant-progress-card__index">{step.id}</span>
              <strong>{step.label}</strong>
            </button>
          ))}
        </div>
      </section>

      <div className="assistant-main">
        <form className="assistant-form assistant-form--minimal iridescent-panel" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="field">
              <span>{copy.assistant.languageLabel}</span>
              <select
                className="field-control"
                ref={languageRef}
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
                ref={categoryRef}
                value={form.category}
                onChange={(event) => {
                  onFieldChange?.();
                  form.setCategory(event.target.value);
                }}
              >
                <option value="">{copy.assistant.selectCategory}</option>
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
              placeholder={copy.assistant.queryPlaceholder}
              ref={describeRef}
              value={form.query}
              onChange={(event) => {
                onFieldChange?.();
                form.setQuery(event.target.value);
              }}
            />
          </label>

          <div className="assistant-helper-row">
            <div className="assistant-helper-card">
              <strong>{copy.assistant.helperTitle}</strong>
              <span>
                {copy.assistant.helperDescription}
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
            ref={submitRef}
            type="submit"
          >
            {loading ? copy.assistant.loading : copy.assistant.submit}
          </button>
        </form>

        {loading ? (
          <section className="assistant-loading-panel iridescent-panel" aria-live="polite">
            <div className="assistant-loading-panel__head">
              <div className="assistant-loading-orbit" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div>
                <p className="eyebrow">{copy.assistant.loading}</p>
                <h2>{copy.result.loadingTitle}</h2>
                <p>{copy.result.loadingDescription}</p>
              </div>
            </div>

            <div className="assistant-loading-steps">
              {copy.result.loadingSignals.map((item) => (
                <article className="assistant-loading-step" key={item}>
                  <span className="assistant-loading-step__pulse" aria-hidden="true" />
                  <strong>{item}</strong>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {selectedCategory ? (
          <section className="assistant-context-panel iridescent-panel">
            <p className="eyebrow">{copy.assistant.contextEyebrow}</p>
            <h2>{selectedCategory.title}</h2>
            <p>{selectedCategory.description}</p>
            <ul className="plain-list">
              {selectedCategory.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {result ? (
          <div ref={guidanceRef} tabIndex={-1}>
            <ResultDisplay
              onApplySuggestedCategory={onSuggestedCategoryApply}
              onReset={onReset}
              result={result}
              submittedCase={submittedCase}
            />
          </div>
        ) : null}

        <section className="assistant-history-panel iridescent-panel">
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
