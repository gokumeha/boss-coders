import { GoogleGenerativeAI } from '@google/generative-ai';
import { LEGAL_CATEGORY_MAP } from '../../shared/siteContent.js';
import { formatLegalResponse } from '../utils/formatter.js';

// ---------------------------------------------------------------------------
// Gemini client (lazy – only created when a key is present)
// ---------------------------------------------------------------------------
let geminiModel = null;

function getGeminiModel() {
  if (geminiModel) return geminiModel;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const genAI = new GoogleGenerativeAI(apiKey);
  geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  return geminiModel;
}

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------
function buildPrompt({ categoryTitle, language, query }) {
  return `You are NyayaSaathi, an Indian legal guidance assistant. A citizen has described a real legal situation and you must analyse it carefully and provide accurate, actionable guidance in ${language}.

Category: ${categoryTitle}
Citizen's situation: "${query}"

IMPORTANT: If the input above is gibberish, random characters, or clearly not a real legal situation, respond ONLY with this exact JSON and nothing else:
{"error": "Please describe your actual legal situation in order to receive guidance."}

Otherwise, respond ONLY with a valid JSON object (no markdown, no code fences) with these exact keys:
{
  "summary": "2-3 sentence plain-language summary of the situation and what matters most",
  "rightsList": ["right 1", "right 2", "right 3"],
  "laws": ["relevant Indian law 1", "relevant Indian law 2"],
  "steps": ["action step 1", "action step 2", "action step 3", "action step 4"],
  "urgency": "low|medium|high",
  "authority": "which authority / office to approach first",
  "draft": "a short formal complaint letter draft addressed to the relevant authority",
  "helplines": [{"name": "helpline name", "number": "number or website"}]
}

Base your answer strictly on Indian law. Be specific to the situation described. Respond in ${language}.`;
}

// ---------------------------------------------------------------------------
// Gibberish / validity detection (basic heuristic as second safety net)
// ---------------------------------------------------------------------------
function looksLikeGibberish(query) {
  const cleaned = query.trim().toLowerCase();

  // Too short to be a real description
  if (cleaned.length < 15) return true;

  // Almost entirely non-alphabetic
  const alphaChars = (cleaned.match(/[a-z\u0900-\u097f\u0c00-\u0c7f\u0b80-\u0bff\u0980-\u09ff\u0c80-\u0cff]/g) || []).length;
  if (alphaChars / cleaned.length < 0.4) return true;

  // No spaces at all for long strings (unlikely to be real sentences)
  if (cleaned.length > 20 && !cleaned.includes(' ')) return true;

  // Repeated character pattern (aaaaaaa, fvfwww)
  if (/(.)\1{4,}/.test(cleaned)) return true;

  return false;
}

// ---------------------------------------------------------------------------
// Gemini-powered guidance
// ---------------------------------------------------------------------------
async function getLegalGuidanceFromGemini({ categoryTitle, language, query }) {
  const model = getGeminiModel();
  if (!model) return null; // No key configured – fall through to mock

  const prompt = buildPrompt({ categoryTitle, language, query });
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code fences if Gemini wraps the JSON
  const jsonText = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    console.error('[gemini] Failed to parse JSON response:', text.slice(0, 200));
    return null;
  }

  // Gemini decided the query was gibberish / invalid
  if (parsed.error) {
    throw Object.assign(new Error(parsed.error), { statusCode: 422 });
  }

  return parsed;
}

// ---------------------------------------------------------------------------
// Mock fallback (category-based, used only when Gemini is not configured)
// ---------------------------------------------------------------------------
const LANGUAGE_INTROS = {
  English: 'Preferred language: English.',
  Hindi: 'पसंदीदा भाषा: हिंदी।',
  Kannada: 'ಆಯ್ಕೆಯ ಭಾಷೆ: ಕನ್ನಡ.',
  Tamil: 'விருப்ப மொழி: தமிழ்.',
  Telugu: 'ఎంచుకున్న భాష: తెలుగు.',
  Bengali: 'পছন্দের ভাষা: বাংলা।',
  Marathi: 'निवडलेली भाषा: मराठी.',
};

const LANGUAGE_SUMMARY_PREFIX = {
  English: 'Issue noted',
  Hindi: 'दर्ज की गई समस्या',
  Kannada: 'ದಾಖಲಾದ ಸಮಸ್ಯೆ',
  Tamil: 'பதிவுசெய்யப்பட்ட பிரச்சினை',
  Telugu: 'నమోదైన సమస్య',
  Bengali: 'নথিভুক্ত সমস্যা',
  Marathi: 'नोंदवलेली अडचण',
};

