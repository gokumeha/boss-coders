import { CATEGORIES, SUPPORTED_LANGUAGES } from './siteContent.js';

export const MAX_QUERY_LENGTH = 1200;
export const URGENCY_LEVELS = ['low', 'medium', 'high'];

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

  return null;
}

