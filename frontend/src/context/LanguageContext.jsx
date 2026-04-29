import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'nyayasaathi-language';
const fallbackLanguage = 'English';
const LANGUAGE_CODES = Object.freeze({
  English: 'en',
  Hindi: 'hi',
  Kannada: 'kn',
  Tamil: 'ta',
  Telugu: 'te',
  Bengali: 'bn',
  Marathi: 'mr',
});

const TAMIL_EXTRA_COPY = Object.freeze({
  home: {
    keyActionsEyebrow: 'முக்கிய செயல்கள்',
    keyActionsTitle: 'மக்கள் அதிகம் பயன்படுத்தும் செயல்களுக்கு தெளிவான வழிகள்.',
    commonCategoriesEyebrow: 'பொதுவான வகைகள்',
    commonCategoriesTitle: 'உங்களுக்கு அருகிலுள்ள சட்ட பாதையில் தொடங்குங்கள்.',
    sourceBackedEyebrow: 'ஆதாரபூர்வம்',
    sourceBackedTitle: 'பதில்கள் நம்பகமான இடத்துக்கு வழிநடத்த வேண்டும்.',
    builtForClarityEyebrow: 'தெளிவுக்காக வடிவமைப்பு',
    builtForClarityTitle: 'தேவையான முக்கிய அம்சங்கள், தேவையற்ற சத்தமின்றி.',
    viewAllFeatures: 'அனைத்து அம்சங்களையும் பார்க்கவும்',
    furtherReadingEyebrow: 'மேலும் வாசிக்க',
    furtherReadingTitle: 'கவனத்தில் வைத்திருக்க வேண்டிய நம்பகமான சட்டச் செய்தி அறிக்கைகள்.',
    furtherReadingNote: 'இந்த இணைப்புகள் குறிப்பாக சேர்க்கப்பட்டவை; புதிய தாவலில் திறக்கும்.',
    heroBriefTitle: 'ஆவணப்படுத்தப்பட்ட சட்டக் கேள்வியுடன் தொடங்குங்கள்.',
    heroBriefPoints: [
      'யார் தொடர்புடையவர்கள், என்ன நடந்தது என்பதைக் குறிப்பிடுங்கள்',
      'காலவரிசை, ஆதாரம், மற்றும் தேவையான உதவியை பதிவு செய்யுங்கள்',
      'AI வழிகாட்டுதலிலிருந்து பொது சட்ட வழிகளுக்கு நகருங்கள்',
    ],
    quickActions: [
      {
        id: 'assistant',
        mark: 'AI',
        title: 'AI உதவியாளரை திறக்கவும்',
        description: 'எளிய மொழியில் சட்டக் கேள்வியை கேட்டு, கட்டமைக்கப்பட்ட அடுத்த படிகளைப் பெறுங்கள்.',
        to: '/assistant',
      },
      {
        id: 'categories',
        mark: 'CASE',
        title: 'வழக்கு வகைகளை பார்க்கவும்',
        description: 'எழுதவோ உயர்த்திச் செல்லவோ முன் சரியான சட்டப் பாதையில் தொடங்குங்கள்.',
        to: '/categories',
      },
      {
        id: 'resources',
        mark: 'LAW',
        title: 'சட்ட ஆதாரங்களை பார்க்கவும்',
        description: 'நடவடிக்கைக்கு முன் தொடர்புடைய ஆய்வு மற்றும் அதிகாரப்பூர்வ வழிகளைப் பார்க்கவும்.',
        to: '/resources',
      },
    ],
    trustSignals: [
      {
        mark: 'AUTH',
        title: 'பாதுகாப்பான அணுகல்',
        description: 'முக்கிய சட்ட செயல்முறைகள் சரிபார்க்கப்பட்ட Google உள்நுழைவின் பின்னால் இருக்கும்.',
      },
      {
        mark: 'DOC',
        title: 'கட்டமைக்கப்பட்ட வழிகாட்டல்',
        description: 'பதில்கள் சாதாரண அரட்டை போல அல்லாமல் சட்ட குறிப்புப் போல அமைக்கப்படுகின்றன.',
      },
      {
        mark: 'COURT',
        title: 'பொது வழி தொடர்ச்சி',
        description: 'ஆய்வு மற்றும் நீதிமன்ற அணுகல் அதிகாரப்பூர்வ பொது வழிகளுடன் இணைக்கப்பட்டுள்ளது.',
      },
    ],
  },
  assistant: {
    stepPickLanguage: '1. மொழியை தேர்வு செய்யவும்',
    stepChooseCategory: '2. வகையை தேர்வு செய்யவும்',
    stepDescribeIssue: '3. பிரச்சினையை தெளிவாக விளக்கவும்',
    selectCategory: 'ஒரு வகையைத் தேர்வு செய்யவும்',
    queryPlaceholder: 'பிரச்சினை என்ன, யார் தொடர்புடையவர்கள், உங்கள் ஆதாரம் என்ன, நீங்கள் எதிர்பாருக்கும் முடிவு என்ன என்பதை எழுதவும்.',
    helperTitle: 'உண்மையான சட்ட நிலையை எழுதுங்கள்',
    helperDescription: 'யார் தொடர்புடையவர்கள், என்ன நடந்தது, என்ன உதவி வேண்டும் என்பதைக் குறிப்பிடுங்கள்.',
    contextEyebrow: 'வகைச் சூழல்',
  },
  resources: {
    eyebrow: 'ஆதாரங்கள்',
    sourcesTitle: 'ஆதார மூலங்கள்',
    searchSourceLabel: 'தேடல் மூலம்',
    queryPlaceholder: 'பிரச்சினை, சட்டம், வழக்கு சொற்றொடர், தரப்பினர் பெயர் அல்லது தெரிந்த அடையாளம் மூலம் தேடுங்கள்.',
  },
  signIn: {
    eyebrow: 'பாதுகாப்பான Google உள்நுழைவு',
    chips: ['பாதுகாப்பான அணுகல்', 'சேமிக்கப்பட்ட சட்ட செயல்பாடு', 'ஆதாரபூர்வ வழிகாட்டல்'],
    loadingGoogle: 'Google திறக்கப்படுகிறது...',
    supportNote: 'பாதுகாப்பான சட்டப் பணியிடத்திற்குள் செல்ல ஒரு சரிபார்க்கப்பட்ட Google கணக்கைப் பயன்படுத்தவும்.',
  },
  pages: {
    resourcesEyebrow: 'ஆதாரங்கள்',
  },
  resultMeta: {
    highUrgency: 'அதிக அவசரம்',
    mediumUrgency: 'மிதமான அவசரம்',
    lowUrgency: 'குறைந்த அவசரம்',
    mismatchBadge: 'வகை பொருந்தவில்லை',
    mismatchTitle: 'தேர்ந்தெடுத்த வகையுடன் பொருந்தவில்லை',
    bestFitCategory: 'சிறந்த பொருத்தமான வகை',
    chooseCloserCategory: 'சிறப்பாக பொருந்தும் வகையைத் தேர்வு செய்யவும்.',
    switchTo: 'மாற்றவும்',
  },
});