const MOCK_GUIDANCE_BY_CATEGORY = {
  property: {
    summary:
      'Property disputes usually depend on written proof such as rent agreements, payment records, notices, or land documents. Quick documentation often matters more than emotional phone calls.',
    rightsList: [
      'You can demand written settlement of deposits, rent dues, or possession disputes.',
      'You can send a legal notice before approaching the Rent Controller or civil forum.',
      'You can rely on tenancy documents, bank transfers, and possession evidence as supporting proof.',
    ],
    laws: [
      'Transfer of Property Act: governs landlord-tenant and possession issues.',
      'State rent-control rules: may protect tenants from unfair eviction or deposit disputes.',
      'Indian Evidence Act: documents, receipts, and messages help prove the timeline.',
    ],
    steps: [
      'Collect the agreement, receipts, bank records, and chats with the landlord or opposite party.',
      'Send a dated written demand asking for resolution within a clear deadline.',
      'If the issue continues, approach the Rent Controller, local civil lawyer desk, or district legal services authority.',
      'Preserve proof of possession, keys handover, and any property inspection notes.',
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
      'Wage and termination disputes become much stronger when attendance, salary slips, and work messages are preserved. Labour complaints can often move faster than civil claims.',
    rightsList: [
      'You can demand unpaid wages and written settlement of dues.',
      'You can complain about wrongful termination or statutory benefit violations.',
      'You can ask the Labour Department to intervene even without a private lawyer.',
    ],
    laws: [
      'Code on Wages: protects timely payment and wage recovery claims.',
      'Industrial Disputes framework: supports wrongful termination and reinstatement-related complaints.',
      'EPF and ESI rules: cover social-security deductions and benefits.',
    ],
    steps: [
      'Keep salary slips, attendance logs, offer letters, and messages from the employer.',
      'Write to the employer seeking payment or reasons for termination in writing.',
      'File a complaint with the local Labour Commissioner or Labour Officer.',
      'Ask the legal-aid desk for help if conciliation or documentation feels overwhelming.',
    ],
    urgency: 'high',
    authority:
      'Approach the Labour Commissioner or Labour Officer in your district and keep a written complaint ready with employer details.',
    helplines: [
      { name: 'State Labour Department', number: 'Use the district labour office helpline' },
      { name: 'NALSA', number: '15100 / nalsa.gov.in' },
    ],
  },
  consumer: {
    summary:
      'Consumer matters are strongest when invoices, screenshots, support tickets, and refund promises are documented. Many disputes can be escalated without going to a full court immediately.',
    rightsList: [
      'You can seek replacement, refund, or compensation for deficiency in service.',
      'You can escalate misleading advertisements or overcharging complaints.',
      'You can approach the consumer commission with documentary proof.',
    ],
    laws: [
      'Consumer Protection Act, 2019: covers unfair trade practices and service deficiency.',
      'E-commerce rules: useful for online marketplace disputes and missing seller disclosures.',
      'Evidence records: invoices, chats, and screenshots help prove the complaint.',
    ],
    steps: [
      'Keep the invoice, payment proof, screenshots, and support-ticket references.',
      'Send a formal refund or rectification demand to the seller or platform.',
      'Escalate to the National Consumer Helpline for early intervention.',
      'If unresolved, file before the District Consumer Disputes Redressal Commission.',
    ],
    urgency: 'medium',
    authority:
      'Start with the National Consumer Helpline and then move to the District Consumer Commission if the seller does not respond.',
    helplines: [
      { name: 'National Consumer Helpline', number: '1915 / consumerhelpline.gov.in' },
    ],
  },
  domestic: {
    summary:
      'Domestic violence matters should be treated as safety issues first and documentation issues second. Immediate danger, shelter, and protection orders should be prioritized.',
    rightsList: [
      'You can seek protection, residence support, maintenance, and emergency assistance.',
      'You can ask for help from the Protection Officer, police, or women helpline without waiting for family approval.',
      'You can preserve medical, message, and witness evidence for stronger protection orders.',
    ],
    laws: [
      'Protection of Women from Domestic Violence Act: enables protection, residence, maintenance, and custody relief.',
      'Criminal law provisions may apply where assault, intimidation, or dowry-related abuse is involved.',
      'Victim-support schemes can help with shelter and emergency services.',
    ],
    steps: [
      'Move to a safe place immediately if violence is ongoing or escalating.',
      'Contact the women helpline, Protection Officer, or nearby police station for urgent support.',
      'Preserve photos, medical papers, chats, and witness details.',
      'Seek a protection order and maintenance support through the magistrate process or legal-aid desk.',
    ],
    urgency: 'high',
    authority:
      'Contact the Women Helpline, local Protection Officer, or police station immediately if there is ongoing risk. Legal-aid cells can assist with filing.',
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
      'Code of Criminal Procedure and Bharatiya Nagarik Suraksha Sanhita provisions govern FIR and investigation procedures.',
      'Victim-rights principles support escalation where the police refuse to register a complaint.',
      'Judicial remedies may be available through the magistrate if police inaction continues.',
    ],
    steps: [
      'Write down the incident timeline, people involved, and any immediate evidence.',
      'Submit a written complaint at the police station and ask for acknowledgement.',
      'If the FIR is refused, escalate to the Superintendent of Police or online grievance channels.',
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
      'You can escalate both to cyber police and platform support instead of relying on one channel alone.',
    ],
    laws: [
      'Information Technology Act: supports offences involving digital fraud and unauthorized access.',
      'Banking and RBI complaint channels may help in UPI and payment fraud situations.',
      'Criminal procedure rules apply when formal police investigation is required.',
    ],
    steps: [
      'Report the fraud immediately at the cyber-crime portal and call the hotline if money is at risk.',
      'Inform the bank or wallet provider and ask for transaction freeze or reversal support.',
      'Capture screenshots, UPI IDs, phone numbers, emails, and timestamps.',
      'File or escalate the complaint with the cyber police station and keep the acknowledgement.',
    ],
    urgency: 'high',
    authority:
      'Use the National Cyber Crime Portal and 1930 hotline immediately, then coordinate with the bank and the local cyber police unit.',
    helplines: [
      { name: 'Cyber Crime Helpline', number: '1930' },
      { name: 'National Cyber Crime Portal', number: 'cybercrime.gov.in' },
    ],
  },
};

