export const PRIMARY_NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/features' },
  { label: 'Categories', to: '/categories' },
  { label: 'Resources', to: '/resources' },
];

export const HERO_METRICS = [
  { value: '40M+', label: 'People navigating delayed case systems' },
  { value: '7', label: 'Language options in the interface' },
  { value: '2', label: 'Research pathways connected' },
];

export const FEATURES = [
  {
    id: 'guided-intake',
    icon: 'CASE',
    title: 'Guided Intake',
    tagline: 'A calmer and more structured legal intake flow',
    description:
      'The platform guides people through orientation, issue description, response review, and research follow-up instead of forcing every action into one overloaded screen.',
    details:
      'Users can move from uncertainty to a documented next step with cleaner progression, more context, and less cognitive friction.',
    highlights: ['Structured case flow', 'Lower cognitive load', 'Clear next-step guidance'],
  },
  {
    id: 'multilingual-support',
    icon: 'LANG',
    title: 'Multilingual Support',
    tagline: 'Language preference now affects the real experience',
    description:
      'Language choice is connected to navigation, chat, and legal workflows so users are not interacting with a decorative selector.',
    details:
      'Preferences are persisted across the experience to make the workflow feel stable and consistent.',
    highlights: ['Persistent preference', 'Consistent interface copy', 'Shared state across routes'],
  },
  {
    id: 'google-sign-in',
    icon: 'AUTH',
    title: 'Google Sign-In',
    tagline: 'Protected access with Firebase-backed identity',
    description:
      'Google sign-in keeps access simple while protecting saved activity, recent guidance, and core research surfaces behind a trusted authentication layer.',
    details:
      'Firebase Authentication manages the login flow while Firestore can store returning-user history without a custom auth backend.',
    highlights: ['Protected workspace', 'Google provider', 'Saved activity continuity'],
  },
  {
    id: 'legal-research',
    icon: 'LAW',
    title: 'Legal Research Layer',
    tagline: 'Answers connected to public legal pathways',
    description:
      'Indian Kanoon search and official eCourts access are connected so legal guidance can be reviewed against real public information channels.',
    details:
      'The backend keeps the provider boundary modular so future AI and source integrations can be added cleanly.',
    highlights: ['Indian Kanoon integration', 'eCourts pathways', 'Extensible backend services'],
  },
];

export const FEATURE_MAP = Object.fromEntries(
  FEATURES.map((feature) => [feature.id, feature]),
);

