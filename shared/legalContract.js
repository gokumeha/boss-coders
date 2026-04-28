import { CATEGORIES, LEGAL_CATEGORY_MAP, SUPPORTED_LANGUAGES } from './siteContent.js';

export const MAX_QUERY_LENGTH = 1200;
export const URGENCY_LEVELS = ['low', 'medium', 'high'];
export const MIN_QUERY_LENGTH = 20;

const CATEGORY_KEYWORDS = {
  property: [
    'property',
    'rent',
    'rental',
    'tenant',
    'landlord',
    'deposit',
    'builder',
    'registry',
    'registration',
    'eviction',
    'lease',
    'flat',
    'house',
    'land',
    'owner',
    'possession',
    'partition',
    'encroachment',
    'inheritance',
    'will',
  ],
  labour: [
    'salary',
    'wages',
    'employer',
    'company',
    'job',
    'worker',
    'factory',
    'shift',
    'overtime',
    'labour',
    'employment',
    'office',
    'termination',
    'terminated',
    'fired',
    'resignation',
    'bonus',
    'pf',
    'esi',
    'workplace',
    'manager',
    'harassment',
    'payroll',
  ],
  consumer: [
    'refund',
    'product',
    'seller',
    'order',
    'invoice',
    'delivery',
    'service',
    'warranty',
    'defective',
    'purchase',
    'replacement',
    'merchant',
    'customer',
    'bill',
  ],
  domestic: [
    'domestic',
    'husband',
    'wife',
    'marriage',
    'abuse',
    'abusive',
    'violence',
    'beating',
    'threat',
    'threatened',
    'dowry',
    'maintenance',
    'inlaws',
    'in-law',
    'protection',
  ],
  police: [
    'police',
    'fir',
    'complaint',
    'station',
    'arrest',
    'detained',
    'detention',
    'officer',
    'investigation',
    'magistrate',
    'crime',
    'assault',
    'refused',
  ],
  cyber: [
    'cyber',
    'upi',
    'scam',
    'fraud',
    'phishing',
    'hacked',
    'hack',
    'otp',
    'bank',
    'account',
    'transaction',
    'wallet',
    'online',
    'instagram',
    'whatsapp',
    'telegram',
    'password',
  ],
};

const GENERAL_LEGAL_KEYWORDS = [
  'legal',
  'law',
  'lawyer',
  'rights',
  'notice',
  'case',
  'court',
  'complaint',
  'issue',
  'problem',
  'dispute',
  'evidence',
  'proof',
  'harassment',
  'violence',
  'fraud',
  'scam',
  'police',
  'authority',
];

const HELP_INTENT_WORDS = [
  'help',
  'what',
  'how',
  'can',
  'should',
  'need',
  'advice',
  'guide',
  'do',
];

const NARRATIVE_WORDS = [
  'my',
  'me',
  'our',
  'we',
  'family',
  'father',
  'mother',
  'brother',
  'sister',
  'husband',
  'wife',
  'landlord',
  'tenant',
  'employer',
  'boss',
  'company',
  'seller',
  'buyer',
  'bank',
  'neighbor',
  'neighbour',
  'police',
];

const ACTION_WORDS = [
  'refused',
  'stopped',
  'cheated',
  'scammed',
  'threatened',
  'hit',
  'abused',
  'evicted',
  'fired',
  'terminated',
  'deducted',
  'blocked',
  'stolen',
  'hacked',
  'charged',
  'withheld',
  'delayed',
  'ignored',
  'denied',
  'took',
  'taken',
  'wont',
  'cannot',
  'cant',
  'didnt',
  'doesnt',
  'isnt',
  'wasnt',
];

const supportedCategoryIds = new Set(CATEGORIES.map((category) => category.id));
const supportedLanguageValues = new Set(
  SUPPORTED_LANGUAGES.map((language) => language.value),
);

export function isValidCategory(category) {
  return supportedCategoryIds.has(category);
}

export function isValidLanguage(language) {
  return supportedLanguageValues.has(language);
}

function normalizedWords(query) {
  return query
    .trim()
    .split(/\s+/u)
    .map((word) => word.trim())
    .filter(Boolean);
}

function normalizedTokens(query) {
  return query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/u)
    .map((token) => token.trim())
    .filter(Boolean);
}

function countMatches(tokens, keywords) {
  return keywords.reduce(
    (count, keyword) => count + (tokens.includes(keyword.toLowerCase()) ? 1 : 0),
    0,
  );
}

function getCategoryKeywordScore(tokens, categoryId) {
  return countMatches(tokens, CATEGORY_KEYWORDS[categoryId] || []);
}

export function inferLegalCategory(query = '') {
  const tokens = normalizedTokens(query);
  let bestCategory = '';
  let bestScore = 0;

  Object.entries(CATEGORY_KEYWORDS).forEach(([categoryId, keywords]) => {
    const score = countMatches(tokens, keywords);

    if (score > bestScore) {
      bestCategory = categoryId;
      bestScore = score;
    }
  });

  return bestScore > 0 ? bestCategory : '';
}

