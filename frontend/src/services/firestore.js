import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import { database, isFirebaseConfigured } from '../lib/firebase';

export async function saveAssistantHistory({ userId, payload, result }) {
  if (!isFirebaseConfigured || !database || !userId) {
    return;
  }

  await addDoc(collection(database, 'users', userId, 'assistantHistory'), {
    category: payload.category,
    language: payload.language,
    query: payload.query,
    summary: result.summary,
    urgency: result.urgency,
    createdAt: serverTimestamp(),
  });
}

export async function fetchAssistantHistory(userId) {
  if (!isFirebaseConfigured || !database || !userId) {
    return [];
  }

  const historyQuery = query(
    collection(database, 'users', userId, 'assistantHistory'),
    orderBy('createdAt', 'desc'),
    limit(5),
  );

  const snapshot = await getDocs(historyQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