function mergeLocalizedCopy(baseCopy, overrides = {}) {
  return {
    nav: { ...baseCopy.nav, ...(overrides.nav || {}) },
    common: { ...baseCopy.common, ...(overrides.common || {}) },
    home: { ...baseCopy.home, ...(overrides.home || {}) },
    assistant: { ...baseCopy.assistant, ...(overrides.assistant || {}) },
    result: { ...baseCopy.result, ...(overrides.result || {}) },
    resources: { ...baseCopy.resources, ...(overrides.resources || {}) },
    signIn: { ...baseCopy.signIn, ...(overrides.signIn || {}) },
    pages: { ...baseCopy.pages, ...(overrides.pages || {}) },
    resultMeta: { ...baseCopy.resultMeta, ...(overrides.resultMeta || {}) },
  };
}

const BASE_COPY = Object.freeze({
  nav: {
    home: 'Home',
    features: 'Features',
    categories: 'Categories',
    assistant: 'Assistant',
    resources: 'Resources',
    signIn: 'Login with Google',
    signOut: 'Sign Out',
  },
  common: {
    continueWithGoogle: 'Continue with Google',
    protectedTitle: 'Sign in required',
    protectedBody:
      'Please sign in with Google to open your saved activity and protected research pages.',
    openAssistant: 'Open legal guide',
    browseResources: 'Browse resources',
    search: 'Search',
    loading: 'Loading',
    startNow: 'Start now',
    explore: 'Explore',
    relatedCases: 'Related cases',
    officialCourtAccess: 'Official court access',
  },
  home: {
    heroEyebrow: 'Trusted legal-tech guidance for India',
    heroTitle: 'Legal clarity, when you need it most.',
    heroDescription:
      'From understanding your rights to taking action -- everything in one guided platform.',
    primaryCta: 'Open AI Assistant',
    secondaryCta: 'Browse Legal Resources',
    keyActionsEyebrow: 'Key Actions',
    keyActionsTitle: 'Clear routes for the actions people take most.',
    commonCategoriesEyebrow: 'Common Categories',
    commonCategoriesTitle: 'Start with the closest legal track.',
    sourceBackedEyebrow: 'Source-Backed',
    sourceBackedTitle: 'Answers should lead somewhere reliable.',
    builtForClarityEyebrow: 'Built For Clarity',
    builtForClarityTitle: 'The key things you need, without unnecessary noise.',
    viewAllFeatures: 'View all features',
    furtherReadingEyebrow: 'Further Reading',
    furtherReadingTitle: 'Credible legal reporting worth keeping in view.',
    furtherReadingNote: 'These links are added as reading references and open in a new tab.',
    heroBriefTitle: 'Start with a documented legal question.',
    heroBriefPoints: [
      'State who is involved and what happened',
      'Capture timelines, proof, and the help needed',
      'Move from AI guidance to public legal pathways',
    ],
    quickActions: [
      {
        id: 'assistant',
        mark: 'AI',
        title: 'Open AI Assistant',
        description: 'Ask a legal question in plain language and get structured next steps.',
        to: '/assistant',
      },
      {
        id: 'categories',
        mark: 'CASE',
        title: 'Browse Case Categories',
        description: 'Start from the right legal track before you draft or escalate anything.',
        to: '/categories',
      },
      {
        id: 'resources',
        mark: 'LAW',
        title: 'View Legal Sources',
        description: 'Check connected research and official access pathways before acting.',
        to: '/resources',
      },
    ],
    trustSignals: [
      {
        mark: 'AUTH',
        title: 'Protected access',
        description: 'Core legal workflows stay behind verified Google sign-in.',
      },
      {
        mark: 'DOC',
        title: 'Structured guidance',
        description: 'Responses are organized like a legal brief, not a chat dump.',
      },
      {
        mark: 'COURT',
        title: 'Public-path follow-up',
        description: 'Research and court access are tied to official public pathways.',
      },
    ],
  },
  assistant: {
    title: 'Legal Guidance Workspace',
    description:
      'Choose a category, explain the issue, and review guidance alongside connected research signals.',
    languageLabel: 'Language',
    categoryLabel: 'Category',
    issueLabel: 'Describe your situation',
    submit: 'Generate Legal Guidance',
    loading: 'Building your guidance...',
    historyTitle: 'Recent activity',
    historyEmpty: 'Sign in and submit a query to save recent activity here.',
    stepPickLanguage: '1. Pick language',
    stepChooseCategory: '2. Choose category',
    stepDescribeIssue: '3. Describe the issue clearly',
    selectCategory: 'Select a category',
    queryPlaceholder:
      'Describe the issue, who is involved, what proof you have, and what outcome you need.',
    helperTitle: 'Write a real legal situation',
    helperDescription: 'Include who is involved, what happened, and what help you need.',
    contextEyebrow: 'Category context',
  },
  result: {
    summary: 'Situation Summary',
    rights: 'Your Rights',
    laws: 'Applicable Laws',
    steps: 'Action Steps',
    draft: 'Complaint Draft',
    authority: 'Where to Approach',
    helplines: 'Helplines & Resources',
    reset: 'Start Over',
    actionStudioEyebrow: 'What to do next',
    actionStudioTitle: 'Turn the guidance into something you can actually use',
    actionStudioDescription:
      'Capture your chronology, generate a draft letter, and walk into the next step with a concrete evidence checklist.',
    draftStudioKicker: 'Document Builder',
    draftStudioTitle: 'Document / FIR Draft Generator',
    draftStudioDescription:
      'Create a complaint letter or FIR-style draft pre-filled with your situation details and timeline.',
    draftStudioNoteTitle: 'Why this helps',
    draftStudioNote:
      'The draft updates with the facts you entered here, so it is easier to print, share, or file after a quick human review.',
    generateDraft: 'Generate Draft Letter',
    refreshDraft: 'Refresh Draft Letter',
    downloadDraft: 'Download Draft',
    timelineKicker: 'Case Chronology',
    timelineTitle: 'Case Timeline Tracker',
    timelineDescription:
      'Log what happened and when so your story becomes easier to explain to a lawyer, officer, or forum.',
    timelineDateLabel: 'Date',
    timelineEventLabel: 'What happened',
    timelinePlaceholder:
      'Example: My landlord stopped returning my calls after I asked for the security deposit refund.',
    addTimelineEvent: 'Add Timeline Event',
    timelineEmpty:
      'No events yet. Add the first dated incident so your case history becomes concrete and easy to narrate.',
    removeTimelineEvent: 'Remove',
    timelineCountSuffix: 'entries',
    checklistKicker: 'Action Pack',
    checklistTitle: 'What to do next checklist',
    checklistDescription:
      'A dynamic checklist based on your legal category, the facts you described, and the authority you may approach next.',
    checklistAuthorityLabel: 'Suggested first authority',
    checklistReadySuffix: 'ready',
    downloadChecklist: 'Download Checklist',
    loadingTitle: 'Reviewing Indian law for your situation...',
    loadingDescription:
      'We are checking the legal category, structuring your next steps, and preparing a usable action pack.',
    loadingSignals: [
      'Matching your facts to the closest legal track',
      'Preparing practical next steps and authority guidance',
      'Getting the draft letter and checklist workspace ready',
    ],
    workspaceKicker: 'Case Workspace',
    workspaceTitle: 'Saved case workspace',
    workspaceDescription:
      'Keep your notes, evidence manifest, and draft exports tied to this issue so you can return without rebuilding everything.',
    workspaceReadyLabel: 'Auto-saving locally',
    workspaceSavedLabel: 'Saved',
    workspaceNameLabel: 'Workspace name',
    workspaceNotesLabel: 'Case notes',
    workspaceNotesPlaceholder:
      'Add witness names, promised callbacks, missing documents, or anything you want to remember before your next step.',
    downloadWorkspace: 'Download Case Pack',
    clearWorkspace: 'Clear Workspace',
    evidenceLockerTitle: 'Evidence locker',
    evidenceLockerDescription:
      'Upload files to create a structured evidence manifest. Files stay on this device, and the workspace remembers their labels and order.',
    uploadEvidence: 'Upload Evidence Files',
    uploadEvidenceHint:
      'Add screenshots, PDFs, invoices, notices, chats, photos, or recordings.',
    evidenceEmpty:
      'No evidence files logged yet. Add the documents you already have so your case pack feels concrete.',
    removeEvidence: 'Remove',
    evidenceCountSuffix: 'files',
    evidenceUnknownType: 'Unknown file type',
  },
  resources: {
    title: 'Research & Court Access',
    description:
      'Search Indian Kanoon through the backend integration and use official eCourts access pathways.',
    eyebrow: 'Resources',
    sourcesTitle: 'Sources',
    searchSourceLabel: 'Search source',
    searchIndianKanoon: 'Search Indian Kanoon',
    exploreEcourts: 'Explore eCourts access',
    ecourtsNote:
      'Public eCourts usage is routed through official search pathways because a stable public API contract was not found.',
    queryPlaceholder:
      'Search by issue, act, case phrase, party name, or known identifier.',
  },
  signIn: {
    eyebrow: 'Protected Google Sign-In',
    title: 'Sign in to continue',
    description:
      'Use your Google account to access a protected legal workspace, saved activity, and research-backed guidance.',
    chips: ['Protected access', 'Saved legal activity', 'Research-backed guidance'],
    loadingGoogle: 'Opening Google...',
    supportNote:
      'Use one verified Google account to continue into the protected legal workspace.',
  },
  pages: {
    featuresEyebrow: 'Features',
    featuresTitle: 'Explore the product by capability, not by scrolling forever.',
    featuresDescription:
      'Each capability is presented as a clear legal-tech workflow layer so the platform remains understandable as it grows.',
    categoriesEyebrow: 'Categories',
    categoriesTitle: 'Pick the legal path before you start writing.',
    categoriesDescription:
      'Each category page gives context, common next steps, and a clearer starting point before you ask the legal guide.',
    resourcesEyebrow: 'Resources',
  },
  resultMeta: {
    highUrgency: 'High urgency',
    mediumUrgency: 'Medium urgency',
    lowUrgency: 'Low urgency',
    mismatchBadge: 'Category mismatch',
    mismatchTitle: 'Selected category does not match',
    bestFitCategory: 'Best-fit category',
    chooseCloserCategory: 'Please choose a closer category.',
    switchTo: 'Switch to',
  },
});

