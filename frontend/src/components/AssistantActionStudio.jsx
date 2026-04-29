import { useEffect, useMemo, useState } from 'react';

import { LEGAL_CATEGORY_MAP } from '@shared/siteContent';

import { useLanguage } from '../context/LanguageContext';
import {
  buildChecklistItems,
  buildDraftLetter,
  downloadTextFile,
  formatTimelineDate,
} from '../lib/assistantArtifacts';
import {
  buildCaseWorkspaceExport,
  buildWorkspaceStorageKey,
  clearWorkspaceSnapshot,
  createEvidenceItems,
  formatEvidenceSize,
  readWorkspaceSnapshot,
  saveWorkspaceSnapshot,
} from '../lib/caseWorkspace';

function sortTimelineEntries(entries) {
  return [...entries].sort((left, right) => {
    if (left.date === right.date) {
      return left.createdAt - right.createdAt;
    }

    return left.date.localeCompare(right.date);
  });
}

function buildDefaultWorkspaceTitle(categoryTitle) {
  return `${categoryTitle} workspace`;
}

export default function AssistantActionStudio({
  result,
  submittedCase,
  workspaceOwnerId,
}) {
  const { copy } = useLanguage();
  const [timelineForm, setTimelineForm] = useState({ date: '', detail: '' });
  const [timelineEntries, setTimelineEntries] = useState([]);
  const [draftVisible, setDraftVisible] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [workspaceTitle, setWorkspaceTitle] = useState('');
  const [caseNotes, setCaseNotes] = useState('');
  const [evidenceItems, setEvidenceItems] = useState([]);
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const [workspaceSavedAt, setWorkspaceSavedAt] = useState(null);

  const categoryTitle = LEGAL_CATEGORY_MAP[submittedCase?.category]?.title || 'Legal Issue';
  const storageKey = useMemo(
    () => buildWorkspaceStorageKey(workspaceOwnerId, submittedCase),
    [submittedCase, workspaceOwnerId],
  );

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

  const groupedEvidence = useMemo(() => {
    return evidenceItems.reduce((groups, item) => {
      const key = item.group || 'Other evidence';

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(item);
      return groups;
    }, {});
  }, [evidenceItems]);

  useEffect(() => {
    if (!submittedCase) {
      return;
    }

    const fallbackTitle = buildDefaultWorkspaceTitle(categoryTitle);
    const snapshot = readWorkspaceSnapshot(storageKey);

    setTimelineForm({ date: '', detail: '' });
    setDraftVisible(snapshot?.draftVisible || false);
    setTimelineEntries(snapshot?.timelineEntries || []);
    setCheckedItems(snapshot?.checkedItems || {});
    setWorkspaceTitle(snapshot?.workspaceTitle || fallbackTitle);
    setCaseNotes(snapshot?.caseNotes || '');
    setEvidenceItems(snapshot?.evidenceItems || []);
    setWorkspaceSavedAt(snapshot?.savedAt || null);
    setWorkspaceReady(true);
  }, [categoryTitle, storageKey, submittedCase]);

  useEffect(() => {
    setCheckedItems((current) => {
      const nextState = {};

      checklistItems.forEach((item) => {
        nextState[item.id] = current[item.id] || false;
      });

      return nextState;
    });
  }, [checklistItems]);

  useEffect(() => {
    if (!workspaceReady || !submittedCase || !storageKey) {
      return;
    }

    const savedAt = Date.now();
    const snapshot = {
      workspaceTitle,
      caseNotes,
      timelineEntries,
      checkedItems,
      draftVisible,
      evidenceItems,
      savedAt,
    };

    saveWorkspaceSnapshot(storageKey, snapshot);
    setWorkspaceSavedAt(savedAt);
  }, [
    caseNotes,
    checkedItems,
    draftVisible,
    evidenceItems,
    storageKey,
    submittedCase,
    timelineEntries,
    workspaceReady,
    workspaceTitle,
  ]);

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

  function handleEvidenceUpload(event) {
    const nextItems = createEvidenceItems(event.target.files || []);

    if (nextItems.length) {
      setEvidenceItems((current) => [...nextItems, ...current]);
    }

    event.target.value = '';
  }

  function handleEvidenceRemove(itemId) {
    setEvidenceItems((current) => current.filter((item) => item.id !== itemId));
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

  function handleWorkspaceExport() {
    const content = buildCaseWorkspaceExport({
      categoryTitle,
      submittedCase,
      result,
      workspaceTitle,
      caseNotes,
      timelineEntries,
      checklistItems,
      checkedItems,
      evidenceItems,
      generatedDraft,
    });

    downloadTextFile('nyayasaathi-case-workspace.txt', content);
  }

  function handleWorkspaceClear() {
    setWorkspaceTitle(buildDefaultWorkspaceTitle(categoryTitle));
    setCaseNotes('');
    setTimelineEntries([]);
    setTimelineForm({ date: '', detail: '' });
    setDraftVisible(false);
    setCheckedItems({});
    setEvidenceItems([]);
    setWorkspaceSavedAt(null);
    clearWorkspaceSnapshot(storageKey);
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

      <article className="assistant-workspace-card iridescent-panel">
        <div className="assistant-tool-card__head">
          <div>
            <p className="document-kicker">{copy.result.workspaceKicker}</p>
            <h4>{copy.result.workspaceTitle}</h4>
          </div>
          <span className="status-pill status-pill--soft">
            {workspaceSavedAt
              ? `${copy.result.workspaceSavedLabel}: ${new Date(workspaceSavedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`
              : copy.result.workspaceReadyLabel}
          </span>
        </div>

        <p>{copy.result.workspaceDescription}</p>

        <div className="assistant-workspace-grid">
          <section className="assistant-workspace-panel">
            <label className="field">
              <span>{copy.result.workspaceNameLabel}</span>
              <input
                className="field-control"
                type="text"
                value={workspaceTitle}
                onChange={(event) => setWorkspaceTitle(event.target.value)}
              />
            </label>

            <label className="field">
              <span>{copy.result.workspaceNotesLabel}</span>
              <textarea
                className="field-textarea field-textarea--compact"
                placeholder={copy.result.workspaceNotesPlaceholder}
                value={caseNotes}
                onChange={(event) => setCaseNotes(event.target.value)}
              />
            </label>

            <div className="panel-actions">
              <button
                className="secondary-action"
                type="button"
                onClick={handleWorkspaceExport}
              >
                {copy.result.downloadWorkspace}
              </button>
              <button
                className="secondary-action"
                type="button"
                onClick={handleWorkspaceClear}
              >
                {copy.result.clearWorkspace}
              </button>
            </div>
          </section>

          <section className="assistant-workspace-panel assistant-workspace-panel--evidence">
            <div className="assistant-tool-note assistant-tool-note--soft">
              <strong>{copy.result.evidenceLockerTitle}</strong>
              <span>{copy.result.evidenceLockerDescription}</span>
            </div>

            <label className="assistant-upload-dropzone">
              <input
                className="assistant-upload-input"
                multiple
                type="file"
                onChange={handleEvidenceUpload}
              />
              <strong>{copy.result.uploadEvidence}</strong>
              <span>{copy.result.uploadEvidenceHint}</span>
            </label>

            {Object.keys(groupedEvidence).length ? (
              <div className="assistant-evidence-groups">
                {Object.entries(groupedEvidence).map(([group, items]) => (
                  <article className="assistant-evidence-group" key={group}>
                    <div className="assistant-evidence-group__head">
                      <strong>{group}</strong>
                      <span>{items.length} {copy.result.evidenceCountSuffix}</span>
                    </div>

                    <div className="assistant-evidence-list">
                      {items.map((item) => (
                        <div className="assistant-evidence-item" key={item.id}>
                          <div>
                            <strong>{item.name}</strong>
                            <span>
                              {formatEvidenceSize(item.size)} · {item.type || copy.result.evidenceUnknownType}
                            </span>
                          </div>
                          <button
                            className="text-link"
                            type="button"
                            onClick={() => handleEvidenceRemove(item.id)}
                          >
                            {copy.result.removeEvidence}
                          </button>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="assistant-tool-empty">{copy.result.evidenceEmpty}</p>
            )}
          </section>
        </div>
      </article>
    </section>
  );
}
