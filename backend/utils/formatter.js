import { URGENCY_LEVELS } from '../../shared/legalContract.js';

function ensureArray(items, fallback) {
  return Array.isArray(items) && items.length > 0 ? items : fallback;
}

function ensureString(value, fallback) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export function formatLegalResponse(payload) {
  if (payload.resultType === 'mismatch') {
    return {
      resultType: 'mismatch',
      summary: ensureString(
        payload.summary,
        'This situation does not match the selected legal category.',
      ),
      message: ensureString(
        payload.message,
        'Please choose a better-matching legal category before generating guidance.',
      ),
      selectedCategory: ensureString(payload.selectedCategory, ''),
      selectedCategoryTitle: ensureString(payload.selectedCategoryTitle, ''),
      suggestedCategory: ensureString(payload.suggestedCategory, ''),
      suggestedCategoryTitle: ensureString(payload.suggestedCategoryTitle, ''),
      rights: '',
      rightsList: [],
      laws: [],
      steps: [],
      urgency: 'medium',
      authority: '',
      draft: '',
      helplines: [],
      research: {
        indiankanoon: { status: 'unavailable', documents: [], message: '' },
        ecourts: { status: 'unavailable', portalUrl: '', note: '', searchModes: [] },
      },
    };
  }

  const rightsList = ensureArray(payload.rightsList, [
    'Ask for written acknowledgements and keep proof of every interaction.',
    'Approach the relevant public authority without waiting for informal promises.',
  ]);

  const urgency = URGENCY_LEVELS.includes(payload.urgency)
    ? payload.urgency
    : 'medium';

  return {
    resultType: payload.resultType === 'guidance' ? 'guidance' : 'guidance',
    summary: ensureString(
      payload.summary,
      'This is a mock legal guidance response prepared by the backend service.',
    ),
    rights: ensureString(
      payload.rights,
      rightsList.join(' '),
    ),
    rightsList,
    laws: ensureArray(payload.laws, ['Relevant Indian legal provisions can be inserted here.']),
    steps: ensureArray(payload.steps, [
      'Collect written proof and keep a dated record of what happened.',
      'Escalate to the correct authority using a formal written complaint.',
    ]),
    urgency,
    authority: ensureString(
      payload.authority,
      'The appropriate authority can be determined from the category and local jurisdiction.',
    ),
    draft: ensureString(
      payload.draft,
      'To,\nThe Concerned Authority\n\nSubject: Request for legal assistance.\n\nPlease accept this complaint regarding the issue described above.\n\nSincerely,\n[FULL NAME]',
    ),
    helplines: ensureArray(payload.helplines, []),
    research: payload.research || {
      indiankanoon: { status: 'unavailable', documents: [], message: '' },
      ecourts: { status: 'unavailable', portalUrl: '', note: '', searchModes: [] },
    },
  };
}
