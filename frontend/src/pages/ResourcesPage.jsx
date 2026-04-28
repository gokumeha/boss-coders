import { useEffect, useState } from 'react';

import { RESOURCE_SOURCES } from '@shared/siteContent';
import { useLanguage } from '../context/LanguageContext';
import { fetchResearchStatus, searchResearch } from '../services/api';

export default function ResourcesPage() {
  const { copy } = useLanguage();
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('indiankanoon');
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResearchStatus().then(setStatus).catch(() => setStatus(null));
  }, []);

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
      <section className="page-hero">
        <p className="eyebrow">Resources</p>
        <h1>{copy.resources.title}</h1>
        <p>{copy.resources.description}</p>
      </section>

      <section className="split-panel">
        <article className="glass-panel">
          <h2>Sources</h2>
          <div className="resource-grid">
            {RESOURCE_SOURCES.map((item) => (
              <button
                className={`mini-card mini-card--button ${source === item.id ? 'mini-card--selected' : ''}`}
                key={item.id}
                type="button"
                onClick={() => setSource(item.id)}
              >
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </button>
            ))}
          </div>

          {status ? (
            <div className="info-surface">
              <strong>Provider status</strong>
              <pre>{JSON.stringify(status, null, 2)}</pre>
            </div>
          ) : null}
        </article>

        <article className="glass-panel">
          <form className="assistant-form" onSubmit={handleSearch}>
            <label className="field">
              <span>{copy.common.search}</span>
              <textarea
                className="field-textarea field-textarea--compact"
                placeholder="Search by issue, act, case phrase, party name, or known identifier."
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
                  <p>{copy.resources.ecourtsNote}</p>
                  <a href={result.portalUrl} rel="noreferrer" target="_blank">
                    Open official eCourts portal
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