export function analyzeCategoryFit(query = '', selectedCategory = '') {
  const trimmed = typeof query === 'string' ? query.trim() : '';
  const tokens = normalizedTokens(trimmed);
  const selectedScore = selectedCategory
    ? getCategoryKeywordScore(tokens, selectedCategory)
    : 0;

  let bestCategory = '';
  let bestScore = 0;

  Object.keys(CATEGORY_KEYWORDS).forEach((categoryId) => {
    const score = getCategoryKeywordScore(tokens, categoryId);

    if (score > bestScore) {
      bestCategory = categoryId;
      bestScore = score;
    }
  });

  const hasDetectedCategory = Boolean(bestCategory && bestScore > 0);
  const isMatch =
    !selectedCategory ||
    !hasDetectedCategory ||
    selectedCategory === bestCategory ||
    (selectedScore > 0 && bestScore - selectedScore <= 1);

  return {
    selectedCategory,
    selectedScore,
    bestCategory,
    bestScore,
    isMatch,
    hasDetectedCategory,
    suggestedCategoryTitle: LEGAL_CATEGORY_MAP[bestCategory]?.title || '',
    selectedCategoryTitle: LEGAL_CATEGORY_MAP[selectedCategory]?.title || '',
  };
}

export function analyzeLegalQuery(query = '') {
  const trimmed = typeof query === 'string' ? query.trim() : '';
  const words = normalizedWords(trimmed);
  const tokens = normalizedTokens(trimmed);
  const letters = (trimmed.match(/[\p{L}\p{N}]/gu) || []).length;
  const longWords = words.filter((word) => word.length >= 3);
  const repeatedCharacterPattern = /(.)\1{4,}/u.test(trimmed.toLowerCase());
  const hasSentenceSpacing = words.length > 1;
  const alphaRatio = trimmed.length > 0 ? letters / trimmed.length : 0;
  const uniqueWords = new Set(words.map((word) => word.toLowerCase())).size;
  const categoryGuess = inferLegalCategory(trimmed);
  const generalLegalHits = countMatches(tokens, GENERAL_LEGAL_KEYWORDS);
  const helpIntentHits = countMatches(tokens, HELP_INTENT_WORDS);
  const narrativeHits = countMatches(tokens, NARRATIVE_WORDS);
  const actionHits = countMatches(tokens, ACTION_WORDS);
  const hasQuestionMark = trimmed.includes('?');
  const hasLegalContext =
    Boolean(categoryGuess) ||
    generalLegalHits > 0 ||
    (narrativeHits > 0 && (actionHits > 0 || helpIntentHits > 0)) ||
    (helpIntentHits > 0 && words.length >= 6 && alphaRatio >= 0.7);

  const issues = [];

  if (!trimmed) {
    issues.push('empty');
  }

  if (trimmed.length < MIN_QUERY_LENGTH) {
    issues.push('too_short');
  }

  if (words.length < 4) {
    issues.push('too_few_words');
  }

  if (!hasSentenceSpacing && trimmed.length >= 8) {
    issues.push('single_token');
  }

  if (alphaRatio < 0.55) {
    issues.push('low_signal');
  }

  if (longWords.length < 2) {
    issues.push('not_descriptive');
  }

  if (uniqueWords <= 1 && words.length > 0) {
    issues.push('repetitive');
  }

  if (repeatedCharacterPattern) {
    issues.push('repeated_characters');
  }

  if (!hasLegalContext && trimmed.length >= MIN_QUERY_LENGTH) {
    issues.push('out_of_scope');
  }

  return {
    trimmed,
    words,
    tokens,
    isMeaningful: issues.length === 0,
    issues,
    categoryGuess,
    hasQuestionMark,
  };
}

export function getLegalQueryGuidanceMessage(query) {
  const analysis = analyzeLegalQuery(query);

  if (analysis.isMeaningful) {
    return '';
  }

  if (analysis.issues.includes('empty')) {
    return 'Please describe the legal situation before submitting.';
  }

  if (
    analysis.issues.includes('too_short') ||
    analysis.issues.includes('too_few_words') ||
    analysis.issues.includes('not_descriptive')
  ) {
    return 'Please add a real legal situation with a few details such as who is involved, what happened, and what help you need.';
  }

  if (
    analysis.issues.includes('single_token') ||
    analysis.issues.includes('repetitive') ||
    analysis.issues.includes('repeated_characters') ||
    analysis.issues.includes('low_signal')
  ) {
    return 'Please enter a meaningful legal question instead of random or unclear text.';
  }

  if (analysis.issues.includes('out_of_scope')) {
    return 'Please ask about a real legal problem or enquiry, such as rent, salary, fraud, police, consumer, domestic, or cyber issues.';
  }

  return 'Please describe your actual legal situation clearly so we can provide relevant guidance.';
}

export function validateLegalQueryPayload(payload = {}) {
  const { category, language, query } = payload;

  if (!category || !isValidCategory(category)) {
    return 'Please select a valid legal category.';
  }

  if (!language || !isValidLanguage(language)) {
    return 'Please select a supported language.';
  }

  if (!query || typeof query !== 'string' || !query.trim()) {
    return 'Please describe the legal situation before submitting.';
  }

  if (query.trim().length > MAX_QUERY_LENGTH) {
    return `Please keep the query within ${MAX_QUERY_LENGTH} characters.`;
  }

  const guidanceMessage = getLegalQueryGuidanceMessage(query);

  if (guidanceMessage) {
    return guidanceMessage;
  }

  return null;
}
