
export type Language = 'en' | 'bn' | 'hi';

export interface Translations {
  [key: string]: {
    en: string;
    bn: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Navigation
  back: {
    en: 'Back',
    bn: 'ফিরে যান',
    hi: 'पीछे',
  },
  backToSubjects: {
    en: 'Back to Subjects',
    bn: 'বিষয়ে ফিরে যান',
    hi: 'विषयों पर वापस जाएं',
  },
  backToLanding: {
    en: 'Back to Home',
    bn: 'হোমে ফিরে যান',
    hi: 'होम पर वापस जाएं',
  },
  theory: {
    en: 'Theory',
    bn: 'তত্ত্ব',
    hi: 'सिद्धांत',
  },
  visualization: {
    en: 'Visualization',
    bn: 'ভিজ্যুয়ালাইজেশন',
    hi: 'दृश्यता',
  },
  classroom: {
    en: 'Classroom',
    bn: 'ক্লাসরুম',
    hi: 'कक्षा',
  },

  // Landing Page
  futureOfLearning: {
    en: 'The Future of Learning',
    bn: 'শিক্ষার ভবিষ্যৎ',
    hi: 'सीखने का भविष्य',
  },
  omniScience: {
    en: 'OMNI SCIENCE',
    bn: 'অমনি সায়েন্স',
    hi: 'ओमनी साइंस',
  },
  enterLab: {
    en: 'Enter Laboratory',
    bn: 'ল্যাবরেটরিতে প্রবেশ করুন',
    hi: 'प्रयोगशाला में प्रवेश करें',
  },
  labDescription: {
    en: 'A multi-dimensional interactive laboratory designed to bridge the gap between theoretical science and intuitive understanding.',
    bn: 'তাত্ত্বিক বিজ্ঞান এবং স্বজ্ঞাত বোঝার মধ্যে ব্যবধান পূরণ করার জন্য ডিজাইন করা একটি বহুমাত্রিক ইন্টারেক্টিভ ল্যাবরেটরি।',
    hi: 'सैद्धांतिक विज्ञान और सहज समझ के बीच की खाई को पाटने के लिए डिज़ाइन की गई एक बहु-आयामी इंटरैक्टिव प्रयोगशाला।',
  },

  // Topic Page
  theoreticalFoundation: {
    en: 'Theoretical Foundation',
    bn: 'তাত্ত্বিক ভিত্তি',
    hi: 'सैद्धांतिक आधार',
  },
  readAloud: {
    en: 'Read Aloud',
    bn: 'জোরে পড়ুন',
    hi: 'ज़ोर से पढ़ें',
  },
  stopReading: {
    en: 'Stop Reading',
    bn: 'পড়া বন্ধ করুন',
    hi: 'पढ़ना बंद करें',
  },
  referenceMaterials: {
    en: 'Reference Materials',
    bn: 'রেফারেন্স উপকরণ',
    hi: 'संदर्भ सामग्री',
  },
  ingestModule: {
    en: 'Ingest Module',
    bn: 'ইনজেস্ট মডিউল',
    hi: 'इंजेস্ট मॉड्यूल',
  },
  present: {
    en: 'Present',
    bn: 'উপস্থাপন করুন',
    hi: 'प्रस्तुत करें',
  },
  initializeModule: {
    en: 'Initialize Module',
    bn: 'মডিউল শুরু করুন',
    hi: 'मॉड्यूल प्रारंभ करें',
  },

  // Settings
  accessibility: {
    en: 'Accessibility',
    bn: 'অ্যাক্সেসিবিলিটি',
    hi: 'एक्सेसिबिलिटी',
  },
  colorblindMode: {
    en: 'Colorblind Mode',
    bn: 'কালারব্লাইন্ড মোড',
    hi: 'कलरब्लाइंड मोड',
  },
  enhancedContrast: {
    en: 'Enhanced contrast',
    bn: 'উন্নত বৈসাদৃশ্য',
    hi: 'बेहतर कंट्रास्ट',
  },
  theme: {
    en: 'Theme',
    bn: 'থিম',
    hi: 'थीम',
  },
  language: {
    en: 'Language',
    bn: 'ভাষা',
    hi: 'भाषा',
  },
  dark: {
    en: 'Dark',
    bn: 'ডার্ক',
    hi: 'डार्क',
  },
  light: {
    en: 'Light',
    bn: 'লাইট',
    hi: 'लाइट',
  },

  // AI Tutor
  labAssistant: {
    en: 'Lab Assistant',
    bn: 'ল্যাব সহকারী',
    hi: 'लैब सहायक',
  },
  systemReady: {
    en: 'SYSTEM_READY',
    bn: 'সিস্টেম প্রস্তুত',
    hi: 'सिस्टम तैयार',
  },
  prompts: {
    en: 'Prompts',
    bn: 'প্রম্পট',
    hi: 'प्रॉम्प्ट',
  },
  queryEngine: {
    en: 'Query the lab engine...',
    bn: 'ল্যাব ইঞ্জিন অনুসন্ধান করুন...',
    hi: 'लैब इंजन से पूछें...',
  },
  pressEnter: {
    en: 'Press Enter to Send',
    bn: 'পাঠাতে এন্টার টিপুন',
    hi: 'भेजने के लिए एंटर दबाएं',
  }
};
