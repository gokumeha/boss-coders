import { useState } from 'react';

import { RESOURCE_SOURCES } from '@shared/siteContent';
import { useLanguage } from '../context/LanguageContext';
import { searchResearch } from '../services/api';

export default function ResourcesPage() {
  const { copy } = useLanguage();
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('indiankanoon');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const nextResult = await searchResearch({
        source,
        query: query.trim(),
      });
      setResult(nextResult);
    } catch (searchError) {
      setError(
        searchError instanceof Error
          ? searchError.message
          : 'Unable to search the selected source.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-stack page-stack--narrow">
      <section className="page-hero page-hero--structured scroll-reveal-target">
        <p className="eyebrow">{copy.pages.resourcesEyebrow}</p>
        <h1>{copy.resources.title}</h1>
        <p>{copy.resources.description}</p>
      </section>

      <section className="split-panel scroll-reveal-target">
        <article className="glass-panel glass-panel--document scroll-reveal-target">
          <h2>{copy.resources.sourcesTitle}</h2>
          <div className="resource-grid">
            {RESOURCE_SOURCES.map((item) => (
              <a
                className="mini-card mini-card--link"
                href={item.url}
                key={item.id}
                rel="noreferrer"
                target="_blank"
              >
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </a>
            ))}
          </div>
        </article>

        <article className="glass-panel glass-panel--document scroll-reveal-target">
          <form className="assistant-form" onSubmit={handleSearch}>
            <label className="field">
              <span>{copy.resources.searchSourceLabel}</span>
              <select
                className="field-control"
                value={source}
                onChange={(event) => setSource(event.target.value)}
              >
                {RESOURCE_SOURCES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>{copy.common.search}</span>
              <textarea
                className="field-textarea field-textarea--compact"
                placeholder={copy.resources.queryPlaceholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            {error ? <div className="form-error form-error--block">{error}</div> : null}

            <button className="primary-action" disabled={loading} type="submit">
              {loading ? `${copy.common.loading}...` : copy.common.search}
            </button>
          </form>

          {result ? (
            <div className="resource-results">
              <h2>{result.source}</h2>
              {result.message ? <p>{result.message}</p> : null}

              {result.documents?.length ? (
                <div className="resource-grid resource-grid--tight">
                  {result.documents.map((document) => (
                    <a
                      className="mini-card mini-card--link"
                      href={document.link}
                      key={document.id}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <strong>{document.title}</strong>
                      <span>{document.source}</span>
                    </a>
                  ))}
                </div>
              ) : null}

              {result.portalUrl ? (
                <div className="info-surface">
                  <p>
                    {result.source === 'ecourts'
                      ? copy.resources.ecourtsNote
                      : 'Open the public Indian Kanoon results page for this exact search.'}
                  </p>
                  <a href={result.portalUrl} rel="noreferrer" target="_blank">
                    {result.portalLabel || 'Open source'}
                  </a>
                  {result.searchModes?.length ? (
                    <ul className="plain-list">
                      {result.searchModes.map((mode) => (
                        <li key={mode}>{mode}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </article>
      </section>
    </div>
  );
}
