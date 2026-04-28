import { LEGAL_CATEGORY_MAP } from '@shared/siteContent';

const QUERY_EVIDENCE_CLUES = Object.freeze([
  {
    pattern: /\b(whatsapp|telegram|instagram|message|messages|sms|chat|dm)\b/i,
    label: 'WhatsApp chats, screenshots, and message exports',
  },
  {
    pattern: /\b(email|mail)\b/i,
    label: 'Complaint emails, replies, and delivery confirmations',
  },
  {
    pattern: /\b(invoice|bill|receipt|order|purchase)\b/i,
    label: 'Invoice, bill, order confirmation, and payment receipt',
  },
  {
    pattern: /\b(bank|upi|transaction|account|wallet|refund)\b/i,
    label: 'Bank statement, UPI reference number, and transaction IDs',
  },
  {
    pattern: /\b(call|phone|mobile|number)\b/i,
    label: 'Call logs and the phone numbers used during the dispute',
  },
  {
    pattern: /\b(rent|landlord|tenant|lease|deposit|eviction)\b/i,
    label: 'Rent agreement, deposit proof, notices, and possession records',
  },
  {
    pattern: /\b(salary|wages|payslip|employer|termination|pf|esi)\b/i,
    label: 'Payslips, bank credits, ID card, and employer communication',
  },
  {
    pattern: /\b(medical|injury|hospital|doctor|clinic)\b/i,
    label: 'Medical records, prescriptions, and injury photographs',
  },
  {
    pattern: /\b(photo|photos|video|videos|screenshot|screenshots|recording)\b/i,
    label: 'Photos, videos, and screenshots with timestamps',
  },
]);

