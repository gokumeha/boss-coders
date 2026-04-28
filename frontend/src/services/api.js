const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Cannot reach the backend at ${API_BASE_URL}. Start the backend server in the backend folder with "node server.js".`,
      );
    }

    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'The server request failed.');
  }

  return data;
}

export function postLegalQuery(payload) {
  return request('/api/legal-query', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function searchResearch(payload) {
  return request('/api/research/search', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchResearchStatus() {
  return request('/api/research/status');
}
