import { LEGAL_CATEGORY_MAP } from '../../shared/siteContent.js';
import { formatLegalResponse } from '../utils/formatter.js';

const LANGUAGE_INTROS = {
  English: 'Preferred language: English.',
  Hindi: 'Preferred language: Hindi.',
  Kannada: 'Preferred language: Kannada.',
  Tamil: 'Preferred language: Tamil.',
  Telugu: 'Preferred language: Telugu.',
  Bengali: 'Preferred language: Bengali.',
  Marathi: 'Preferred language: Marathi.',
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

  return `To,
The Concerned Authority

Subject: Complaint regarding ${categoryTitle}

${LANGUAGE_INTROS[language] || LANGUAGE_INTROS.English}

Respected Sir/Madam,

I am submitting this complaint regarding the following issue:
${shortFacts}

I request that the matter be reviewed and that appropriate legal action or administrative support be provided at the earliest.

Please acknowledge receipt of this complaint and inform me of the next steps.

Sincerely,
[FULL NAME]
[ADDRESS]
[PHONE]
[DATE]`;
}

export async function getLegalGuidance({ category, language, query }) {
  const categoryConfig = MOCK_GUIDANCE_BY_CATEGORY[category];
  const categoryTitle = LEGAL_CATEGORY_MAP[category]?.title || 'Legal Issue';
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    console.log('[mock-ai] Generating response', {
      category,
      language,
      queryLength: query.trim().length,
    });
  }

  const personalizedSummary = `${categoryConfig.summary} Issue noted: "${query
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 140)}".`;

  return formatLegalResponse({
    ...categoryConfig,
    summary: personalizedSummary,
    rights: categoryConfig.rightsList.join(' '),
    draft: buildDraft({
      categoryTitle,
      language,
      query,
    }),
  });
}
