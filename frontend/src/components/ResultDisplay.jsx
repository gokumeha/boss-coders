import AssistantActionStudio from './AssistantActionStudio';
import { useLanguage } from '../context/LanguageContext';

function getUrgencyLabel(urgency, copy) {
  if (urgency === 'high') {
    return copy.resultMeta.highUrgency;
  }

  if (urgency === 'low') {
    return copy.resultMeta.lowUrgency;
  }

  return copy.resultMeta.mediumUrgency;
}

export default function ResultDisplay({
  result,
  submittedCase,
  workspaceOwnerId,
  onApplySuggestedCategory,
  onReset,
}) {
  const { copy } = useLanguage();

  if (result.resultType === 'mismatch') {
    return (
      <div className="result-panel result-panel--minimal result-panel--warning iridescent-panel">
        <div className="result-topbar">
          <div className="urgency-pill urgency-pill--medium">{copy.resultMeta.mismatchBadge}</div>

          <button className="secondary-action secondary-action--compact" type="button" onClick={onReset}>
            {copy.result.reset}
          </button>
        </div>

        <section className="result-section">
          <h3>{copy.resultMeta.mismatchTitle}</h3>
          <p>{result.summary}</p>
          <div className="info-surface">
            <strong>{copy.resultMeta.bestFitCategory}</strong>
            <p>{result.suggestedCategoryTitle || copy.resultMeta.chooseCloserCategory}</p>
            <p>{result.message}</p>
          </div>
        </section>

        {result.suggestedCategory ? (
          <div className="panel-actions">
            <button
              className="primary-action"
              type="button"
              onClick={() => onApplySuggestedCategory?.(result.suggestedCategory)}
            >
              {copy.resultMeta.switchTo} {result.suggestedCategoryTitle}
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="result-panel result-panel--minimal iridescent-panel">
      <div className="result-topbar">
        <div className={`urgency-pill urgency-pill--${result.urgency}`}>
          {getUrgencyLabel(result.urgency, copy)}
        </div>

        <button className="secondary-action secondary-action--compact" type="button" onClick={onReset}>
          {copy.result.reset}
        </button>
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

      <AssistantActionStudio
        result={result}
        submittedCase={submittedCase}
        workspaceOwnerId={workspaceOwnerId}
      />

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
    </div>
  );
}
