export const NAV_LINKS = [
  { label: 'How It Works', href: '#how' },
  { label: 'Categories', href: '#categories' },
  { label: 'Get Legal Help', href: '#app' },
  { label: 'Impact', href: '#impact' },
];

export const HERO_STATS = [
  { value: '40M+', label: 'Pending Cases in India' },
  { value: '7+', label: 'Languages Supported' },
  { value: '6', label: 'Legal Categories' },
];

export const HOW_IT_WORKS_STEPS = [
  {
    number: '1',
    icon: '🗂',
    iconClassName: 's1',
    title: 'Choose Category',
    description:
      'Select the type of legal issue: property, labour, consumer fraud, domestic violence, FIR or cyber crime.',
  },
  {
    number: '2',
    icon: '🌐',
    iconClassName: 's2',
    title: 'Pick Your Language',
    description:
      "Get guidance in English, Hindi, Kannada, Tamil, Telugu, Bengali or Marathi, whichever you're most comfortable with.",
  },
  {
    number: '3',
    icon: '✍',
    iconClassName: 's3',
    title: 'Describe Your Problem',
    description:
      'Type your situation in plain words. No legal jargon is required for the AI to understand your case.',
  },
  {
    number: '4',
    icon: '📋',
    iconClassName: 's4',
    title: 'Get Full Guidance',
    description:
      'Receive your rights, applicable laws, next steps, a draft complaint, and the authority to approach.',
  },
];

export const FEATURES = [
  {
    icon: '⚖',
    title: 'Know Your Rights',
    description:
      'Legal rights are explained in simple, plain language tailored to the situation and the relevant Indian laws.',
    tag: 'IPC · Consumer Act · Labour Law',
  },
  {
    icon: '📄',
    title: 'Complaint Draft Generator',
    description:
      'Generate a ready-to-file complaint letter addressed to the correct authority. Fill in the placeholders and submit.',
    tag: 'Copy · Print · Submit',
  },
  {
    icon: '🗺',
    title: 'Exact Authority Finder',
    description:
      'Get clear direction on which court, helpline, or government body to approach without bouncing between offices.',
    tag: 'Court · Police · Consumer Forum',
  },
  {
    icon: '🔥',
    title: 'Urgency Assessment',
    description:
      'Understand whether the issue is low, medium, or high urgency so time-sensitive action is never missed.',
    tag: 'Real-time Analysis',
  },
  {
    icon: '📞',
    title: 'Helpline Directory',
    description:
      'Relevant helplines are surfaced instantly, including legal aid, cyber crime, consumer support, and safety resources.',
    tag: 'NALSA · 181 · 1930',
  },
  {
    icon: '🌍',
    title: '7 Indian Languages',
    description:
      'Justice should not depend on language, so the app is structured to support multilingual guidance from day one.',
    tag: 'हिंदी · ಕನ್ನಡ · தமிழ்',
  },
];

export const SUPPORTED_LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिंदी' },
  { value: 'Kannada', label: 'ಕನ್ನಡ' },
  { value: 'Tamil', label: 'தமிழ்' },
  { value: 'Telugu', label: 'తెలుగు' },
  { value: 'Bengali', label: 'বাংলা' },
  { value: 'Marathi', label: 'मराठी' },
];

