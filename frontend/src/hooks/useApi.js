import { useState } from 'react';

import { postLegalQuery } from '../services/api';

export function useApi() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submitLegalQuery(payload) {
    setLoading(true);
    setError('');
    setResult(null);

    if (import.meta.env.DEV) {
      console.log('[frontend] submitting legal query', payload);
    }

    try {
      const response = await postLegalQuery(payload);
      setResult(response);
      return response;
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : 'Something went wrong. Please try again.';
      setError(message);
      throw submissionError;
    } finally {
      setLoading(false);
    }
  }

  function clearResult() {
    setResult(null);
    setError('');
  }

  return {
    result,
    loading,
    error,
    submitLegalQuery,
    clearResult,
  };
}