function buildDraft({ categoryTitle, language, query }) {
  const shortFacts = query.replace(/\s+/g, ' ').trim().slice(0, 240);
  return `To,\nThe Concerned Authority\n\nSubject: Complaint regarding ${categoryTitle}\n\n${LANGUAGE_INTROS[language] || LANGUAGE_INTROS.English}\n\nRespected Sir/Madam,\n\nI am submitting this complaint regarding the following issue:\n${shortFacts}\n\nI request that the matter be reviewed and that appropriate legal action or administrative support be provided at the earliest.\n\nPlease acknowledge receipt of this complaint and inform me of the next steps.\n\nSincerely,\n[FULL NAME]\n[ADDRESS]\n[PHONE]\n[DATE]`;
}

function getMockGuidance({ category, language, query }) {
  const categoryConfig = MOCK_GUIDANCE_BY_CATEGORY[category];
  const categoryTitle = LEGAL_CATEGORY_MAP[category]?.title || 'Legal Issue';
  const personalizedSummary = `${categoryConfig.summary} ${
    LANGUAGE_SUMMARY_PREFIX[language] || LANGUAGE_SUMMARY_PREFIX.English
  }: "${query.replace(/\s+/g, ' ').trim().slice(0, 140)}".`;

  return {
    ...categoryConfig,
    summary: personalizedSummary,
    rights: categoryConfig.rightsList.join(' '),
    draft: buildDraft({ categoryTitle, language, query }),
  };
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------
export async function getLegalGuidance({ category, language, query }) {
  const categoryTitle = LEGAL_CATEGORY_MAP[category]?.title || 'Legal Issue';
  const isDev = process.env.NODE_ENV !== 'production';

  // Basic gibberish guard (applies even without Gemini)
  if (looksLikeGibberish(query)) {
    const err = new Error('Please describe your actual legal situation clearly so we can provide relevant guidance.');
    err.statusCode = 422;
    throw err;
  }

  // Try Gemini first
  try {
    const geminiResult = await getLegalGuidanceFromGemini({ categoryTitle, language, query });
    if (geminiResult) {
      if (isDev) console.log('[gemini] Response received for category:', category);
      return formatLegalResponse({
        ...geminiResult,
        rights: Array.isArray(geminiResult.rightsList)
          ? geminiResult.rightsList.join(' ')
          : geminiResult.rights || '',
      });
    }
  } catch (error) {
    // Re-throw validation errors (gibberish detected by Gemini)
    if (error.statusCode === 422) throw error;
    // Log other Gemini errors and fall through to mock
    console.error('[gemini] Error, falling back to mock:', error.message);
  }

  // Fallback: mock data (only used when GEMINI_API_KEY is not set)
  if (isDev) console.log('[mock-ai] Generating fallback response for category:', category);
  return formatLegalResponse(getMockGuidance({ category, language, query }));
}
