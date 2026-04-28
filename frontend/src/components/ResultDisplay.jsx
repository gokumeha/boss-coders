import { useEffect, useMemo, useState } from 'react';

function getUrgencyLabel(urgency) {
  if (urgency === 'high') {
    return 'High Urgency';
  }

  if (urgency === 'low') {
    return 'Low Urgency';
  }

  return 'Medium Urgency';
}

export default function ResultDisplay({ result, onReset }) {
  const [copyStatus, setCopyStatus] = useState('Copy Complaint');

  useEffect(() => {
    setCopyStatus('Copy Complaint');
  }, [result]);

  const rightsList = useMemo(() => {
    if (Array.isArray(result.rightsList) && result.rightsList.length > 0) {
      return result.rightsList;
    }

    return result.rights
      .split('.')
      .map((item) => item.trim())
      .filter(Boolean);
  }, [result]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.draft);
      setCopyStatus('Copied');
    } catch (_error) {
      setCopyStatus('Copy Failed');
    }
  }

  return (
    <div className="result-wrap">
      <div className={`urg-badge urgency-${result.urgency}`}>
        {getUrgencyLabel(result.urgency)}
      </div>

      <div className="r-section">
        <div className="r-head">Situation Summary</div>
        <div className="r-text">{result.summary}</div>
      </div>

      <div className="divider" />

      <div className="r-section">
        <div className="r-head">Your Rights</div>
        <div className="r-pills">
          {rightsList.map((right) => (
            <span className="r-pill" key={right}>
              {right}
            </span>
          ))}
        </div>
      </div>

      <div className="r-section r-section--spaced">
        <div className="r-head">Applicable Indian Laws</div>
        <div className="r-pills">
          {result.laws.map((law) => (
            <span className="r-pill gold" key={law}>
              {law}
            </span>
          ))}
        </div>
      </div>

      <div className="divider" />

      <div className="r-section">
        <div className="r-head">Action Steps</div>
        <ol className="steps-ol">
          {result.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="divider" />

      <div className="r-section">
        <div className="r-head">Ready-to-File Complaint Draft</div>
        <div className="draft-box">{result.draft}</div>
        <button className="copy-btn" type="button" onClick={handleCopy}>
          {copyStatus}
        </button>
      </div>

      <div className="divider" />

      <div className="r-section">
        <div className="r-head">Where to Approach</div>
        <div className="auth-box">{result.authority}</div>
      </div>

      {result.helplines.length > 0 ? (
        <div className="r-section r-section--spaced">
          <div className="r-head">Helplines &amp; Resources</div>
          <div className="hl-list">
            {result.helplines.map((helpline) => (
              <div className="hl-card" key={`${helpline.name}-${helpline.number}`}>
                <div className="hl-name">{helpline.name}</div>
                <div className="hl-num">{helpline.number}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="divider" />

      <button className="btn-reset" type="button" onClick={onReset}>
        Start Over
      </button>
    </div>
  );
}

