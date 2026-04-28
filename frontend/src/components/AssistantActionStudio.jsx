import { useEffect, useMemo, useState } from 'react';

import { LEGAL_CATEGORY_MAP } from '@shared/siteContent';

import { useLanguage } from '../context/LanguageContext';
import {
  buildChecklistItems,
  buildDraftLetter,
  downloadTextFile,
  formatTimelineDate,
} from '../lib/assistantArtifacts';

function sortTimelineEntries(entries) {
  return [...entries].sort((left, right) => {
    if (left.date === right.date) {
      return left.createdAt - right.createdAt;
    }

    return left.date.localeCompare(right.date);
  });
}

export default function AssistantActionStudio({ result, submittedCase }) {
  const { copy } = useLanguage();
  const [timelineForm, setTimelineForm] = useState({ date: '', detail: '' });
  const [timelineEntries, setTimelineEntries] = useState([]);
  const [draftVisible, setDraftVisible] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const categoryTitle = LEGAL_CATEGORY_MAP[submittedCase?.category]?.title || 'Legal Issue';

  const checklistItems = useMemo(
    () =>
      buildChecklistItems({
        categoryId: submittedCase?.category,
        query: submittedCase?.query,
        result,
        timelineEntries,
      }),
    [result, submittedCase?.category, submittedCase?.query, timelineEntries],
  );

  const generatedDraft = useMemo(
    () =>
      buildDraftLetter({
        submittedCase,
        result,
        timelineEntries,
        checklistItems,
      }),
    [checklistItems, result, submittedCase, timelineEntries],
  );

  const checkedCount = useMemo(
    () => Object.values(checkedItems).filter(Boolean).length,
    [checkedItems],
  );

  useEffect(() => {
    setTimelineEntries([]);
    setTimelineForm({ date: '', detail: '' });
    setDraftVisible(false);
    setCheckedItems({});
  }, [submittedCase?.category, submittedCase?.query, submittedCase?.submittedAt]);

  useEffect(() => {
    setCheckedItems((current) => {
      const nextState = {};

      checklistItems.forEach((item) => {
        nextState[item.id] = current[item.id] || false;
      });

      return nextState;
    });
  }, [checklistItems]);

  function handleTimelineSubmit(event) {
    event.preventDefault();

    if (!timelineForm.date || !timelineForm.detail.trim()) {
      return;
    }

    const timestamp = Date.now();
    const nextEntry = {
      id: `${timelineForm.date}-${timestamp}`,
      date: timelineForm.date,
      detail: timelineForm.detail.trim(),
      createdAt: timestamp,
    };

    setTimelineEntries((current) => sortTimelineEntries([...current, nextEntry]));
    setTimelineForm({ date: '', detail: '' });
  }

  function handleTimelineRemove(entryId) {
    setTimelineEntries((current) => current.filter((entry) => entry.id !== entryId));
  }

  function handleChecklistDownload() {
    const content = [
      `${categoryTitle} checklist`,
      '',
      `Suggested authority: ${result.authority}`,
      '',
      ...checklistItems.map((item) => `${checkedItems[item.id] ? '[x]' : '[ ]'} ${item.label}`),
      '',
      'Timeline summary:',
      ...(timelineEntries.length
        ? timelineEntries.map(
            (entry) => `- ${formatTimelineDate(entry.date)}: ${entry.detail.trim()}`,
          )
        : ['- Add your dated incidents before you file or escalate.']),
    ].join('\n');

    downloadTextFile('nyayasaathi-checklist.txt', content);
  }

  function handleDraftDownload() {
    downloadTextFile('nyayasaathi-draft-letter.txt', generatedDraft);
  }

  return (
    <section className="assistant-tools">
      <div className="assistant-tools__head">
        <p className="eyebrow">{copy.result.actionStudioEyebrow}</p>
        <h3>{copy.result.actionStudioTitle}</h3>
        <p>{copy.result.actionStudioDescription}</p>
      </div>

      <div className="assistant-tools__grid">
        <article className="assistant-tool-card assistant-tool-card--draft">
          <div className="assistant-tool-card__head">
            <div>
              <p className="document-kicker">{copy.result.draftStudioKicker}</p>
              <h4>{copy.result.draftStudioTitle}</h4>
            </div>
            <span className="status-pill status-pill--soft">{categoryTitle}</span>
          </div>

          <p>{copy.result.draftStudioDescription}</p>

          <div className="panel-actions">
            <button
              className="primary-action"
              type="button"
              onClick={() => setDraftVisible(true)}
            >
              {draftVisible ? copy.result.refreshDraft : copy.result.generateDraft}
            </button>

            {draftVisible ? (
              <button
                className="secondary-action"
                type="button"
                onClick={handleDraftDownload}
              >
                {copy.result.downloadDraft}
              </button>
            ) : null}
          </div>

          <div className="assistant-tool-note">
            <strong>{copy.result.draftStudioNoteTitle}</strong>
            <span>{copy.result.draftStudioNote}</span>
          </div>

          {draftVisible ? (
            <pre className="draft-box draft-box--featured">{generatedDraft}</pre>
          ) : null}
        </article>

        <article className="assistant-tool-card assistant-tool-card--timeline">
          <div className="assistant-tool-card__head">
            <div>
              <p className="document-kicker">{copy.result.timelineKicker}</p>
              <h4>{copy.result.timelineTitle}</h4>
            </div>
            <span className="status-pill status-pill--soft">
              {timelineEntries.length} {copy.result.timelineCountSuffix}
            </span>
          </div>

          <p>{copy.result.timelineDescription}</p>

          <form className="assistant-timeline-form" onSubmit={handleTimelineSubmit}>
            <label className="field">
              <span>{copy.result.timelineDateLabel}</span>
              <input
                className="field-control"
                type="date"
                value={timelineForm.date}
                onChange={(event) =>
                  setTimelineForm((current) => ({ ...current, date: event.target.value }))
                }
              />
            </label>

            <label className="field">
              <span>{copy.result.timelineEventLabel}</span>
              <textarea
                className="field-textarea field-textarea--compact"
                placeholder={copy.result.timelinePlaceholder}
                value={timelineForm.detail}
                onChange={(event) =>
                  setTimelineForm((current) => ({ ...current, detail: event.target.value }))
                }
              />
            </label>

            <button className="secondary-action" type="submit">
              {copy.result.addTimelineEvent}
            </button>
          </form>

          {timelineEntries.length ? (
            <div className="timeline-list">
              {timelineEntries.map((entry) => (
                <article className="timeline-item" key={entry.id}>
                  <div className="timeline-item__date">{formatTimelineDate(entry.date)}</div>
                  <div className="timeline-item__body">
                    <p>{entry.detail}</p>
                    <button
                      className="text-link"
                      type="button"
                      onClick={() => handleTimelineRemove(entry.id)}
                    >
                      {copy.result.removeTimelineEvent}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="assistant-tool-empty">{copy.result.timelineEmpty}</p>
          )}
        </article>

        <article className="assistant-tool-card assistant-tool-card--checklist">
          <div className="assistant-tool-card__head">
            <div>
              <p className="document-kicker">{copy.result.checklistKicker}</p>
              <h4>{copy.result.checklistTitle}</h4>
            </div>
            <span className="status-pill status-pill--soft">
              {checkedCount}/{checklistItems.length} {copy.result.checklistReadySuffix}
            </span>
          </div>

          <p>{copy.result.checklistDescription}</p>

          <div className="assistant-tool-note assistant-tool-note--soft">
            <strong>{copy.result.checklistAuthorityLabel}</strong>
            <span>{result.authority}</span>
          </div>

          <div className="checklist-list">
            {checklistItems.map((item) => (
              <label
                className={`checklist-item ${checkedItems[item.id] ? 'checklist-item--checked' : ''}`}
                key={item.id}
              >
                <input
                  checked={Boolean(checkedItems[item.id])}
                  type="checkbox"
                  onChange={(event) =>
                    setCheckedItems((current) => ({
                      ...current,
                      [item.id]: event.target.checked,
                    }))
                  }
                />
                <span className="checklist-item__body">
                  <strong>{item.label}</strong>
                  <small>{item.note}</small>
                </span>
              </label>
            ))}
          </div>

          <div className="panel-actions">
            <button
              className="secondary-action"
              type="button"
              onClick={handleChecklistDownload}
            >
              {copy.result.downloadChecklist}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
