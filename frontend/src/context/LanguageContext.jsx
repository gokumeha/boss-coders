import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'nyayasaathi-language';

const COPY = {
  English: {
    nav: {
      home: 'Home',
      features: 'Features',
      categories: 'Categories',
      assistant: 'Assistant',
      resources: 'Resources',
      signIn: 'Sign In',
      signOut: 'Sign Out',
    },
    common: {
      continueWithGoogle: 'Continue with Google',
      protectedTitle: 'Sign in required',
      protectedBody:
        'Please sign in with Google to open your assistant workspace and saved activity.',
      openAssistant: 'Open Assistant',
      browseResources: 'Browse Resources',
      search: 'Search',
      loading: 'Loading',
      startNow: 'Start now',
      explore: 'Explore',
      relatedCases: 'Related cases',
      officialCourtAccess: 'Official court access',
    },
    home: {
      heroEyebrow: 'AI-guided legal navigation for India',
      heroTitle: 'A calmer legal journey, not one giant dashboard.',
      heroDescription:
        'Move through a cleaner product flow with routed pages, Google sign-in, saved progress, and source-backed follow-up.',
      primaryCta: 'Start with Google',
      secondaryCta: 'Explore Features',
    },
    assistant: {
      title: 'Legal Assistant Workspace',
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
        'Use your Google account to unlock saved searches, recent guidance, and a more continuous product flow.',
    },
  },
  Hindi: {
    nav: {
      home: 'होम',
      features: 'फीचर्स',
      categories: 'श्रेणियां',
      assistant: 'सहायक',
      resources: 'संसाधन',
      signIn: 'साइन इन',
      signOut: 'साइन आउट',
    },
    common: {
      continueWithGoogle: 'Google से जारी रखें',
      protectedTitle: 'साइन इन आवश्यक है',
      protectedBody: 'अपने सहायक कार्यक्षेत्र और सहेजी गई गतिविधि के लिए Google से साइन इन करें।',
      openAssistant: 'सहायक खोलें',
      browseResources: 'संसाधन देखें',
      search: 'खोजें',
      loading: 'लोड हो रहा है',
      startNow: 'अभी शुरू करें',
      explore: 'देखें',
      relatedCases: 'संबंधित मामले',
      officialCourtAccess: 'आधिकारिक कोर्ट एक्सेस',
    },
    home: {
      heroEyebrow: 'भारत के लिए एआई आधारित कानूनी मार्गदर्शन',
      heroTitle: 'एक साफ कानूनी यात्रा, न कि एक बड़ा डैशबोर्ड।',
      heroDescription:
        'रूटेड पेज, Google साइन-इन, सहेजी गई प्रगति और स्रोत-समर्थित अगले कदम के साथ आगे बढ़ें।',
      primaryCta: 'Google से शुरू करें',
      secondaryCta: 'फीचर्स देखें',
    },
    assistant: {
      title: 'कानूनी सहायक कार्यक्षेत्र',
      description:
        'श्रेणी चुनें, समस्या लिखें, और जुड़े हुए शोध संकेतों के साथ मार्गदर्शन देखें।',
      languageLabel: 'भाषा',
      categoryLabel: 'श्रेणी',
      issueLabel: 'अपनी स्थिति बताइए',
      submit: 'कानूनी मार्गदर्शन बनाएं',
      loading: 'आपके लिए मार्गदर्शन तैयार हो रहा है...',
      historyTitle: 'हाल की गतिविधि',
      historyEmpty: 'हाल की गतिविधि यहां सहेजने के लिए साइन इन करें और एक प्रश्न भेजें।',
    },
    result: {
      summary: 'स्थिति सारांश',
      rights: 'आपके अधिकार',
      laws: 'लागू कानून',
      steps: 'अगले कदम',
      draft: 'शिकायत प्रारूप',
      authority: 'कहां संपर्क करें',
      helplines: 'हेल्पलाइन और संसाधन',
      reset: 'फिर से शुरू करें',
    },
    resources: {
      title: 'शोध और कोर्ट एक्सेस',
      description:
        'बैकएंड इंटीग्रेशन के माध्यम से Indian Kanoon खोजें और आधिकारिक eCourts मार्गों का उपयोग करें।',
      searchIndianKanoon: 'Indian Kanoon खोजें',
      exploreEcourts: 'eCourts एक्सेस देखें',
      ecourtsNote:
        'स्थिर सार्वजनिक API उपलब्ध न होने के कारण eCourts उपयोग आधिकारिक खोज मार्गों के माध्यम से दिखाया गया है।',
    },
    signIn: {
      title: 'जारी रखने के लिए साइन इन करें',
      description:
        'सहेजी गई खोज, हाल की सलाह और बेहतर उत्पाद प्रवाह के लिए अपने Google खाते का उपयोग करें।',
    },
  },
  Kannada: {
    nav: {
      home: 'ಮುಖಪುಟ',
      features: 'ವೈಶಿಷ್ಟ್ಯಗಳು',
      categories: 'ವರ್ಗಗಳು',
      assistant: 'ಸಹಾಯಕ',
      resources: 'ಸಂಪನ್ಮೂಲಗಳು',
      signIn: 'ಸೈನ್ ಇನ್',
      signOut: 'ಸೈನ್ ಔಟ್',
    },
    common: {
      continueWithGoogle: 'Google ಮೂಲಕ ಮುಂದುವರಿಯಿರಿ',
      protectedTitle: 'ಸೈನ್ ಇನ್ ಅಗತ್ಯವಿದೆ',
      protectedBody: 'ನಿಮ್ಮ ಸಹಾಯಕ ಕಾರ್ಯಕ್ಷೇತ್ರಕ್ಕೆ Google ಮೂಲಕ ಸೈನ್ ಇನ್ ಮಾಡಿ.',
      openAssistant: 'ಸಹಾಯಕ ತೆರೆಯಿರಿ',
      browseResources: 'ಸಂಪನ್ಮೂಲಗಳನ್ನು ನೋಡಿ',
      search: 'ಹುಡುಕಿ',
      loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ',
      startNow: 'ಈಗ ಪ್ರಾರಂಭಿಸಿ',
      explore: 'ಅನ್ವೇಷಿಸಿ',
      relatedCases: 'ಸಂಬಂಧಿತ ಪ್ರಕರಣಗಳು',
      officialCourtAccess: 'ಅಧಿಕೃತ ನ್ಯಾಯಾಲಯ ಪ್ರವೇಶ',
    },
    home: {
      heroEyebrow: 'ಭಾರತಕ್ಕಾಗಿ AI ಆಧಾರಿತ ಕಾನೂನು ಮಾರ್ಗದರ್ಶನ',
      heroTitle: 'ಒಂದು ದೊಡ್ಡ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅಲ್ಲ, ಸ್ಪಷ್ಟ ಕಾನೂನು ಪಥ.',
      heroDescription: 'ರೌಟ್ ಮಾಡಿದ ಪುಟಗಳು, Google ಸೈನ್ ಇನ್ ಮತ್ತು ಉಳಿಸಿದ ಪ್ರಗತಿಯೊಂದಿಗೆ ಮುಂದೆ ಸಾಗಿರಿ.',
      primaryCta: 'Google ಮೂಲಕ ಪ್ರಾರಂಭಿಸಿ',
      secondaryCta: 'ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ನೋಡಿ',
    },
    assistant: {
      title: 'ಕಾನೂನು ಸಹಾಯಕ ಕಾರ್ಯಕ್ಷೇತ್ರ',
      description: 'ವರ್ಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ, ಸಮಸ್ಯೆಯನ್ನು ಬರೆಯಿರಿ ಮತ್ತು ಮಾರ್ಗದರ್ಶನವನ್ನು ಪರಿಶೀಲಿಸಿ.',
      languageLabel: 'ಭಾಷೆ',
      categoryLabel: 'ವರ್ಗ',
      issueLabel: 'ನಿಮ್ಮ ಸ್ಥಿತಿಯನ್ನು ವಿವರಿಸಿ',
      submit: 'ಕಾನೂನು ಮಾರ್ಗದರ್ಶನ ರಚಿಸಿ',
      loading: 'ನಿಮ್ಮ ಮಾರ್ಗದರ್ಶನ ಸಿದ್ಧಗೊಳ್ಳುತ್ತಿದೆ...',
      historyTitle: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ',
      historyEmpty: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆಯನ್ನು ಉಳಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.',
    },
    result: {
      summary: 'ಸ್ಥಿತಿ ಸಾರಾಂಶ',
      rights: 'ನಿಮ್ಮ ಹಕ್ಕುಗಳು',
      laws: 'ಅನ್ವಯಿಸುವ ಕಾನೂನುಗಳು',
      steps: 'ಮುಂದಿನ ಹೆಜ್ಜೆಗಳು',
      draft: 'ದೂರು ಕರಡು',
      authority: 'ಯಾರಿಗೆ ಸಂಪರ್ಕಿಸಬೇಕು',
      helplines: 'ಹೆಲ್ಪ್‌ಲೈನ್ ಮತ್ತು ಸಂಪನ್ಮೂಲಗಳು',
      reset: 'ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ',
    },
    resources: {
      title: 'ಶೋಧ ಮತ್ತು ನ್ಯಾಯಾಲಯ ಪ್ರವೇಶ',
      description: 'Indian Kanoon ಹುಡುಕಿ ಮತ್ತು ಅಧಿಕೃತ eCourts ಮಾರ್ಗಗಳನ್ನು ಬಳಸಿ.',
      searchIndianKanoon: 'Indian Kanoon ಹುಡುಕಿ',
      exploreEcourts: 'eCourts ನೋಡಿ',
      ecourtsNote: 'ಸ್ಥಿರ ಸಾರ್ವಜನಿಕ API ಸಿಗದ ಕಾರಣ ಅಧಿಕೃತ ಹುಡುಕಾಟ ಮಾರ್ಗಗಳನ್ನು ಬಳಸಲಾಗಿದೆ.',
    },
    signIn: {
      title: 'ಮುಂದುವರಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ',
      description: 'ಉಳಿಸಿದ ಹುಡುಕಾಟ ಮತ್ತು ಉತ್ತಮ ಪ್ರವಾಹಕ್ಕಾಗಿ ನಿಮ್ಮ Google ಖಾತೆಯನ್ನು ಬಳಸಿ.',
    },
  },
  Tamil: {
    nav: {
      home: 'முகப்பு',
      features: 'அம்சங்கள்',
      categories: 'வகைகள்',
      assistant: 'உதவியாளர்',
      resources: 'வளங்கள்',
      signIn: 'உள்நுழை',
      signOut: 'வெளியேறு',
    },
    common: {
      continueWithGoogle: 'Google மூலம் தொடரவும்',
      protectedTitle: 'உள்நுழைவு தேவை',
      protectedBody: 'உங்கள் உதவியாளர் பணிப்பகுதியை திறக்க Google மூலம் உள்நுழையவும்.',
      openAssistant: 'உதவியாளரை திறக்கவும்',
      browseResources: 'வளங்களை பார்க்கவும்',
      search: 'தேடவும்',
      loading: 'ஏற்றப்படுகிறது',
      startNow: 'இப்போது தொடங்கு',
      explore: 'ஆராய்',
      relatedCases: 'தொடர்புடைய வழக்குகள்',
      officialCourtAccess: 'அதிகாரப்பூர்வ நீதிமன்ற அணுகல்',
    },
    home: {
      heroEyebrow: 'இந்தியாவிற்கான AI சட்ட வழிகாட்டல்',
      heroTitle: 'ஒரே பெரிய டாஷ்போர்டு அல்ல, தெளிவான சட்டப் பயணம்.',
      heroDescription: 'ரூட்டிங், Google உள்நுழைவு, சேமிக்கப்பட்ட முன்னேற்றம் மற்றும் ஆதாரத்துடன் அடுத்த படிகள்.',
      primaryCta: 'Google மூலம் தொடங்கு',
      secondaryCta: 'அம்சங்களை பார்க்கவும்',
    },
    assistant: {
      title: 'சட்ட உதவியாளர் பணிப்பகம்',
      description: 'வகையை தேர்ந்தெடுத்து, சிக்கலை விளக்கி, வழிகாட்டலைப் பாருங்கள்.',
      languageLabel: 'மொழி',
      categoryLabel: 'வகை',
      issueLabel: 'உங்கள் நிலையை விவரிக்கவும்',
      submit: 'சட்ட வழிகாட்டலை உருவாக்கு',
      loading: 'உங்கள் வழிகாட்டல் தயாராகிறது...',
      historyTitle: 'சமீபத்திய செயல்பாடு',
      historyEmpty: 'சமீபத்திய செயல்பாட்டை சேமிக்க உள்நுழையவும்.',
    },
    result: {
      summary: 'நிலை சுருக்கம்',
      rights: 'உங்கள் உரிமைகள்',
      laws: 'பொருந்தும் சட்டங்கள்',
      steps: 'அடுத்த படிகள்',
      draft: 'புகார் வரைவு',
      authority: 'எங்கே அணுக வேண்டும்',
      helplines: 'உதவி எண்கள் மற்றும் வளங்கள்',
      reset: 'மீண்டும் தொடங்கு',
    },
    resources: {
      title: 'ஆராய்ச்சி மற்றும் நீதிமன்ற அணுகல்',
      description: 'Indian Kanoon தேடவும் மற்றும் அதிகாரப்பூர்வ eCourts பாதைகளைப் பயன்படுத்தவும்.',
      searchIndianKanoon: 'Indian Kanoon தேடு',
      exploreEcourts: 'eCourts அணுகலைப் பாருங்கள்',
      ecourtsNote: 'நிலையான பொதுப் API இல்லை என்பதால் அதிகாரப்பூர்வ தேடல் பாதைகள் பயன்படுத்தப்படுகின்றன.',
    },
    signIn: {
      title: 'தொடர உள்நுழைக',
      description: 'சேமிக்கப்பட்ட தேடல்கள் மற்றும் நல்ல ஓட்டத்திற்காக உங்கள் Google கணக்கைப் பயன்படுத்தவும்.',
    },
  },
  Telugu: {
    nav: {
      home: 'హోమ్',
      features: 'ఫీచర్లు',
      categories: 'వర్గాలు',
      assistant: 'సహాయకుడు',
      resources: 'వనరులు',
      signIn: 'సైన్ ఇన్',
      signOut: 'సైన్ అవుట్',
    },
    common: {
      continueWithGoogle: 'Google తో కొనసాగండి',
      protectedTitle: 'సైన్ ఇన్ అవసరం',
      protectedBody: 'మీ సహాయక కార్యక్షేత్రం కోసం Google తో సైన్ ఇన్ చేయండి.',
      openAssistant: 'సహాయకుడిని తెరవండి',
      browseResources: 'వనరులను చూడండి',
      search: 'శోధించండి',
      loading: 'లోడ్ అవుతోంది',
      startNow: 'ఇప్పుడే ప్రారంభించండి',
      explore: 'అన్వేషించండి',
      relatedCases: 'సంబంధిత కేసులు',
      officialCourtAccess: 'అధికారిక కోర్టు యాక్సెస్',
    },
    home: {
      heroEyebrow: 'భారతదేశానికి AI న్యాయ మార్గదర్శకం',
      heroTitle: 'ఒక పెద్ద డ్యాష్‌బోర్డ్ కాదు, స్పష్టమైన న్యాయ ప్రయాణం.',
      heroDescription: 'రూట్ చేసిన పేజీలు, Google సైన్ ఇన్, నిల్వ చేసిన పురోగతి మరియు ఆధారిత తదుపరి దశలు.',
      primaryCta: 'Google తో ప్రారంభించండి',
      secondaryCta: 'ఫీచర్లు చూడండి',
    },
    assistant: {
      title: 'న్యాయ సహాయక కార్యక్షేత్రం',
      description: 'వర్గాన్ని ఎంచుకుని, సమస్యను వివరించి, మార్గదర్శకాన్ని చూడండి.',
      languageLabel: 'భాష',
      categoryLabel: 'వర్గం',
      issueLabel: 'మీ పరిస్థితిని వివరించండి',
      submit: 'న్యాయ మార్గదర్శకాన్ని సృష్టించండి',
      loading: 'మీ మార్గదర్శకం సిద్ధమవుతోంది...',
      historyTitle: 'ఇటీవలి కార్యకలాపం',
      historyEmpty: 'ఇటీవలి కార్యకలాపాన్ని నిల్వ చేయడానికి సైన్ ఇన్ చేయండి.',
    },
    result: {
      summary: 'పరిస్థితి సారాంశం',
      rights: 'మీ హక్కులు',
      laws: 'వర్తించే చట్టాలు',
      steps: 'తదుపరి దశలు',
      draft: 'ఫిర్యాదు ముసాయిదా',
      authority: 'ఎక్కడ సంప్రదించాలి',
      helplines: 'హెల్ప్‌లైన్‌లు మరియు వనరులు',
      reset: 'మళ్లీ ప్రారంభించండి',
    },
    resources: {
      title: 'పరిశోధన మరియు కోర్టు యాక్సెస్',
      description: 'Indian Kanoon ను శోధించండి మరియు అధికారిక eCourts మార్గాలను ఉపయోగించండి.',
      searchIndianKanoon: 'Indian Kanoon శోధించండి',
      exploreEcourts: 'eCourts యాక్సెస్ చూడండి',
      ecourtsNote: 'స్థిరమైన పబ్లిక్ API కనిపించకపోవడంతో అధికారిక శోధన మార్గాలు ఉపయోగించబడుతున్నాయి.',
    },
    signIn: {
      title: 'కొనసాగేందుకు సైన్ ఇన్ చేయండి',
      description: 'నిల్వ చేసిన శోధనలు మరియు మెరుగైన ప్రవాహం కోసం Google ఖాతాను ఉపయోగించండి.',
    },
  },
  Bengali: {
    nav: {
      home: 'হোম',
      features: 'ফিচার',
      categories: 'বিভাগ',
      assistant: 'সহায়ক',
      resources: 'রিসোর্স',
      signIn: 'সাইন ইন',
      signOut: 'সাইন আউট',
    },
    common: {
      continueWithGoogle: 'Google দিয়ে চালিয়ে যান',
      protectedTitle: 'সাইন ইন প্রয়োজন',
      protectedBody: 'আপনার সহায়ক ওয়ার্কস্পেসের জন্য Google দিয়ে সাইন ইন করুন।',
      openAssistant: 'সহায়ক খুলুন',
      browseResources: 'রিসোর্স দেখুন',
      search: 'অনুসন্ধান',
      loading: 'লোড হচ্ছে',
      startNow: 'এখনই শুরু করুন',
      explore: 'দেখুন',
      relatedCases: 'সম্পর্কিত মামলা',
      officialCourtAccess: 'অফিসিয়াল কোর্ট অ্যাক্সেস',
    },
    home: {
      heroEyebrow: 'ভারতের জন্য AI ভিত্তিক আইনি দিশা',
      heroTitle: 'একটি বিশাল ড্যাশবোর্ড নয়, বরং পরিষ্কার আইনি যাত্রা।',
      heroDescription: 'রাউটেড পেজ, Google সাইন-ইন, সেভ করা অগ্রগতি এবং উৎসভিত্তিক পরবর্তী ধাপ।',
      primaryCta: 'Google দিয়ে শুরু করুন',
      secondaryCta: 'ফিচার দেখুন',
    },
    assistant: {
      title: 'আইনি সহায়ক ওয়ার্কস্পেস',
      description: 'বিভাগ বেছে নিন, সমস্যা লিখুন এবং দিশা দেখুন।',
      languageLabel: 'ভাষা',
      categoryLabel: 'বিভাগ',
      issueLabel: 'আপনার পরিস্থিতি লিখুন',
      submit: 'আইনি দিশা তৈরি করুন',
      loading: 'আপনার দিশা তৈরি হচ্ছে...',
      historyTitle: 'সাম্প্রতিক কার্যকলাপ',
      historyEmpty: 'সাম্প্রতিক কার্যকলাপ সংরক্ষণ করতে সাইন ইন করুন।',
    },
    result: {
      summary: 'পরিস্থিতির সারাংশ',
      rights: 'আপনার অধিকার',
      laws: 'প্রযোজ্য আইন',
      steps: 'পরবর্তী পদক্ষেপ',
      draft: 'অভিযোগের খসড়া',
      authority: 'কোথায় যোগাযোগ করবেন',
      helplines: 'হেল্পলাইন ও রিসোর্স',
      reset: 'আবার শুরু করুন',
    },
    resources: {
      title: 'গবেষণা ও কোর্ট অ্যাক্সেস',
      description: 'Indian Kanoon অনুসন্ধান করুন এবং অফিসিয়াল eCourts পথ ব্যবহার করুন।',
      searchIndianKanoon: 'Indian Kanoon অনুসন্ধান করুন',
      exploreEcourts: 'eCourts অ্যাক্সেস দেখুন',
      ecourtsNote: 'স্থিতিশীল পাবলিক API না পাওয়ায় অফিসিয়াল অনুসন্ধান পথ ব্যবহার করা হচ্ছে।',
    },
    signIn: {
      title: 'চালিয়ে যেতে সাইন ইন করুন',
      description: 'সংরক্ষিত অনুসন্ধান ও ভালো প্রবাহের জন্য আপনার Google অ্যাকাউন্ট ব্যবহার করুন।',
    },
  },
  Marathi: {
    nav: {
      home: 'मुख्यपृष्ठ',
      features: 'वैशिष्ट्ये',
      categories: 'विभाग',
      assistant: 'सहायक',
      resources: 'संसाधने',
      signIn: 'साइन इन',
      signOut: 'साइन आउट',
    },
    common: {
      continueWithGoogle: 'Google द्वारे पुढे जा',
      protectedTitle: 'साइन इन आवश्यक',
      protectedBody: 'आपले सहायक कार्यक्षेत्र उघडण्यासाठी Google द्वारे साइन इन करा.',
      openAssistant: 'सहायक उघडा',
      browseResources: 'संसाधने पाहा',
      search: 'शोधा',
      loading: 'लोड होत आहे',
      startNow: 'आत्ता सुरू करा',
      explore: 'पहा',
      relatedCases: 'संबंधित प्रकरणे',
      officialCourtAccess: 'अधिकृत न्यायालय प्रवेश',
    },
    home: {
      heroEyebrow: 'भारतासाठी AI आधारित कायदेशीर मार्गदर्शन',
      heroTitle: 'एक मोठा डॅशबोर्ड नव्हे, तर स्पष्ट कायदेशीर प्रवास.',
      heroDescription: 'रूटेड पेजेस, Google साइन-इन, जतन केलेली प्रगती आणि स्रोताधारित पुढील पावले.',
      primaryCta: 'Google द्वारे सुरू करा',
      secondaryCta: 'वैशिष्ट्ये पाहा',
    },
    assistant: {
      title: 'कायदेशीर सहायक कार्यक्षेत्र',
      description: 'विभाग निवडा, समस्या लिहा आणि मार्गदर्शन पहा.',
      languageLabel: 'भाषा',
      categoryLabel: 'विभाग',
      issueLabel: 'आपली परिस्थिती सांगा',
      submit: 'कायदेशीर मार्गदर्शन तयार करा',
      loading: 'आपले मार्गदर्शन तयार होत आहे...',
      historyTitle: 'अलीकडील क्रिया',
      historyEmpty: 'अलीकडील क्रिया जतन करण्यासाठी साइन इन करा.',
    },
    result: {
      summary: 'स्थितीचा सारांश',
      rights: 'आपले अधिकार',
      laws: 'लागू कायदे',
      steps: 'पुढील पावले',
      draft: 'तक्रार मसुदा',
      authority: 'कोठे संपर्क करावा',
      helplines: 'हेल्पलाईन आणि संसाधने',
      reset: 'पुन्हा सुरू करा',
    },
    resources: {
      title: 'संशोधन आणि न्यायालय प्रवेश',
      description: 'Indian Kanoon शोधा आणि अधिकृत eCourts मार्ग वापरा.',
      searchIndianKanoon: 'Indian Kanoon शोधा',
      exploreEcourts: 'eCourts प्रवेश पहा',
      ecourtsNote: 'स्थिर सार्वजनिक API उपलब्ध नसल्याने अधिकृत शोध मार्ग वापरले जात आहेत.',
    },
    signIn: {
      title: 'पुढे जाण्यासाठी साइन इन करा',
      description: 'जतन केलेल्या शोधांसाठी आणि चांगल्या प्रवाहासाठी Google खाते वापरा.',
    },
  },
};

const fallbackLanguage = 'English';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return window.localStorage.getItem(STORAGE_KEY) || fallbackLanguage;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === 'English' ? 'en' : language.toLowerCase();
  }, [language]);

  const value = useMemo(() => {
    const copy = COPY[language] || COPY[fallbackLanguage];

    return {
      language,
      setLanguage,
      copy,
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
