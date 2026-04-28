import { useMemo } from 'react';

import AppForm from '../components/AppForm';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useApi } from '../hooks/useApi';
import { useAssistantHistory } from '../hooks/useAssistantHistory';
import { useForm } from '../hooks/useForm';
import { saveAssistantHistory } from '../services/firestore';

export default function AssistantPage() {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const form = useForm(language);
  const { result, loading, error, submitLegalQuery, clearResult, clearError } = useApi();
  const { items, loading: historyLoading } = useAssistantHistory(user);

  const historyItems = useMemo(() => items || [], [items]);

  async function handleSubmit(payload) {
    const response = await submitLegalQuery(payload);

    if (user?.uid) {
      await saveAssistantHistory({
        userId: user.uid,
        payload,
        result: response,
      });
    }
  }

  function handleReset() {
    clearResult();
    form.resetForm();
  }

  return (
    <div className="page-stack">
      <AppForm
        error={error}
        form={form}
        historyItems={historyItems}
        historyLoading={historyLoading}
        loading={loading}
        onFieldChange={clearError}
        onLanguageChange={setLanguage}
        onReset={handleReset}
        onSubmit={handleSubmit}
        result={result}
      />
    </div>
  );
}
