function slugify(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function hashQuery(value = '') {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
}

function safeReadStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWriteStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemoveStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore local storage availability issues.
  }
}

export function buildWorkspaceStorageKey(ownerId, submittedCase) {
  if (!submittedCase?.category || !submittedCase?.query) {
    return '';
  }

  const owner = ownerId || 'guest';
  const category = slugify(submittedCase.category);
  const queryHash = hashQuery(submittedCase.query.trim());

  return `nyayasaathi-workspace:${owner}:${category}:${queryHash}`;
}

export function readWorkspaceSnapshot(storageKey) {
  if (!storageKey) {
    return null;
  }

  const raw = safeReadStorage(storageKey);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveWorkspaceSnapshot(storageKey, snapshot) {
  if (!storageKey || !snapshot) {
    return false;
  }

  return safeWriteStorage(storageKey, JSON.stringify(snapshot));
}

export function clearWorkspaceSnapshot(storageKey) {
  if (!storageKey) {
    return;
  }

  safeRemoveStorage(storageKey);
}

export function classifyEvidenceFile(file) {
  const name = (file?.name || '').toLowerCase();
  const mime = (file?.type || '').toLowerCase();

  if (/invoice|receipt|bill|payment|upi|bank|statement/.test(name)) {
    return 'Payment proof';
  }

  if (/agreement|lease|contract|offer|appointment|notice|order|fir/.test(name)) {
    return 'Formal document';
  }

  if (/whatsapp|chat|message|sms|mail|email|screenshot/.test(name)) {
    return 'Messages and screenshots';
  }

  if (mime.startsWith('image/')) {
    return 'Photos and screenshots';
  }

  if (mime.startsWith('video/') || mime.startsWith('audio/')) {
    return 'Media recording';
  }

  if (/pdf/.test(mime) || /\.pdf$/i.test(file?.name || '')) {
    return 'PDF evidence';
  }

  return 'Other evidence';
}

export function formatEvidenceSize(size = 0) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function createEvidenceItems(files = []) {
  return Array.from(files).map((file, index) => {
    const timestamp = Date.now() + index;

    return {
      id: `${timestamp}-${slugify(file.name) || 'evidence'}`,
      name: file.name,
      size: file.size,
      type: file.type || 'Unknown file',
      group: classifyEvidenceFile(file),
      addedAt: timestamp,
      lastModified: file.lastModified || timestamp,
    };
  });
}

export function buildCaseWorkspaceExport({
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
}) {
  const safeTitle = workspaceTitle?.trim() || `${categoryTitle} workspace`;
  const checkedLines = checklistItems.map(
    (item) => `${checkedItems[item.id] ? '[x]' : '[ ]'} ${item.label}`,
  );
  const evidenceLines = evidenceItems.length
    ? evidenceItems.map(
        (item) =>
          `- ${item.name} (${item.group}, ${formatEvidenceSize(item.size)})`,
      )
    : ['- No evidence items logged yet'];
  const timelineLines = timelineEntries.length
    ? timelineEntries.map(
        (entry) => `- ${entry.date}: ${entry.detail}`,
      )
    : ['- No timeline entries yet'];

  return [
    safeTitle,
    '',
    `Category: ${categoryTitle}`,
    `Suggested authority: ${result.authority}`,
    '',
    'Issue summary:',
    submittedCase?.query || '',
    '',
    'Case notes:',
    caseNotes?.trim() || 'No notes added yet.',
    '',
    'Timeline:',
    ...timelineLines,
    '',
    'Checklist:',
    ...checkedLines,
    '',
    'Evidence locker:',
    ...evidenceLines,
    '',
    'Draft letter:',
    generatedDraft,
  ].join('\n');
}
