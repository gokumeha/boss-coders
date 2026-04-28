import { GoogleGenerativeAI } from '@google/generative-ai';

import {
  analyzeCategoryFit,
  analyzeLegalQuery,
  getLegalQueryGuidanceMessage,
} from '../../shared/legalContract.js';
import { CATEGORIES, LEGAL_CATEGORY_MAP } from '../../shared/siteContent.js';
import { formatLegalResponse } from '../utils/formatter.js';

let geminiModel = null;

function getGeminiModel() {
  if (geminiModel) {
    return geminiModel;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  return geminiModel;
}

function parseModelJson(rawText) {
  const jsonText = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  try {
    return JSON.parse(jsonText);
  } catch {
    console.error('[gemini] Could not parse model response:', rawText.slice(0, 200));
    return null;
  }
}

function buildCategoryValidationPrompt({ selectedCategory, query }) {
  const categoryOptions = CATEGORIES.map(
    (category) => `${category.id}: ${category.title} (${category.shortDescription})`,
  ).join('\n');

  return `You are classifying an Indian legal narrative into the single best legal category.

Selected category: ${selectedCategory}

Available categories:
${categoryOptions}

Citizen narrative: "${query}"

Respond with valid JSON only:
{
  "matchesSelectedCategory": true,
  "bestCategoryId": "property|labour|consumer|domestic|police|cyber",
  "reason": "one short explanation"
}

Rules:
- Choose the single best category for the core grievance.
- Mark matchesSelectedCategory false if the selected category is not the best fit.
- Focus on the main dispute, not incidental words.
- Do not add markdown or extra text.`;
}

function buildPrompt({ categoryId, categoryTitle, language, query }) {
  return `You are NyayaSaathi, an Indian legal guidance assistant.
You must answer only about real legal situations from India.

Selected category id: ${categoryId}
Category: ${categoryTitle}
Language: ${language}
Citizen query: "${query}"

If the text is clearly not a legal question, is unrelated content such as song lyrics, or is random text, respond with only:
{"error":"Please ask about a real legal problem or enquiry."}

Otherwise respond with valid JSON only using this shape:
{
  "summary": "2-3 sentence plain-language summary",
  "rightsList": ["right 1", "right 2", "right 3"],
  "laws": ["law 1", "law 2"],
  "steps": ["step 1", "step 2", "step 3", "step 4"],
  "urgency": "low|medium|high",
  "authority": "best authority to approach first",
  "draft": "formal complaint draft written in first person from the victim or complainant point of view",
  "helplines": [{"name":"name","number":"number or website"}]
}

Rules:
- Stay strictly within the selected category.
- Write the complaint draft in first person using "I" and "my".
- The draft should sound like the affected person is submitting it.
- Keep the answer specific, practical, and grounded in Indian legal context.`;
}

async function getCategoryDecisionFromGemini({ selectedCategory, query }) {
  const model = getGeminiModel();
  if (!model) {
    return null;
  }

  const result = await model.generateContent(
    buildCategoryValidationPrompt({ selectedCategory, query }),
  );
  const rawText = result.response.text().trim();
  const parsed = parseModelJson(rawText);

  if (!parsed || !parsed.bestCategoryId) {
    return null;
  }

  return parsed;
}

async function getLegalGuidanceFromGemini({ categoryId, categoryTitle, language, query }) {
  const model = getGeminiModel();
  if (!model) {
    return null;
  }

  const result = await model.generateContent(
    buildPrompt({ categoryId, categoryTitle, language, query }),
  );
  const rawText = result.response.text().trim();
  const parsed = parseModelJson(rawText);

  if (!parsed) {
    return null;
  }

  if (parsed.error) {
    const error = new Error(parsed.error);
    error.statusCode = 422;
    throw error;
  }

  return parsed;
}

const LANGUAGE_INTROS = Object.freeze({
  English: 'Preferred language: English.',
  Hindi: 'Preferred language: Hindi.',
  Kannada: 'Preferred language: Kannada.',
  Tamil: 'Preferred language: Tamil.',
  Telugu: 'Preferred language: Telugu.',
  Bengali: 'Preferred language: Bengali.',
  Marathi: 'Preferred language: Marathi.',
});

const MOCK_GUIDANCE_BY_CATEGORY = {
  property: {
    summary:
      'Property disputes usually depend on written proof such as rent agreements, payment records, notices, or land documents. Quick documentation often matters more than verbal assurances.',
    rightsList: [
      'You can demand written settlement of deposits, rent dues, or possession disputes.',
      'You can send a legal notice before approaching the Rent Controller or civil forum.',
      'You can rely on tenancy documents, bank transfers, and possession evidence as supporting proof.',
    ],
    laws: [
      'Transfer of Property Act',
      'Applicable state rent-control rules',
      'Indian Evidence Act',
    ],
    steps: [
      'Collect the agreement, receipts, bank records, and chats with the opposite party.',
      'Send a dated written demand asking for resolution within a clear deadline.',
      'Approach the Rent Controller, local civil forum, or district legal services authority if the issue continues.',
      'Preserve proof of possession, keys handover, and inspection notes.',
    ],
    urgency: 'medium',
    authority:
      'Start with the local Rent Controller or civil dispute forum, and use the District Legal Services Authority for free legal aid if needed.',
    helplines: [
      { name: 'District Legal Services Authority', number: 'Visit the district court legal aid desk' },
      { name: 'NALSA', number: '15100 / nalsa.gov.in' },
    ],
  },
  labour: {
    summary:
      'Salary and termination disputes become much stronger when attendance, payslips, offer letters, and work messages are preserved. Labour complaints can often move faster than civil claims.',
    rightsList: [
      'You can demand unpaid wages and written settlement of dues.',
      'You can complain about wrongful termination or statutory benefit violations.',
      'You can approach the Labour Department even without a private lawyer.',
    ],
    laws: ['Code on Wages', 'Industrial dispute framework', 'EPF and ESI compliance rules'],
    steps: [
      'Keep salary slips, attendance logs, offer letters, and work messages.',
      'Write to the employer seeking payment or reasons for termination in writing.',
      'File a complaint with the Labour Commissioner or Labour Officer.',
      'Ask the legal-aid desk for help if conciliation or documentation feels overwhelming.',
    ],
    urgency: 'high',
    authority:
      'Approach the Labour Commissioner or Labour Officer in your district with a written complaint and employer details.',
    helplines: [
      { name: 'State Labour Department', number: 'Use the district labour office helpline' },
      { name: 'NALSA', number: '15100 / nalsa.gov.in' },
    ],
  },
  consumer: {
    summary:
      'Consumer disputes are strongest when invoices, screenshots, support tickets, and refund promises are documented. Many matters can be escalated without going to court immediately.',
    rightsList: [
      'You can seek replacement, refund, or compensation for deficiency in service.',
      'You can escalate misleading advertisements, non-delivery, or overcharging complaints.',
      'You can approach the consumer commission with documentary proof.',
    ],
    laws: ['Consumer Protection Act, 2019', 'E-commerce rules', 'Indian Evidence Act'],
    steps: [
      'Keep the invoice, payment proof, screenshots, and support-ticket references.',
      'Send a formal refund or rectification demand to the seller or platform.',
      'Escalate to the National Consumer Helpline for early intervention.',
      'If unresolved, file before the District Consumer Disputes Redressal Commission.',
    ],
    urgency: 'medium',
    authority:
      'Start with the National Consumer Helpline and move to the District Consumer Commission if the seller does not respond.',
    helplines: [{ name: 'National Consumer Helpline', number: '1915 / consumerhelpline.gov.in' }],
  },
  domestic: {
    summary:
      'Domestic violence matters should be treated as safety issues first and documentation issues second. Immediate danger, shelter, and protection orders should be prioritized.',
    rightsList: [
      'You can seek protection, residence support, maintenance, and emergency assistance.',
      'You can ask for help from the Protection Officer, police, or women helpline without family approval.',
      'You can preserve medical, message, and witness evidence for stronger protection orders.',
    ],
    laws: [
      'Protection of Women from Domestic Violence Act',
      'Relevant criminal law provisions',
      'Victim-support and shelter schemes',
    ],
    steps: [
      'Move to a safe place immediately if violence is ongoing or escalating.',
      'Contact the women helpline, Protection Officer, or nearby police station for urgent support.',
      'Preserve photos, medical papers, chats, and witness details.',
      'Seek a protection order and maintenance support through the magistrate process or legal-aid desk.',
    ],
    urgency: 'high',
    authority:
      'Contact the Women Helpline, local Protection Officer, or police station immediately if there is ongoing risk.',
    helplines: [
      { name: "Women's Helpline", number: '181' },
      { name: 'Emergency Response', number: '112' },
    ],
  },
  police: {
    summary:
      'Police or FIR-related issues often depend on whether the complaint was refused, delayed, or mishandled. A clear written timeline is crucial for escalation.',
    rightsList: [
      'You can insist on registration of a cognizable offence complaint as an FIR.',
      'You can escalate refusal to senior police officers or the magistrate.',
      'You can request acknowledgement of written complaints and keep diary-entry proof.',
    ],
    laws: [
      'Criminal procedure provisions governing FIR and investigation',
      'Victim-rights principles for refusal to register complaints',
      'Magisterial remedies for police inaction',
    ],
    steps: [
      'Write down the incident timeline, people involved, and immediate evidence.',
      'Submit a written complaint at the police station and ask for acknowledgement.',
      'If the FIR is refused, escalate to the Superintendent of Police or official grievance channels.',
      'Approach the magistrate or legal-aid desk if the complaint still goes nowhere.',
    ],
    urgency: 'high',
    authority:
      'Begin with the Station House Officer, then escalate to the Superintendent of Police or magistrate if the complaint is not registered properly.',
    helplines: [
      { name: 'Police Emergency', number: '112' },
      { name: 'State Police Grievance Portal', number: 'Use the relevant state online portal' },
    ],
  },
  cyber: {
    summary:
      'Cyber-crime matters are time sensitive because transactions, accounts, and device logs can change quickly. Fast reporting improves the chance of freezing funds or preserving data.',
    rightsList: [
      'You can report cyber fraud immediately and seek account-freeze support from the bank.',
      'You can preserve screenshots, transaction IDs, device logs, and phishing messages as evidence.',
      'You can escalate to cyber police and the affected bank or platform in parallel.',
    ],
    laws: ['Information Technology Act', 'Banking complaint channels', 'Criminal procedure provisions'],
    steps: [
      'Report the fraud immediately at the cyber-crime portal and call the hotline if money is at risk.',
      'Inform the bank or wallet provider and ask for transaction freeze or reversal support.',
      'Capture screenshots, UPI IDs, phone numbers, emails, and timestamps.',
      'File or escalate the complaint with the cyber police station and keep the acknowledgement.',
    ],
    urgency: 'high',
    authority:
      'Use the National Cyber Crime Portal and 1930 helpline immediately, then coordinate with the bank and local cyber police.',
    helplines: [
      { name: 'Cyber Crime Helpline', number: '1930' },
      { name: 'National Cyber Crime Portal', number: 'cybercrime.gov.in' },
    ],
  },
};

function buildDraft({ categoryTitle, language, query }) {
  const shortFacts = query.replace(/\s+/g, ' ').trim().slice(0, 240);

  return `To,
The Concerned Authority

Subject: Complaint regarding ${categoryTitle}

${LANGUAGE_INTROS[language] || LANGUAGE_INTROS.English}

Respected Sir/Madam,

I am writing to submit this complaint regarding the following issue affecting me:
${shortFacts}

I request that my complaint be reviewed and that appropriate legal action or administrative support be provided at the earliest.

Please acknowledge receipt of this complaint and inform me of the next steps.

Sincerely,
[FULL NAME]
[ADDRESS]
[PHONE]
[DATE]`;
}

function getMockGuidance({ category, language, query }) {
  const categoryConfig = MOCK_GUIDANCE_BY_CATEGORY[category];
  const categoryTitle = LEGAL_CATEGORY_MAP[category]?.title || 'Legal Issue';
  const shortIssue = query.replace(/\s+/g, ' ').trim().slice(0, 140);

  return {
    ...categoryConfig,
    summary: `${categoryConfig.summary} Issue noted: "${shortIssue}".`,
    rights: categoryConfig.rightsList.join(' '),
    draft: buildDraft({ categoryTitle, language, query }),
  };
}

function buildMismatchResponse({ selectedCategory, suggestedCategory, reason }) {
  const selectedTitle = LEGAL_CATEGORY_MAP[selectedCategory]?.title || selectedCategory;
  const suggestedTitle = LEGAL_CATEGORY_MAP[suggestedCategory]?.title || suggestedCategory;

  return {
    resultType: 'mismatch',
    selectedCategory,
    selectedCategoryTitle: selectedTitle,
    suggestedCategory,
    suggestedCategoryTitle: suggestedTitle,
    summary: `This situation does not appear to match the selected category: ${selectedTitle}.`,
    message: `${reason} The facts appear to fit ${suggestedTitle} better.`,
  };
}

export async function getLegalGuidance({ category, language, query }) {
  const categoryTitle = LEGAL_CATEGORY_MAP[category]?.title || 'Legal Issue';
  const isDev = process.env.NODE_ENV !== 'production';
  const analysis = analyzeLegalQuery(query);

  if (!analysis.isMeaningful) {
    const error = new Error(
      getLegalQueryGuidanceMessage(query) ||
        'Please describe your actual legal situation clearly so we can provide relevant guidance.',
    );
    error.statusCode = 422;
    throw error;
  }

  const heuristicCategoryFit = analyzeCategoryFit(query, category);
  let geminiCategoryDecision = null;

  try {
    geminiCategoryDecision = await getCategoryDecisionFromGemini({
      selectedCategory: category,
      query,
    });

    if (
      geminiCategoryDecision &&
      geminiCategoryDecision.matchesSelectedCategory === false &&
      geminiCategoryDecision.bestCategoryId &&
      geminiCategoryDecision.bestCategoryId !== category
    ) {
      return buildMismatchResponse({
        selectedCategory: category,
        suggestedCategory: geminiCategoryDecision.bestCategoryId,
        reason:
          geminiCategoryDecision.reason ||
          'The main grievance in the paragraph points to a different legal category.',
      });
    }
  } catch (error) {
    console.error('[gemini] Category validation error, falling back to heuristic:', error.message);
  }

  if (
    !geminiCategoryDecision &&
    heuristicCategoryFit.hasDetectedCategory &&
    !heuristicCategoryFit.isMatch &&
    heuristicCategoryFit.bestCategory &&
    heuristicCategoryFit.bestCategory !== category
  ) {
    return buildMismatchResponse({
      selectedCategory: category,
      suggestedCategory: heuristicCategoryFit.bestCategory,
      reason:
        'The main issue described in the paragraph points to another legal category based on the facts provided.',
    });
  }

  try {
    const geminiResult = await getLegalGuidanceFromGemini({
      categoryId: category,
      categoryTitle,
      language,
      query,
    });

    if (geminiResult) {
      if (isDev) {
        console.log('[gemini] Response received for category:', category);
      }

      return formatLegalResponse({
        resultType: 'guidance',
        ...geminiResult,
        rights: Array.isArray(geminiResult.rightsList)
          ? geminiResult.rightsList.join(' ')
          : geminiResult.rights || '',
      });
    }
  } catch (error) {
    if (error.statusCode === 422) {
      throw error;
    }

    console.error('[gemini] Error, falling back to mock:', error.message);
  }

  if (isDev) {
    console.log('[mock-ai] Generating fallback response for category:', category);
  }

  return formatLegalResponse({
    resultType: 'guidance',
    ...getMockGuidance({ category, language, query }),
  });
}
