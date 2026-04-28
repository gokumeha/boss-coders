import { useEffect, useState } from 'react';

import { MAX_QUERY_LENGTH } from '@shared/legalContract';
import { SUPPORTED_LANGUAGES } from '@shared/siteContent';

function buildSteps({ category, language, query, hasResult }) {
  const baseSteps = [
    { label: 'Category', complete: Boolean(category) },
    { label: 'Language', complete: Boolean(category) && Boolean(language) },
    {
      label: 'Describe',
      complete: Boolean(category) && Boolean(language) && Boolean(query.trim()),
    },
    { label: 'Guidance', complete: hasResult },
  ];

  let activeAssigned = false;

  return baseSteps.map((step, index) => {
    if (step.complete) {
      return {
        id: String(index + 1),
        label: step.label,
        state: 'done',
      };
    }

    if (!activeAssigned) {
      activeAssigned = true;
      return {
        id: String(index + 1),
        label: step.label,
        state: 'active',
      };
    }

    return {
      id: String(index + 1),
      label: step.label,
      state: 'upcoming',
    };
  });
}

export function useForm(initialLanguage = SUPPORTED_LANGUAGES[0].value) {
  const defaultLanguage = initialLanguage || SUPPORTED_LANGUAGES[0].value;
  const [language, setLanguage] = useState(defaultLanguage);
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');

  function updateQuery(nextQuery) {
    setQuery(nextQuery.slice(0, MAX_QUERY_LENGTH));
  }

  function buildPayload() {
    return {
      category,
      language,
      query: query.trim(),
    };
  }

  function resetForm() {
    setLanguage(defaultLanguage);
    setCategory('');
    setQuery('');
  }

  useEffect(() => {
    setLanguage(defaultLanguage);
  }, [defaultLanguage]);

  return {
    category,
    setCategory,
    language,
    setLanguage,
    query,
    setQuery: updateQuery,
    charCount: query.length,
    maxQueryLength: MAX_QUERY_LENGTH,
    isSubmittable: Boolean(category && query.trim()),
    buildPayload,
    resetForm,
    getSteps: (hasResult) =>
      buildSteps({
        category,
        language,
        query,
        hasResult,
      }),
  };
}
