import { validateLegalQueryPayload } from '../../shared/legalContract.js';
import { getLegalGuidance } from '../services/ai.service.js';
import { buildEcourtsSupport } from '../services/ecourts.service.js';
import { searchIndianKanoon } from '../services/indiankanoon.service.js';

export async function postLegalQuery(request, response, next) {
  try {
    const validationError = validateLegalQueryPayload(request.body);

    if (validationError) {
      response.status(400).json({ message: validationError });
      return;
    }

    const legalGuidance = await getLegalGuidance(request.body);

    if (legalGuidance.resultType === 'mismatch') {
      response.status(200).json(legalGuidance);
      return;
    }

    const [indianKanoon, ecourts] = await Promise.all([
      searchIndianKanoon(request.body.query),
      buildEcourtsSupport(request.body.query),
    ]);

    response.status(200).json({
      ...legalGuidance,
      research: {
        indiankanoon: indianKanoon,
        ecourts,
      },
    });
  } catch (error) {
    next(error);
  }
}
