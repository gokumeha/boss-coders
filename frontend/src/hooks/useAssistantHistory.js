import { useEffect, useState } from 'react';

import { fetchAssistantHistory } from '../services/firestore';

export function useAssistantHistory(user) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      if (!user?.uid) {
        setItems([]);
        return;
      }

      setLoading(true);

      try {
        const nextItems = await fetchAssistantHistory(user.uid);

        if (active) {
          setItems(nextItems);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      active = false;
    };
  }, [user?.uid]);

  return {
    items,
    loading,
  };
}
