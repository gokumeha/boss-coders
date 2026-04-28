import { useLanguage } from '../context/LanguageContext';

function getUrgencyLabel(urgency) {
  if (urgency === 'high') {
    return 'High urgency';
  }

  if (urgency === 'low') {
    return 'Low urgency';
  }

  return 'Medium urgency';
}

export default function ResultDisplay({ result, onReset }) {
  const { copy } = useLanguage();

  return (
    <div className="result-panel">
      <div className={`urgency-pill urgency-pill--${result.urgency}`}>
        {getUrgencyLabel(result.urgency)}
      </div>

      <section className="result-section">
        <h3>{copy.result.summary}</h3>
        <p>{result.summary}</p>
      </section>

      <section className="result-section">
        <h3>{copy.result.rights}</h3>
        <div className="chip-list">
          {(result.rightsList || []).map((right) => (
            <span className="chip" key={right}>
              {right}
            </span>
          ))}
        </div>
      </section>

      <section className="result-section">
        <h3>{copy.result.laws}</h3>
        <div className="chip-list">
          {(result.laws || []).map((law) => (
            <span className="chip chip--gold" key={law}>
              {law}
            </span>
          ))}
        </div>
      </section>

      <section className="result-section">
        <h3>{copy.result.steps}</h3>
        <ol className="ordered-list">
          {(result.steps || []).map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="result-section">
        <h3>{copy.result.draft}</h3>
        <pre className="draft-box">{result.draft}</pre>
      </section>

      <section className="result-section">
        <h3>{copy.result.authority}</h3>
        <div className="info-surface">{result.authority}</div>
      </section>

      {result.helplines?.length ? (
        <section className="result-section">
          <h3>{copy.result.helplines}</h3>
          <div className="resource-grid resource-grid--tight">
            {result.helplines.map((helpline) => (
              <article className="mini-card" key={`${helpline.name}-${helpline.number}`}>
                <strong>{helpline.name}</strong>
                <span>{helpline.number}</span>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {result.research?.indiankanoon?.documents?.length ? (
        <section className="result-section">
          <h3>{copy.common.relatedCases}</h3>
          <div className="resource-grid resource-grid--tight">
            {result.research.indiankanoon.documents.map((document) => (
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
        </section>
      ) : null}

      {result.research?.ecourts?.portalUrl ? (
        <section className="result-section">
          <h3>{copy.common.officialCourtAccess}</h3>
          <a
            className="info-surface info-surface--link"
            href={result.research.ecourts.portalUrl}
            rel="noreferrer"
            target="_blank"
          >
            {result.research.ecourts.note}
          </a>
        </section>
      ) : null}

      <button className="secondary-action" type="button" onClick={onReset}>
        {copy.result.reset}
      </button>
    </div>
  );
}