export const CATEGORIES = [
  {
    id: 'property',
    title: 'Property Dispute',
    shortDescription: 'Rent, land, eviction, deposits',
    description:
      'Use this for rent deposits, illegal eviction, co-ownership conflicts, encroachment, partition, inheritance, and possession-related disputes.',
    focusAreas: ['Title and registration', 'Rent and eviction', 'Partition and inheritance'],
    articleParagraphs: [
      'Property disputes in India rarely turn on a single fact. They usually depend on a mix of title documents, possession records, registration history, payment trail, mutation entries, and the exact relief being claimed.',
      'A rent or eviction fight often looks very different from a partition or land-boundary dispute, but both become document-heavy very quickly. Courts and authorities usually want to see who has the cleaner paperwork, the more credible timeline, and the more consistent possession story.',
      'If the dispute involves family property, forged documents, builder delay, or tenancy rights, the legal path can split between civil remedies, revenue records, consumer forums, and sometimes criminal complaints where fraud or intimidation is alleged.',
    ],
    lawNotes: [
      {
        title: 'Transfer of Property Act, 1882',
        detail:
          'This is the core statute for sale, lease, mortgage, gift, and transfer of immovable property. It usually shapes possession and transfer disputes.',
      },
      {
        title: 'Registration Act, 1908 and Indian Stamp Act, 1899',
        detail:
          'These laws matter when parties argue over whether a document was properly registered, stamped, or capable of proving a valid transfer.',
      },
      {
        title: 'Hindu Succession Act, 1956 and state rent-control laws',
        detail:
          'Inheritance, coparcenary, and tenancy issues often depend on family-status rules and state-specific landlord-tenant protections.',
      },
    ],
    famousCases: [
      {
        name: 'Suraj Lamp & Industries Pvt. Ltd. v. State of Haryana',
        year: '2011',
        detail:
          'The Supreme Court clarified that GPA, agreement-to-sell, and will combinations do not by themselves transfer legal title like a registered sale deed does.',
      },
      {
        name: 'Vineeta Sharma v. Rakesh Sharma',
        year: '2020',
        detail:
          'The Supreme Court reaffirmed that daughters are coparceners by birth under Hindu law, which is central in many inheritance and partition disputes.',
      },
      {
        name: 'Satya Pal Anand v. State of Madhya Pradesh',
        year: '2016',
        detail:
          'The decision is frequently discussed in registration disputes because it explains the limits of what registration authorities can examine once a document is presented.',
      },
    ],
    newsItems: [
      {
        title:
          'Karnataka HC says Bengaluru land dispute where multiple people claim to be owner Radha cries out for police probe',
        source: 'The Indian Express',
        publishedAt: 'February 9, 2026',
        url: 'https://indianexpress.com/article/legal-news/karnataka-hc-says-bengaluru-land-dispute-where-multiple-people-claim-to-be-owner-radha-cries-out-for-police-probe-10522791/',
        detail:
          'This is a useful example of a property fight spilling into forgery, impersonation, and criminal investigation rather than remaining a pure civil dispute.',
      },
      {
        title:
          'Supreme Court flags issues in property registration, says examine blockchain tech',
        source: 'The Indian Express',
        publishedAt: 'November 8, 2025',
        url: 'https://indianexpress.com/article/legal-news/supreme-court-flags-issues-in-property-registration-says-examine-blockchain-tech-10352780/lite/',
        detail:
          'The report highlights a persistent Indian problem: registration proves a document was recorded, but not always that title is clean and beyond challenge.',
      },
    ],
    evidenceChecklist: [
      'Registered sale deed, lease deed, allotment letter, or family settlement papers',
      'Mutation, tax receipts, electricity bills, rent receipts, and possession proof',
      'WhatsApp chats, notice letters, builder promises, and payment trail',
    ],
    nextSteps: [
      'Collect agreements and receipts',
      'Preserve payment history',
      'Prepare a dated written demand',
    ],
  },
  {
    id: 'labour',
    title: 'Labour Rights',
    shortDescription: 'Salary, termination, PF, workplace abuse',
    description:
      'Use this for unpaid wages, wrongful dismissal, contract disputes, PF and ESI issues, workplace abuse, and settlement dues.',
    focusAreas: ['Wages and dues', 'Termination and discipline', 'Gig and platform work'],
    articleParagraphs: [
      'Labour disputes are often about the basics people depend on most: wages, continuity of employment, benefits, dignity at work, and the right to question arbitrary action by an employer.',
      'The law can change depending on whether the worker is a permanent employee, contract worker, trainee, domestic worker, platform worker, or someone in the informal sector. That means the right strategy usually starts with the status of employment, not just the grievance.',
      'Documents such as appointment letters, salary slips, attendance records, PF statements, performance emails, grievance complaints, and resignation or termination letters often decide whether the dispute can be framed as wage recovery, unfair labour practice, wrongful termination, harassment, or social-security non-compliance.',
    ],
    lawNotes: [
      {
        title: 'Code on Wages, 2019 and wage-payment statutes',
        detail:
          'These rules shape minimum wages, timely payment, and unlawful deductions. In many disputes, the first legal question is whether wage payment itself violated statutory duties.',
      },
      {
        title: 'Payment of Gratuity Act, 1972 and EPF & MP Act, 1952',
        detail:
          'These are central where the dispute involves gratuity, provident fund, retirement dues, or employer non-compliance with social-security obligations.',
      },
      {
        title: 'Industrial-dispute and workplace-safety framework',
        detail:
          'Dismissal, retrenchment, disciplinary action, and workplace-harassment complaints often depend on labour adjudication rules, service conditions, and the POSH regime where applicable.',
      },
    ],
    famousCases: [
      {
        name: 'People’s Union for Democratic Rights v. Union of India',
        year: '1982',
        detail:
          'A landmark ruling on labour dignity and minimum-wage protections that continues to matter in wage and exploitation disputes.',
      },
      {
        name: 'Bandhua Mukti Morcha v. Union of India',
        year: '1984',
        detail:
          'This case broadened the constitutional view of labour protection, especially for vulnerable and informal workers facing exploitation and coercive conditions.',
      },
      {
        name: 'Vishaka v. State of Rajasthan',
        year: '1997',
        detail:
          'Although known for sexual-harassment safeguards, it remains foundational to workplace dignity and employer responsibility in labour-sensitive disputes.',
      },
    ],
    newsItems: [
      {
        title:
          'Right to gratuity statutory right: Andhra Pradesh High Court directs firm to pay employee',
        source: 'The Indian Express',
        publishedAt: 'January 6, 2026',
        url: 'https://indianexpress.com/article/legal-news/right-to-gratuity-statutory-right-andhra-pradesh-high-court-directs-firm-to-pay-employee-10456747/',
        detail:
          'This report is directly relevant for salary-and-dues disputes because it reinforces that gratuity is a statutory entitlement, not a discretionary employer payout.',
      },
      {
        title:
          'Fighting precarity and a phantom boss, gig workers join wider labour unrest',
        source: 'The Indian Express',
        publishedAt: 'April 16, 2026',
        url: 'https://indianexpress.com/article/business/fighting-precarity-and-a-phantom-boss-gig-workers-join-wider-labour-unrest-10638951/lite/',
        detail:
          'It captures how labour-rights debates in India are expanding beyond factories and offices into algorithm-driven gig work and app-based control.',
      },
    ],
    evidenceChecklist: [
      'Appointment letter, offer letter, ID card, and any contract or HR policy',
      'Salary slips, bank credits, PF passbook, ESI details, and attendance proof',
      'Termination emails, warning letters, grievance complaints, and witness messages',
    ],
    nextSteps: [
      'Preserve salary proof',
      'Record employer communication',
      'Prepare a labour complaint trail',
    ],
  },
  {
    id: 'consumer',
    title: 'Consumer Fraud',
    shortDescription: 'Refunds, defective products, service issues',
    description:
      'Use this for failed purchases, misrepresentation, fake offers, non-delivery, overcharging, and service deficiency disputes.',
    focusAreas: ['Mis-selling and refunds', 'Defective goods', 'E-commerce and services'],
    articleParagraphs: [
      'Consumer disputes usually begin with something that appears simple: a false promise, a defective product, a delayed refund, a failed service, or a contract that looked routine until it became one-sided in practice.',
      'What makes consumer law powerful is its breadth. The same broad framework can reach defective goods, housing delays, insurance disputes, health services, education-related claims, digital subscriptions, and online marketplace complaints depending on the facts.',
      'Good consumer cases are usually built around proof of representation, payment, follow-up complaints, service deficiency, and the actual loss suffered. Screenshots, invoices, delivery records, service emails, warranty terms, and ad claims become critical evidence very early.',
    ],
    lawNotes: [
      {
        title: 'Consumer Protection Act, 2019',
        detail:
          'This is the main framework for unfair trade practice, product liability, defective goods, deficient service, and consumer commissions.',
      },
      {
        title: 'Consumer Protection (E-Commerce) Rules, 2020',
        detail:
          'These rules matter when the dispute involves online marketplaces, digital sellers, dark patterns, refunds, and disclosure duties.',
      },
      {
        title: 'Sector-specific compliance rules',
        detail:
          'Depending on the product or service, related issues can also involve legal metrology, housing, insurance, food safety, medicine, telecom, or banking regulation.',
      },
    ],
    famousCases: [
      {
        name: 'Lucknow Development Authority v. M.K. Gupta',
        year: '1993',
        detail:
          'One of the most cited consumer-law cases in India, especially on compensation and accountability for deficient service by public bodies.',
      },
      {
        name: 'Indian Medical Association v. V.P. Shantha',
        year: '1995',
        detail:
          'A foundational ruling that brought many medical services within consumer-law scrutiny, shaping service-deficiency claims nationwide.',
      },
      {
        name: 'Pioneer Urban Land and Infrastructure Ltd. v. Govindan Raghavan',
        year: '2019',
        detail:
          'Important for one-sided contracts and housing-service disputes, especially when builders rely on unfair standard terms against buyers.',
      },
    ],
    newsItems: [
      {
        title:
          'Supreme Court slams Parsvnath over one-sided contracts: Why Gurugram homebuyers now owe 8 per cent interest',
        source: 'The Indian Express',
        publishedAt: 'February 23, 2026',
        url: 'https://indianexpress.com/article/legal-news/supreme-court-slams-parsvnath-over-one-sided-contracts-why-gurugram-homebuyers-now-owe-8-per-cent-interest-10544090/lite/',
        detail:
          'This is highly relevant for anyone challenging boilerplate seller terms, delayed possession, or service providers hiding behind one-sided agreements.',
      },
      {
        title:
          'Jaguar airbag failure at 90 Kmph: Why national consumer commission denied Rs 5 crore payout after 12-year battle',
        source: 'The Indian Express',
        publishedAt: 'April 9, 2026',
        url: 'https://indianexpress.com/article/legal-news/ncdrc-rejects-land-rover-airbag-failure-5-crore-consumer-claim-10626304/',
        detail:
          'It shows how technical evidence, expert reports, and product-data records can decide consumer disputes involving defect and safety allegations.',
      },
    ],
    evidenceChecklist: [
      'Invoice, order confirmation, product listing, offer screenshot, and payment receipt',
      'Complaint emails, return requests, call logs, and platform ticket numbers',
      'Photos or video of the defect, delivery mismatch, or damaged packaging',
    ],
    nextSteps: [
      'Save invoices and screenshots',
      'Track refund promises',
      'Prepare escalation chronology',
    ],
  },
  {
    id: 'domestic',
    title: 'Domestic Violence',
    shortDescription: 'Safety, protection, maintenance',
    description:
      'Use this for domestic abuse, immediate safety planning, protection orders, shelter support, maintenance, and related relief.',
    focusAreas: ['Immediate safety', 'Residence and maintenance', 'Documentation and relief'],
    articleParagraphs: [
      'Domestic-violence matters should be approached as safety-first situations, not just as legal files. The immediate legal path may involve protection, residence, custody support, monetary relief, police assistance, medical records, or shelter access depending on the risk level.',
      'Indian law allows a domestic-violence complaint to seek civil-style protective relief even when the survivor also chooses to pursue criminal action. That means the page should not be read only as a route to punishment, but also as a route to safety, recognition, and practical support.',
      'Messages, call recordings, medical papers, neighbour testimony, expense records, and proof of shared household or financial dependence often become important. In many cases, the timeline of abuse matters just as much as a single dramatic incident.',
    ],
    lawNotes: [
      {
        title: 'Protection of Women from Domestic Violence Act, 2005',
        detail:
          'This is the key protective statute for residence orders, protection orders, monetary relief, custody-related directions, and compensation.',
      },
      {
        title: 'Penal-law provisions on cruelty, hurt, intimidation, and sexual offences',
        detail:
          'Where the facts justify it, criminal provisions can run alongside a domestic-violence proceeding rather than replacing it.',
      },
      {
        title: 'Maintenance and family-procedure remedies',
        detail:
          'Maintenance claims, child-support issues, and family-court proceedings often move in parallel with domestic-violence litigation.',
      },
    ],
    famousCases: [
      {
        name: 'Hiral P. Harsora v. Kusum Narottamdas Harsora',
        year: '2016',
        detail:
          'The Supreme Court removed the words “adult male” from the Act, expanding who can be proceeded against under the domestic-violence framework.',
      },
      {
        name: 'Satish Chander Ahuja v. Sneha Ahuja',
        year: '2020',
        detail:
          'A major ruling on shared-household rights and residence protection under the Domestic Violence Act.',
      },
      {
        name: 'Krishna Bhattacharjee v. Sarathi Choudhury',
        year: '2015',
        detail:
          'Important for understanding how stridhan recovery and continuing wrong principles can stay legally relevant even after marital separation.',
      },
    ],
    newsItems: [
      {
        title:
          'Domestic violence, assault among most reported crimes to NCW',
        source: 'The Indian Express',
        publishedAt: 'May 4, 2025',
        url: 'https://indianexpress.com/article/india/domestic-violence-assault-most-reported-crimes-ncw-9981770/',
        detail:
          'The reporting shows that domestic-violence complaints remain one of the largest streams reaching the National Commission for Women.',
      },
      {
        title:
          'Distance does not dilute entitlement to dignity: Domestic Violence Act covers abuse committed overseas, says Pune court',
        source: 'The Indian Express',
        publishedAt: 'September 13, 2025',
        url: 'https://indianexpress.com/article/cities/pune/distance-dignity-domestic-violence-act-abuse-overseas-pune-court-10247583/lite/',
        detail:
          'This is especially relevant for NRI and transnational relationships, where abuse, residence, and maintenance questions stretch across borders.',
      },
    ],
    evidenceChecklist: [
      'Medical papers, photographs, threatening messages, and incident diary',
      'Proof of shared household, expenses, and financial dependence if any',
      'Emergency contacts, neighbour or family witnesses, and child-related records',
    ],
    nextSteps: [
      'Prioritize safety',
      'Capture evidence carefully',
      'Identify emergency support options',
    ],
  },
  {
    id: 'police',
    title: 'Police / FIR',
    shortDescription: 'FIR refusal, arrest, escalation',
    description:
      'Use this for FIR refusal, wrongful detention, complaint acknowledgement issues, police inaction, and escalation planning.',
    focusAreas: ['FIR registration', 'Police inaction', 'Arrest safeguards'],
    articleParagraphs: [
      'Police-related disputes often begin before any trial starts. The core problem is usually refusal to register an FIR, pressure to dilute the complaint, delay in action, coercive police behaviour, or uncertainty about what happens after a complaint is submitted.',
      'In these situations, the law is not only about the underlying offence. It is also about procedure: whether the complaint is cognizable, whether an FIR is mandatory, whether a zero FIR is possible, whether medical examination or seizure should happen immediately, and when the magistrate can be approached.',
      'A clear written timeline, acknowledgment proof, station details, CCTV or video material, medical documents, and escalation records to senior officers often decide whether the next step should be administrative, judicial, or both.',
    ],
    lawNotes: [
      {
        title: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
        detail:
          'This governs FIR registration, investigation steps, notice procedure, arrest, remand, and the procedural route when the police do not act properly.',
      },
      {
        title: 'Bharatiya Nyaya Sanhita, 2023',
        detail:
          'The substantive offence section still matters because FIR strategy changes depending on whether the allegation is assault, cheating, sexual violence, extortion, trespass, or another cognizable offence.',
      },
      {
        title: 'Special-protection statutes where relevant',
        detail:
          'POCSO, SC/ST protections, domestic-violence law, and other special statutes can impose additional duties on the police depending on the facts.',
      },
    ],
    famousCases: [
      {
        name: 'Lalita Kumari v. Government of Uttar Pradesh',
        year: '2013',
        detail:
          'This is the leading authority on mandatory FIR registration in cognizable offences, subject to narrow categories for preliminary inquiry.',
      },
      {
        name: 'D.K. Basu v. State of West Bengal',
        year: '1997',
        detail:
          'A foundational arrest-safeguards case that remains central whenever wrongful detention or custodial abuse is alleged.',
      },
      {
        name: 'Prakash Singh v. Union of India',
        year: '2006',
        detail:
          'The case is still the reference point for structural police reforms, independence, and accountability in India.',
      },
    ],
    newsItems: [
      {
        title:
          'Police can’t arrest unless non-bailable warrants issued in private complaints, rules Supreme Court',
        source: 'The Indian Express',
        publishedAt: 'April 24, 2026',
        url: 'https://indianexpress.com/article/legal-news/supreme-court-police-arrest-powers-private-complaint-case-warrant-mandatory-10653524/',
        detail:
          'It is a practical reminder that police powers in complaint cases are still controlled by procedure, and not every threat of arrest is legally sustainable.',
      },
      {
        title:
          'SC flags reluctance of police in filing FIR, probe in Ghaziabad minor’s rape & murder',
        source: 'The Indian Express',
        publishedAt: 'April 14, 2026',
        url: 'https://indianexpress.com/article/legal-news/sc-flags-reluctance-of-police-in-filing-fir-probe-in-ghaziabad-minors-rape-murder-10635090/lite/',
        detail:
          'This reporting underscores how police inaction at the FIR stage can itself become a serious legal issue requiring court monitoring.',
      },
    ],
    evidenceChecklist: [
      'Written complaint copy, station diary details, and acknowledgement or refusal proof',
      'Video, medical papers, witness contacts, and location or CCTV details',
      'Emails or representations sent to SHO, SP, DCP, magistrate, or grievance portals',
    ],
    nextSteps: [
      'Write the timeline clearly',
      'Ask for acknowledgement',
      'Escalate through senior channels',
    ],
  },
  {
    id: 'cyber',
    title: 'Cyber Crime',
    shortDescription: 'UPI scams, account theft, online abuse',
    description:
      'Use this for fraud, impersonation, phishing, unauthorized access, online blackmail, harassment, and identity theft.',
    focusAreas: ['Fast reporting and freeze requests', 'Identity and account misuse', 'Electronic evidence'],
    articleParagraphs: [
      'Cyber-crime disputes move faster than most other legal categories because money, data, and device trails can vanish quickly. The first hours after a fraud, takeover, impersonation, or extortion attempt often matter more than the first legal notice later.',
      'Indian cyber complaints frequently overlap with ordinary criminal law. A phishing or digital-arrest scam can trigger cheating, forgery, impersonation, unlawful access, and money-trail questions at the same time. That is why bank contact, 1930 reporting, platform escalation, and police complaint often need to happen together.',
      'The strongest cyber cases are built on screenshots, transaction IDs, URLs, email headers, call records, device logs, recovery emails, and proof of account control before and after the incident. Even small technical details can become decisive evidence.',
    ],
    lawNotes: [
      {
        title: 'Information Technology Act, 2000',
        detail:
          'This remains the central statute for unauthorized access, identity misuse, electronic records, and cyber-enabled wrongdoing.',
      },
      {
        title: 'Bharatiya Nyaya Sanhita, 2023',
        detail:
          'Cheating, criminal intimidation, extortion, forgery, and related offences can sit alongside IT Act provisions in cyber-fraud cases.',
      },
      {
        title: 'Digital-data and platform-compliance framework',
        detail:
          'Depending on the facts, privacy, platform-reporting, intermediary responsibility, and banking or telecom rules can also become relevant.',
      },
    ],
    famousCases: [
      {
        name: 'Shreya Singhal v. Union of India',
        year: '2015',
        detail:
          'A landmark cyber-law case that struck down Section 66A of the IT Act and still shapes online-speech and platform-governance discussions.',
      },
      {
        name: 'Anvar P.V. v. P.K. Basheer',
        year: '2014',
        detail:
          'This remains one of the most important cases on electronic evidence and how digital records are proved in court.',
      },
      {
        name: 'K.S. Puttaswamy v. Union of India',
        year: '2017',
        detail:
          'The privacy judgment matters to cyber disputes because it established privacy as a fundamental right in the digital age.',
      },
    ],
    newsItems: [
      {
        title:
          'Digital arrest crackdown: Centre forms multi-agency panel as Supreme Court set to hear the matter',
        source: 'The Indian Express',
        publishedAt: 'January 14, 2026',
        url: 'https://indianexpress.com/article/legal-news/digital-arrest-crackdown-centre-forms-multi-agency-panel-as-supreme-court-set-to-hear-matter-today-10470319/',
        detail:
          'This captures the scale of the current cyber-fraud problem and the fact that digital-arrest scams are now receiving coordinated national attention.',
      },
      {
        title:
          'Cyber fraud more serious than robbery and dacoity, says court, rejects bail to 3',
        source: 'The Indian Express',
        publishedAt: 'March 8, 2026',
        url: 'https://indianexpress.com/article/cities/mumbai/cyber-fraud-serious-robbery-dacoity-court-rejects-bail-3-10571823/',
        detail:
          'It shows how seriously Indian courts are beginning to treat large-value cyber fraud and digital-arrest style financial crime.',
      },
    ],
    evidenceChecklist: [
      'Transaction IDs, screenshots, bank SMS alerts, and complaint reference numbers',
      'Call logs, email headers, URLs, usernames, device activity, and login alerts',
      'Platform reports, freeze requests, 1930 helpline record, and cyber-portal complaint copy',
    ],
    nextSteps: [
      'Report quickly',
      'Contact the bank or platform',
      'Preserve IDs, screenshots, and timestamps',
    ],
  },
];

