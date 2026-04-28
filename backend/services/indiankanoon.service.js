const INDIAN_KANOON_BASE_URL = 'https://api.indiankanoon.org';

function getToken() {
  return process.env.IK_API_TOKEN || '';
}

export function getIndianKanoonStatus() {
  return {
    configured: Boolean(getToken()),
    requiresToken: true,
  };
}

export async function searchIndianKanoon(query) {
  const token = getToken();

  if (!token) {
    return {
      status: 'unconfigured',
      message:
        'Indian Kanoon search is wired, but IK_API_TOKEN is not configured on the server yet.',
      documents: [],
    };
  }

  const url = new URL('/search/', INDIAN_KANOON_BASE_URL);
  url.searchParams.set('formInput', query);
  url.searchParams.set('pagenum', '0');

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    return {
      status: 'error',
      message: `Indian Kanoon request failed with ${response.status}.`,
      details: body.slice(0, 240),
      documents: [],
    };
  }

  const data = await response.json();
  const documents = Array.isArray(data.docs)
    ? data.docs.slice(0, 5).map((document) => ({
        id: document.tid,
        title: document.title,
        headline: document.headline,
        source: document.docsource,
        link: `https://indiankanoon.org/doc/${document.tid}/`,
      }))
    : [];

  return {
    status: 'ok',
    message:
      documents.length > 0
        ? 'Indian Kanoon results loaded.'
        : 'No Indian Kanoon results matched this search.',
    documents,
  };
}

