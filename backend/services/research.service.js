import { buildEcourtsSupport } from './ecourts.service.js';
import {
  getIndianKanoonStatus,
  searchIndianKanoon,
} from './indiankanoon.service.js';

export function getResearchProviderStatus() {
  return {
    indiankanoon: getIndianKanoonStatus(),
    ecourts: {
      configured: true,
      mode: 'official-portal-adapter',
    },
  };
}

export async function runResearchSearch({ source, query }) {
  if (source === 'indiankanoon') {
    return {
      source,
      ...(await searchIndianKanoon(query)),
    };
  }

  if (source === 'ecourts') {
    return {
      source,
      ...(await buildEcourtsSupport(query)),
    };
  }

  return {
    source,
    status: 'unsupported',
    message: `Unsupported research source: ${source}`,
  };
}