export const LEGAL_CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
);

export const SUPPORTED_LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Kannada', label: 'Kannada' },
  { value: 'Tamil', label: 'Tamil' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Bengali', label: 'Bengali' },
  { value: 'Marathi', label: 'Marathi' },
];

export const CHATBOT_SUGGESTED_PROMPTS = [
  'My landlord is not returning my security deposit after I vacated the flat.',
  'My salary has not been paid for two months. What should I do first?',
  'I sent money through UPI to a scammer. How can I report it quickly?',
];

export const RESOURCE_SOURCES = [
  {
    id: 'indiankanoon',
    title: 'Indian Kanoon',
    description:
      'Search judgments, orders, and legal documents through the token-based backend integration layer.',
  },
  {
    id: 'ecourts',
    title: 'eCourts India',
    description:
      'Use official public search pathways for case status and court access when a stable public API is unavailable.',
  },
];

export const FOOTER_SECTIONS = [
  {
    title: 'Platform',
    links: [
      { label: 'Features', to: '/features' },
      { label: 'Categories', to: '/categories' },
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
  homeEyebrow: 'Trusted legal-tech guidance for India',
  homeTitle: 'Structured legal help built for clarity, documentation, and action.',
  homeDescription:
    'NyayaSaathi combines protected access, guided AI assistance, legal category routing, and research-backed follow-up so people can move through legal uncertainty with more confidence.',
  homePrimaryCta: 'Open AI Assistant',
  homeSecondaryCta: 'Browse Legal Resources',
  assistantTitle: 'Legal Guidance Workspace',
  assistantDescription:
    'Describe the situation, review guidance, and validate it with connected public legal sources.',
  resourceTitle: 'Legal Research & Court Access',
  resourceDescription:
    'Search Indian Kanoon through the backend integration and move to official eCourts access points for public case-status workflows.',
};