const DRAFT_CONFIG = Object.freeze({
  property: {
    documentLabel: 'complaint letter',
    subjectPrefix: 'Complaint regarding ',
    fallbackRecipient: 'The Concerned Rent / Civil Authority',
    relief: [
      'acknowledge this complaint and review the dispute urgently',
      'direct the opposite party to respond in writing and resolve the issue',
      'record my documents and preserve the matter for further legal action if needed',
    ],
  },
  labour: {
    documentLabel: 'labour complaint',
    subjectPrefix: 'Complaint regarding ',
    fallbackRecipient: 'The Labour Commissioner / Labour Officer',
    relief: [
      'call for the employer response and preserve the wage or termination record',
      'direct payment of lawful dues or appropriate intervention under labour law',
      'guide me on the next conciliation or complaint step available',
    ],
  },
  consumer: {
    documentLabel: 'consumer complaint',
    subjectPrefix: 'Complaint regarding ',
    fallbackRecipient: 'The Seller / Platform Grievance Officer / Consumer Forum',
    relief: [
      'review the transaction and the supporting consumer records',
      'ensure refund, replacement, rectification, or compensation as applicable',
      'record this complaint for escalation if the seller continues to ignore it',
    ],
  },
  domestic: {
    documentLabel: 'complaint / protection request',
    subjectPrefix: 'Request for protection regarding ',
    fallbackRecipient: 'The Protection Officer / Station House Officer / Magistrate',
    relief: [
      'treat this as a safety-sensitive complaint and record it urgently',
      'help secure protection, residence, maintenance, or emergency assistance as needed',
      'guide me on the immediate next legal and support steps available',
    ],
  },
  police: {
    documentLabel: 'complaint / FIR request',
    subjectPrefix: 'Request for registration of complaint / FIR regarding ',
    fallbackRecipient: 'The Station House Officer',
    relief: [
      'record my complaint and register the FIR if the facts disclose a cognizable offence',
      'acknowledge receipt of this written complaint and preserve the evidence details',
      'take appropriate investigation steps or inform me of the lawful next procedure',
    ],
  },
  cyber: {
    documentLabel: 'cyber complaint / FIR request',
    subjectPrefix: 'Request for cyber complaint / FIR regarding ',
    fallbackRecipient: 'The Cyber Crime Cell / Station House Officer',
    relief: [
      'record this complaint urgently and preserve the digital evidence trail',
      'coordinate with the bank, platform, or service provider to freeze or trace activity if possible',
      'acknowledge receipt and inform me of the complaint reference and next action',
    ],
  },
});

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqueByLabel(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = item.label.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function compactAuthority(authority = '') {
  const trimmed = authority.replace(/\s+/g, ' ').trim();

  if (!trimmed) {
    return '';
  }

  return trimmed.split(/[.]/u)[0].trim();
}

function normalizeSentence(text = '') {
  return text.replace(/\s+/g, ' ').trim();
}

export function formatTimelineDate(dateString) {
  if (!dateString) {
    return '';
  }

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function buildChecklistItems({ categoryId, query, result, timelineEntries = [] }) {
  const category = LEGAL_CATEGORY_MAP[categoryId];
  const authority = compactAuthority(result?.authority);
  const items = [
    {
      id: 'timeline',
      label:
        timelineEntries.length > 0
          ? `Chronology of events with exact dates (${timelineEntries.length} entries added)`
          : 'Chronology of events with exact dates',
      note: 'List calls, notices, payments, threats, or follow-ups in order.',
    },
    {
      id: 'relief',
      label: 'A short written note of the outcome or relief you want',
      note: 'Examples: refund, FIR registration, wage payment, protection, or document correction.',
    },
  ];

  if (authority) {
    items.push({
      id: 'authority',
      label: `Copies of complaints or representations prepared for ${authority}`,
      note: 'Keep the signed draft, delivery proof, and acknowledgement together.',
    });
  }

  (category?.evidenceChecklist || []).forEach((entry) => {
    items.push({
      id: slugify(entry),
      label: entry,
      note: 'Core evidence for this legal track.',
    });
  });

  QUERY_EVIDENCE_CLUES.forEach((clue) => {
    if (clue.pattern.test(query || '')) {
      items.push({
        id: slugify(clue.label),
        label: clue.label,
        note: 'This looks especially relevant from the facts you described.',
      });
    }
  });

  if (result?.helplines?.length) {
    items.push({
      id: 'contacts',
      label: 'Saved helpline numbers, portal links, and reference numbers',
      note: 'Useful if you need to escalate quickly or report again.',
    });
  }

  return uniqueByLabel(items);
}

export function buildDraftLetter({
  submittedCase,
  result,
  timelineEntries = [],
  checklistItems = [],
}) {
  if (!submittedCase) {
    return result?.draft || '';
  }

  const categoryId = submittedCase.category;
  const categoryTitle = LEGAL_CATEGORY_MAP[categoryId]?.title || 'Legal Issue';
  const draftConfig = DRAFT_CONFIG[categoryId] || {
    documentLabel: 'complaint letter',
    subjectPrefix: 'Complaint regarding ',
    fallbackRecipient: 'The Concerned Authority',
    relief: [
      'review this complaint and the supporting documents',
      'acknowledge receipt and inform me of the next legal or administrative step',
      'take appropriate action according to law',
    ],
  };
  const summary = normalizeSentence(result?.summary || submittedCase.query);
  const facts = normalizeSentence(submittedCase.query);
  const authorityLine = compactAuthority(result?.authority) || draftConfig.fallbackRecipient;
  const timelineBlock = timelineEntries.length
    ? timelineEntries
        .map(
          (entry, index) =>
            `${index + 1}. ${formatTimelineDate(entry.date)} - ${entry.detail.trim()}`,
        )
        .join('\n')
    : [
        '1. [Insert date] - [Describe the first major incident]',
        '2. [Insert date] - [Describe the refusal, threat, loss, or non-response]',
        '3. [Insert date] - [Describe the latest follow-up and current status]',
      ].join('\n');
  const evidenceLines = checklistItems.length
    ? checklistItems
        .slice(0, 6)
        .map((item) => `- ${item.label}`)
        .join('\n')
    : '- [Add the documents and screenshots currently available]';
  const reliefLines = draftConfig.relief.map((line) => `- ${line}`).join('\n');

  return `To,
${authorityLine}

Subject: ${draftConfig.subjectPrefix}${categoryTitle}

Respected Sir/Madam,

I am submitting this ${draftConfig.documentLabel} regarding ${categoryTitle.toLowerCase()}. ${summary}

Brief facts:
${facts}

Chronology of events:
${timelineBlock}

Documents and evidence currently available with me:
${evidenceLines}

I request that you kindly:
${reliefLines}

I am ready to provide supporting documents, screenshots, witness details, and any further clarification required. Kindly acknowledge this complaint and inform me of the next procedural step.

Sincerely,
[FULL NAME]
[ADDRESS]
[PHONE NUMBER]
[EMAIL]
[DATE]`;
}

export function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
