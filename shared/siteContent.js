export const PRIMARY_NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/features' },
  { label: 'Categories', to: '/categories' },
  { label: 'Assistant', to: '/assistant' },
  { label: 'Resources', to: '/resources' },
];

export const HOME_FLOW_STEPS = [
  {
    id: 'discover',
    eyebrow: 'Discover',
    title: 'Understand the right path before you file anything.',
    description:
      'Start with guided summaries, category pages, and feature explainers instead of jumping into a crowded dashboard.',
  },
  {
    id: 'prepare',
    eyebrow: 'Prepare',
    title: 'Move through a structured intake that feels calm and clear.',
    description:
      'Pick a language, describe the issue, review next steps, and capture a complaint draft with less cognitive load.',
  },
  {
    id: 'validate',
    eyebrow: 'Validate',
    title: 'Back your next step with public legal sources.',
    description:
      'Use Indian Kanoon research results and official eCourts pathways to sanity-check what to do next.',
  },
];

export const HERO_METRICS = [
  { value: '40M+', label: 'Pending cases needing clarity' },
  { value: '7', label: 'Working interface languages' },
  { value: '2', label: 'Connected legal research surfaces' },
];

export const FEATURES = [
  {
    id: 'guided-intake',
    icon: 'Compass',
    title: 'Guided Intake',
    tagline: 'A calmer step-by-step legal intake flow',
    description:
      'The assistant now follows a clearer flow inspired by modern guided-product experiences instead of dropping everything onto one screen.',
    details:
      'Users move from orientation to category selection, issue description, response review, and research follow-up in a cleaner sequence.',
    highlights: ['Step-based experience', 'Less cognitive overload', 'Clear progress state'],
  },
  {
    id: 'multilingual-support',
    icon: 'Languages',
    title: 'Multilingual Support',
    tagline: 'Language selection now drives the actual experience',
    description:
      'Interface labels, guidance framing, and user preferences are now connected to a real language state instead of being decorative.',
    details:
      'The selected language is persisted in the app flow and reused across routes, form submission, and saved preferences.',
    highlights: ['Persistent preference', 'Localized UI copy', 'Connected assistant state'],
  },
  {
    id: 'google-sign-in',
    icon: 'ShieldCheck',
    title: 'Google Sign-In',
    tagline: 'Firebase-backed authentication for continuity',
    description:
      'Users can continue with Google, store profile state, and unlock saved activity without building a custom auth system from scratch.',
    details:
      'Firebase Authentication handles Google sign-in, while Firestore stores profile and history data for signed-in sessions.',
    highlights: ['Firebase Auth', 'Google provider', 'Session-aware navigation'],
  },
  {
    id: 'legal-research',
    icon: 'Scale',
    title: 'Legal Research Layer',
    tagline: 'Research beyond a generated answer',
    description:
      'The experience now has a dedicated resources surface for case-law discovery and official case-status navigation.',
    details:
      'Indian Kanoon is wired through a backend integration layer, and eCourts access is modeled through an official-path adapter.',
    highlights: ['Indian Kanoon integration', 'eCourts pathways', 'Extensible provider boundary'],
  },
];

export const FEATURE_MAP = Object.fromEntries(
  FEATURES.map((feature) => [feature.id, feature]),
);

export const CATEGORIES = [
  {
    id: 'property',
    title: 'Property Dispute',
    shortDescription: 'Land, rent, eviction, deposits',
    description:
      'Use this for rent deposits, illegal eviction, co-ownership conflicts, encroachment, partition, and other possession-related disputes.',
    nextSteps: ['Collect agreements and receipts', 'Preserve payment history', 'Prepare a dated written demand'],
  },
  {
    id: 'labour',
    title: 'Labour Rights',
    shortDescription: 'Wages, termination, PF, harassment',
    description:
      'Use this for unpaid wages, wrongful dismissal, contract disputes, PF and ESI issues, workplace abuse, and settlement dues.',
    nextSteps: ['Preserve salary proof', 'Record employer communication', 'Prepare a labour complaint trail'],
  },
  {
    id: 'consumer',
    title: 'Consumer Fraud',
    shortDescription: 'Refunds, defective products, service fraud',
    description:
      'Use this for failed purchases, misrepresentation, fake offers, non-delivery, and service deficiency disputes.',
    nextSteps: ['Save invoices and screenshots', 'Track refund promises', 'Prepare escalation chronology'],
  },
  {
    id: 'domestic',
    title: 'Domestic Violence',
    shortDescription: 'Safety, protection, maintenance',
    description:
      'Use this for domestic abuse, immediate safety planning, protection orders, shelter support, maintenance, and related relief.',
    nextSteps: ['Prioritize safety', 'Capture evidence carefully', 'Identify emergency support options'],
  },
  {
    id: 'police',
    title: 'Police / FIR',
    shortDescription: 'FIR refusal, arrest, complaint escalation',
    description:
      'Use this for FIR refusal, wrongful detention, complaint acknowledgement issues, police inaction, and escalation planning.',
    nextSteps: ['Write the timeline clearly', 'Ask for acknowledgement', 'Escalate through senior channels'],
  },
  {
    id: 'cyber',
    title: 'Cyber Crime',
    shortDescription: 'UPI scams, account theft, online abuse',
    description:
      'Use this for fraud, impersonation, phishing, unauthorized access, harassment, payment disputes, and identity theft.',
    nextSteps: ['Report quickly', 'Contact the bank or platform', 'Preserve IDs, screenshots, and timestamps'],
  },
];

export const LEGAL_CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
);

export const SUPPORTED_LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिंदी' },
  { value: 'Kannada', label: 'ಕನ್ನಡ' },
  { value: 'Tamil', label: 'தமிழ்' },
  { value: 'Telugu', label: 'తెలుగు' },
  { value: 'Bengali', label: 'বাংলা' },
  { value: 'Marathi', label: 'मराठी' },
];

export const RESOURCE_SOURCES = [
  {
    id: 'indiankanoon',
    title: 'Indian Kanoon',
    description:
      'Search judgments, orders, and legal documents through the documented token-based API integration layer.',
  },
  {
    id: 'ecourts',
    title: 'eCourts India',
    description:
      'Use official eCourts public search pathways for case status and court-access workflows when a stable public API is unavailable.',
  },
];

export const FOOTER_SECTIONS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/features' },
      { label: 'Categories', to: '/categories' },
      { label: 'Assistant', to: '/assistant' },
      { label: 'Resources', to: '/resources' },
    ],
  },
  {
    title: 'Legal Focus',
    links: CATEGORIES.map((category) => ({
      label: category.title,
      to: `/categories/${category.id}`,
    })),
  },
];

export const APP_COPY = {
  productName: 'NyayaSaathi',
  homeEyebrow: 'AI-guided legal navigation for India',
  homeTitle: 'A clearer path from confusion to legal next steps.',
  homeDescription:
    'NyayaSaathi now uses routed journeys, saved user context, and source-backed follow-up so people are not forced to decode everything from one overloaded dashboard.',
  homePrimaryCta: 'Start with Google',
  homeSecondaryCta: 'Explore Features',
  assistantTitle: 'Legal Assistant Workspace',
  assistantDescription:
    'Describe the situation, review guidance, and then validate with connected research sources.',
  resourceTitle: 'Legal Research & Court Access',
  resourceDescription:
    'Search Indian Kanoon through the backend integration and move to official eCourts access points for public case-status workflows.',
};