function buildCopy(overrides = {}) {
  return Object.freeze({
    nav: { ...BASE_COPY.nav, ...(overrides.nav || {}) },
    common: { ...BASE_COPY.common, ...(overrides.common || {}) },
    home: { ...BASE_COPY.home, ...(overrides.home || {}) },
    assistant: { ...BASE_COPY.assistant, ...(overrides.assistant || {}) },
    result: { ...BASE_COPY.result, ...(overrides.result || {}) },
    resources: { ...BASE_COPY.resources, ...(overrides.resources || {}) },
    signIn: { ...BASE_COPY.signIn, ...(overrides.signIn || {}) },
    pages: { ...BASE_COPY.pages, ...(overrides.pages || {}) },
    resultMeta: { ...BASE_COPY.resultMeta, ...(overrides.resultMeta || {}) },
  });
}

const COPY = Object.freeze({
  English: buildCopy(),
  Hindi: buildCopy({
    nav: {
      home: 'होम',
      features: 'फीचर्स',
      categories: 'श्रेणियां',
      resources: 'संसाधन',
      signIn: 'गूगल से लॉगिन',
      signOut: 'साइन आउट',
    },
    common: {
      continueWithGoogle: 'गूगल के साथ जारी रखें',
      search: 'खोजें',
      loading: 'लोड हो रहा है',
      relatedCases: 'संबंधित मामले',
      officialCourtAccess: 'आधिकारिक न्यायालय पहुंच',
    },
    home: {
      heroEyebrow: 'भारत के लिए विश्वसनीय लीगल-टेक मार्गदर्शन',
      heroTitle: 'स्पष्टता, दस्तावेज़ीकरण और कार्रवाई के लिए संरचित कानूनी सहायता।',
      heroDescription:
        'सुरक्षित पहुंच, निर्देशित AI सहायता और स्रोत-आधारित शोध के साथ एक अधिक स्पष्ट कानूनी प्रक्रिया से गुजरें।',
      primaryCta: 'AI असिस्टेंट खोलें',
      secondaryCta: 'कानूनी संसाधन देखें',
    },
    assistant: {
      title: 'कानूनी मार्गदर्शन कार्यक्षेत्र',
      description:
        'एक श्रेणी चुनें, अपनी स्थिति समझाएं, और शोध संकेतों के साथ मार्गदर्शन देखें।',
      languageLabel: 'भाषा',
      categoryLabel: 'श्रेणी',
      issueLabel: 'अपनी स्थिति बताएं',
      submit: 'कानूनी मार्गदर्शन तैयार करें',
      loading: 'मार्गदर्शन तैयार हो रहा है...',
      historyTitle: 'हाल की गतिविधि',
      historyEmpty: 'हाल की गतिविधि देखने के लिए साइन इन करें और एक प्रश्न भेजें।',
    },
    resources: {
      title: 'शोध और न्यायालय पहुंच',
      description:
        'इंडियन कानून खोजें और आधिकारिक eCourts पहुंच मार्गों का उपयोग करें।',
      ecourtsNote:
        'सार्वजनिक eCourts उपयोग आधिकारिक खोज मार्गों से जुड़ा है क्योंकि स्थिर सार्वजनिक API उपलब्ध नहीं मिला।',
    },
    signIn: {
      title: 'जारी रखने के लिए साइन इन करें',
      description:
        'सुरक्षित कानूनी कार्यक्षेत्र, सहेजी गई गतिविधि और शोध-समर्थित मार्गदर्शन के लिए अपने गूगल खाते का उपयोग करें।',
    },
    pages: {
      featuresTitle: 'अंतहीन स्क्रोल के बजाय क्षमता के आधार पर उत्पाद को समझें।',
      categoriesTitle: 'लिखना शुरू करने से पहले सही कानूनी मार्ग चुनें।',
    },
  }),
  Kannada: buildCopy({
    nav: {
      home: 'ಮುಖಪುಟ',
      features: 'ವೈಶಿಷ್ಟ್ಯಗಳು',
      categories: 'ವರ್ಗಗಳು',
      resources: 'ಸಂಪನ್ಮೂಲಗಳು',
      signIn: 'ಗೂಗಲ್ ಮೂಲಕ ಲಾಗಿನ್',
      signOut: 'ಸೈನ್ ಔಟ್',
    },
    common: {
      continueWithGoogle: 'ಗೂಗಲ್ ಜೊತೆಗೆ ಮುಂದುವರಿಸಿ',
      search: 'ಹುಡುಕಿ',
      loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ',
    },
    home: {
      heroEyebrow: 'ಭಾರತಕ್ಕಾಗಿ ವಿಶ್ವಾಸಾರ್ಹ ಲೀಗಲ್-ಟೆಕ್ ಮಾರ್ಗದರ್ಶನ',
      heroTitle: 'ಸ್ಪಷ್ಟತೆ, ದಾಖಲೆ ಮತ್ತು ಕ್ರಿಯೆಗೆ ಸೂಕ್ತವಾದ ಸಂರಚಿತ ಕಾನೂನು ಸಹಾಯ.',
      heroDescription:
        'ಸುರಕ್ಷಿತ ಪ್ರವೇಶ, AI ಸಹಾಯ ಮತ್ತು ಮೂಲಾಧಾರಿತ ಸಂಶೋಧನೆಯೊಂದಿಗೆ ಸ್ಪಷ್ಟವಾದ ಕಾನೂನು ಪ್ರಕ್ರಿಯೆ ಮೂಲಕ ಸಾಗಿರಿ.',
      primaryCta: 'AI ಸಹಾಯಕ ತೆರೆಯಿರಿ',
      secondaryCta: 'ಕಾನೂನು ಸಂಪನ್ಮೂಲಗಳನ್ನು ನೋಡಿ',
    },
    assistant: {
      title: 'ಕಾನೂನು ಮಾರ್ಗದರ್ಶನ ಕಾರ್ಯಕ್ಷೇತ್ರ',
      description: 'ವರ್ಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ, ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯನ್ನು ವಿವರಿಸಿ ಮತ್ತು ಮಾರ್ಗದರ್ಶನವನ್ನು ಪರಿಶೀಲಿಸಿ.',
      languageLabel: 'ಭಾಷೆ',
      categoryLabel: 'ವರ್ಗ',
      issueLabel: 'ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯನ್ನು ವಿವರಿಸಿ',
      submit: 'ಕಾನೂನು ಮಾರ್ಗದರ್ಶನ ರಚಿಸಿ',
      loading: 'ಮಾರ್ಗದರ್ಶನ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...',
      historyTitle: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ',
    },
    resources: {
      title: 'ಸಂಶೋಧನೆ ಮತ್ತು ನ್ಯಾಯಾಲಯ ಪ್ರವೇಶ',
      description: 'ಇಂಡಿಯನ್ ಕಾನೂನ್ ಹುಡುಕಿ ಮತ್ತು ಅಧಿಕೃತ eCourts ಮಾರ್ಗಗಳನ್ನು ಬಳಸಿ.',
    },
    signIn: {
      title: 'ಮುಂದುವರಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ',
    },
  }),
  Tamil: buildCopy({
    nav: {
      home: 'முகப்பு',
      features: 'அம்சங்கள்',
      categories: 'வகைகள்',
      resources: 'ஆதாரங்கள்',
      signIn: 'கூகுளில் உள்நுழை',
      signOut: 'வெளியேறு',
    },
    common: {
      continueWithGoogle: 'கூகுளுடன் தொடரவும்',
      search: 'தேடல்',
      loading: 'ஏற்றப்படுகிறது',
    },
    home: {
      heroEyebrow: 'இந்தியாவிற்கான நம்பகமான சட்ட-தொழில்நுட்ப வழிகாட்டல்',
      heroTitle: 'தெளிவு, ஆவணப்படுத்தல் மற்றும் நடவடிக்கைக்காக வடிவமைக்கப்பட்ட சட்ட உதவி.',
      heroDescription:
        'பாதுகாப்பான அணுகல், AI உதவி மற்றும் ஆதாரபூர்வ ஆய்வுடன் தெளிவான சட்ட செயல்முறையில் நகருங்கள்.',
      primaryCta: 'AI உதவியாளரை திறக்கவும்',
      secondaryCta: 'சட்ட ஆதாரங்களை பார்க்கவும்',
    },
    assistant: {
      title: 'சட்ட வழிகாட்டல் பணியிடம்',
      description: 'ஒரு வகையைத் தேர்ந்தெடுத்து, உங்கள் நிலையை விளக்கி, வழிகாட்டலைப் பாருங்கள்.',
      languageLabel: 'மொழி',
      categoryLabel: 'வகை',
      issueLabel: 'உங்கள் நிலையை விவரிக்கவும்',
      submit: 'சட்ட வழிகாட்டலை உருவாக்கவும்',
      loading: 'வழிகாட்டல் தயாராகிறது...',
      historyTitle: 'சமீபத்திய செயல்பாடு',
    },
    resources: {
      title: 'ஆய்வு மற்றும் நீதிமன்ற அணுகல்',
      description: 'Indian Kanoon-ஐத் தேடவும் மற்றும் அதிகாரப்பூர்வ eCourts வழிகளைப் பயன்படுத்தவும்.',
    },
    signIn: {
      title: 'தொடர உள்நுழைக',
    },
  }),
  Telugu: buildCopy({
    nav: {
      home: 'హోమ్',
      features: 'ఫీచర్లు',
      categories: 'వర్గాలు',
      resources: 'వనరులు',
      signIn: 'గూగుల్‌తో లాగిన్',
      signOut: 'సైన్ అవుట్',
    },
    common: {
      continueWithGoogle: 'గూగుల్‌తో కొనసాగండి',
      search: 'శోధించండి',
      loading: 'లోడ్ అవుతోంది',
    },
    home: {
      heroEyebrow: 'భారతదేశానికి విశ్వసనీయ లీగల్-టెక్ మార్గదర్శకత్వం',
      heroTitle: 'స్పష్టత, డాక్యుమెంటేషన్ మరియు చర్య కోసం నిర్మిత న్యాయ సహాయం.',
      heroDescription:
        'సురక్షిత ప్రాప్తి, AI సహాయం, మరియు మూలాధారిత పరిశోధనతో స్పష్టమైన న్యాయ ప్రక్రియలో ముందుకు సాగండి.',
      primaryCta: 'AI సహాయకుడిని తెరవండి',
      secondaryCta: 'న్యాయ వనరులను చూడండి',
    },
    assistant: {
      title: 'న్యాయ మార్గదర్శక వర్క్‌స్పేస్',
      languageLabel: 'భాష',
      categoryLabel: 'వర్గం',
      issueLabel: 'మీ పరిస్థితిని వివరించండి',
      submit: 'న్యాయ మార్గదర్శకాన్ని సృష్టించండి',
      loading: 'మార్గదర్శకం సిద్ధమవుతోంది...',
    },
    resources: {
      title: 'పరిశోధన మరియు కోర్టు ప్రాప్తి',
    },
  }),
  Bengali: buildCopy({
    nav: {
      home: 'হোম',
      features: 'ফিচার',
      categories: 'বিভাগ',
      resources: 'রিসোর্স',
      signIn: 'গুগল দিয়ে লগইন',
      signOut: 'সাইন আউট',
    },
    common: {
      continueWithGoogle: 'গুগলের সঙ্গে চালিয়ে যান',
      search: 'খুঁজুন',
      loading: 'লোড হচ্ছে',
    },
    home: {
      heroEyebrow: 'ভারতের জন্য বিশ্বস্ত লিগ্যাল-টেক গাইডেন্স',
      heroTitle: 'স্বচ্ছতা, নথি এবং পদক্ষেপের জন্য গঠিত আইনি সহায়তা।',
      heroDescription:
        'নিরাপদ প্রবেশ, AI সহায়তা এবং উৎস-সমর্থিত গবেষণার সাথে পরিষ্কার আইনি প্রক্রিয়ায় এগিয়ে যান।',
      primaryCta: 'AI সহকারী খুলুন',
      secondaryCta: 'আইনি রিসোর্স দেখুন',
    },
    assistant: {
      title: 'আইনি নির্দেশনা কর্মক্ষেত্র',
      languageLabel: 'ভাষা',
      categoryLabel: 'বিভাগ',
      issueLabel: 'আপনার পরিস্থিতি বর্ণনা করুন',
      submit: 'আইনি নির্দেশনা তৈরি করুন',
      loading: 'নির্দেশনা তৈরি হচ্ছে...',
    },
    resources: {
      title: 'গবেষণা ও আদালত অ্যাক্সেস',
    },
  }),
  Marathi: buildCopy({
    nav: {
      home: 'मुख्यपृष्ठ',
      features: 'वैशिष्ट्ये',
      categories: 'वर्ग',
      resources: 'साधने',
      signIn: 'गूगलने लॉगिन',
      signOut: 'साइन आउट',
    },
    common: {
      continueWithGoogle: 'गूगलसह पुढे जा',
      search: 'शोधा',
      loading: 'लोड होत आहे',
    },
    home: {
      heroEyebrow: 'भारतासाठी विश्वासार्ह लीगल-टेक मार्गदर्शन',
      heroTitle: 'स्पष्टता, दस्तऐवजीकरण आणि कृतीसाठी संरचित कायदेशीर मदत.',
      heroDescription:
        'सुरक्षित प्रवेश, AI सहाय्य आणि स्रोत-आधारित संशोधनासह स्पष्ट कायदेशीर प्रक्रियेत पुढे चला.',
      primaryCta: 'AI सहाय्यक उघडा',
      secondaryCta: 'कायदेशीर साधने पहा',
    },
    assistant: {
      title: 'कायदेशीर मार्गदर्शन कार्यक्षेत्र',
      languageLabel: 'भाषा',
      categoryLabel: 'वर्ग',
      issueLabel: 'आपली परिस्थिती वर्णन करा',
      submit: 'कायदेशीर मार्गदर्शन तयार करा',
      loading: 'मार्गदर्शन तयार होत आहे...',
    },
    resources: {
      title: 'संशोधन आणि न्यायालय प्रवेश',
    },
  }),
});

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return window.localStorage.getItem(STORAGE_KEY) || fallbackLanguage;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = LANGUAGE_CODES[language] || 'en';
  }, [language]);

  const value = useMemo(() => {
    const selectedCopy = COPY[language] || COPY[fallbackLanguage];
    const localizedCopy =
      language === 'Tamil'
        ? mergeLocalizedCopy(selectedCopy, TAMIL_EXTRA_COPY)
        : selectedCopy;

    return {
      language,
      setLanguage,
      copy: localizedCopy,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider.');
  }

  return context;
}
