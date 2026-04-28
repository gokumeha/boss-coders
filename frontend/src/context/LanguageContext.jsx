import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'nyayasaathi-language';
const fallbackLanguage = 'English';

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
    heroTitle: 'Structured legal help built for clarity, documentation, and action.',
    heroDescription:
      'Move through a clearer legal workflow with protected access, guided AI assistance, and source-backed research.',
    primaryCta: 'Open AI Assistant',
    secondaryCta: 'Browse Legal Resources',
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
  },
  resources: {
    title: 'Research & Court Access',
    description:
      'Search Indian Kanoon through the backend integration and use official eCourts access pathways.',
    searchIndianKanoon: 'Search Indian Kanoon',
    exploreEcourts: 'Explore eCourts access',
    ecourtsNote:
      'Public eCourts usage is routed through official search pathways because a stable public API contract was not found.',
  },
  signIn: {
    title: 'Sign in to continue',
    description:
      'Use your Google account to access a protected legal workspace, saved activity, and research-backed guidance.',
  },
});

const COPY = Object.freeze({
  English: BASE_COPY,
  Hindi: BASE_COPY,
  Kannada: BASE_COPY,
  Tamil: BASE_COPY,
  Telugu: BASE_COPY,
  Bengali: BASE_COPY,
  Marathi: BASE_COPY,
});

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return window.localStorage.getItem(STORAGE_KEY) || fallbackLanguage;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang =
      language === 'English' ? 'en' : language.toLowerCase();
  }, [language]);

  const value = useMemo(() => {
    return {
      language,
      setLanguage,
      copy: COPY[language] || COPY[fallbackLanguage],
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
