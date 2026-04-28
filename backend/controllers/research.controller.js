import {
  getResearchProviderStatus,
  runResearchSearch,
} from '../services/research.service.js';

export async function getResearchStatus(_request, response, next) {
  try {
    response.status(200).json(getResearchProviderStatus());
  } catch (error) {
    next(error);
  }
}

export async function postResearchSearch(request, response, next) {
  try {
    const { source, query } = request.body || {};

    if (!source || !query || typeof query !== 'string' || !query.trim()) {
      response.status(400).json({
        message: 'Please send a valid source and query for research.',
      });
      return;
    }

    const result = await runResearchSearch({
      source,
      query: query.trim(),
    });

    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

