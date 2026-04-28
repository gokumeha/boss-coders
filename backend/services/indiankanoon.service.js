const INDIAN_KANOON_BASE_URL = 'https://api.indiankanoon.org';
const INDIAN_KANOON_PUBLIC_URL = 'https://indiankanoon.org';

function getToken() {
  return process.env.IK_API_TOKEN || '';
}

function buildPublicSearchUrl(query) {
  const url = new URL('/search/', INDIAN_KANOON_PUBLIC_URL);
  url.searchParams.set('formInput', query);
  return url.toString();
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
      status: 'public-search-fallback',
      message:
        'Direct Indian Kanoon results are not configured on the server yet, so you can continue with the public Indian Kanoon search page.',
      documents: [],
      portalUrl: buildPublicSearchUrl(query),
      portalLabel: 'Open Indian Kanoon search',
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
      status: 'public-search-fallback',
      message: `Live Indian Kanoon API results were unavailable, so the public Indian Kanoon search page is ready instead.`,
      details: body.slice(0, 240),
      documents: [],
      portalUrl: buildPublicSearchUrl(query),
      portalLabel: 'Open Indian Kanoon search',
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