export const CATEGORIES = [
  {
    id: 'property',
    icon: '🏠',
    title: 'Property Dispute',
    shortDescription: 'Land, rent, eviction',
    description:
      'Land encroachment, rent disputes, security deposits, illegal eviction, and inheritance conflicts.',
  },
  {
    id: 'labour',
    icon: '⚒',
    title: 'Labour Rights',
    shortDescription: 'Wages, dismissal',
    description:
      'Unpaid wages, wrongful termination, workplace harassment, PF or ESI violations, and contract disputes.',
  },
  {
    id: 'consumer',
    icon: '🛒',
    title: 'Consumer Fraud',
    shortDescription: 'Products, services',
    description:
      'Defective products, service fraud, overcharging, misleading advertisements, and refund disputes.',
  },
  {
    id: 'domestic',
    icon: '🛡',
    title: 'Domestic Violence',
    shortDescription: 'Protection, safety',
    description:
      'Protection orders, safe shelter rights, maintenance, and child-custody related safety concerns.',
  },
  {
    id: 'police',
    icon: '⚖',
    title: 'Police / FIR',
    shortDescription: 'Filing, arrest, bail',
    description:
      'FIR filing, wrongful arrest, bail rights, police misconduct, survivor protection, and victim rights.',
  },
  {
    id: 'cyber',
    icon: '💻',
    title: 'Cyber Crime',
    shortDescription: 'Online fraud, theft',
    description:
      'UPI scams, identity theft, social media abuse, fake job offers, extortion, and account compromise.',
  },
];

export const LEGAL_CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
);

export const IMPACT_STATS = [
  { value: '40M+', label: 'Cases pending in Indian courts as of 2024' },
  { value: '70%', label: 'Indians cannot afford a private lawyer' },
  { value: '1:50K', label: 'Approximate judge-to-citizen ratio in India' },
  { value: 'Rs 0', label: 'Cost to use NyayaSaathi, always free' },
];

export const TESTIMONIALS = [
  {
    quote:
      "My employer did not pay me for 3 months. NyayaSaathi showed me where to complain and gave me the exact letter to send.",
    name: 'Ravi Kumar',
    location: 'Factory Worker, Bengaluru',
    avatar: 'R',
  },
  {
    quote:
      'मुझे अपने अधिकार समझ नहीं आ रहे थे. NyayaSaathi explained everything in Hindi and even surfaced shelter support numbers.',
    name: 'Sunita Devi',
    location: 'Homemaker, Lucknow',
    avatar: 'S',
  },
  {
    quote:
      'I lost money in a UPI scam and the app gave me a structured complaint draft plus the next authority to escalate to.',
    name: 'Anjali Sharma',
    location: 'Teacher, Chennai',
    avatar: 'A',
  },
];

export const FOOTER_LINKS = {
  legalAreas: [
    'Property Disputes',
    'Labour Rights',
    'Consumer Fraud',
    'Domestic Violence',
    'Police / FIR',
    'Cyber Crime',
  ],
  languages: [
    'English',
    'Hindi · हिंदी',
    'Kannada · ಕನ್ನಡ',
    'Tamil · தமிழ்',
    'Telugu · తెలుగు',
    'Bengali · বাংলা',
  ],
  resources: [
    'NALSA Legal Aid',
    'National Consumer Helpline',
    'Cyber Crime Portal',
    "Women's Helpline 181",
    'eCourts India',
  ],
};

export const APP_COPY = {
  heroBadge: 'AI-Powered · Free Legal Aid · For Every Indian',
  heroTitleLineOne: 'Your Rights.',
  heroTitleLineTwo: 'Simply Explained.',
  heroTitleLineThree: 'For Free.',
  heroDescription:
    'Millions of Indians face legal battles alone, too poor for lawyers and too confused by legal jargon. NyayaSaathi is an AI-powered legal companion built for that gap.',
  heroPrimaryCta: 'Get Free Legal Guidance',
  heroSecondaryCta: 'See How It Works',
  heroScrollHint: 'Scroll to explore',
  appHeadline: 'Describe Your Problem. Get Help.',
  appDescription:
    "Our AI reads Indian law so you don't have to. Free, private, and available 24/7 in your language.",
  privacyTitle: 'Your Privacy Is Protected',
  privacyDescription:
    'Queries stay inside the session flow and the architecture is ready for secure API integration later.',
  queryPlaceholder:
    'Example: My landlord has not returned my Rs 40,000 security deposit for 3 months after I vacated the house. What can I do?',
};

