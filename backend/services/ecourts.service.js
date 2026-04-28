const ECOURTS_PORTAL_URL = 'https://services.ecourts.gov.in/ecourtindia_v6/';

function looksLikeCnr(query) {
  return /^[A-Za-z0-9]{16}$/u.test(query.replace(/\s+/g, ''));
}

export async function buildEcourtsSupport(query) {
  const normalizedQuery = query.trim();

  return {
    status: 'official-portal',
    portalUrl: ECOURTS_PORTAL_URL,
    note:
      'A stable public eCourts API contract was not found, so this integration uses official public search pathways and search-mode guidance.',
    recommendedMode: looksLikeCnr(normalizedQuery) ? 'CNR Search' : 'Party Name or Case Number Search',
    searchModes: [
      'CNR Search',
      'Party Name Search',
      'Case Number Search',
      'Filing Number Search',
      'FIR Number Search',
    ],
  };
}

