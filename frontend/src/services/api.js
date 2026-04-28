const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function postLegalQuery(payload) {
  const response = await fetch(`${API_BASE_URL}/api/legal-query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || 'Unable to fetch legal guidance right now.';
    throw new Error(message);
  }

  return data;
}

