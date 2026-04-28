import { validateLegalQueryPayload } from '../../shared/legalContract.js';
import { getLegalGuidance } from '../services/ai.service.js';

export async function postLegalQuery(request, response, next) {
  try {
    const validationError = validateLegalQueryPayload(request.body);

    if (validationError) {
      response.status(400).json({ message: validationError });
      return;
    }

    const legalGuidance = await getLegalGuidance(request.body);

    response.status(200).json(legalGuidance);
  } catch (error) {
    next(error);
  }
}

