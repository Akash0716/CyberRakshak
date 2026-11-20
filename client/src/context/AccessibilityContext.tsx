import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'te';
export type FontSize = 'normal' | 'large';

interface AccessibilityContextType {
  language: Language;
  fontSize: FontSize;
  highContrast: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  toggleFontSize: () => void;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem('cyber_lang') as Language) || 'en'
  );
  const [fontSize, setFontSize] = useState<FontSize>(
    (localStorage.getItem('cyber_fontsize') as FontSize) || 'normal'
  );
  const [highContrast, setHighContrast] = useState<boolean>(
    localStorage.getItem('cyber_high_contrast') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('cyber_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cyber_fontsize', fontSize);
    if (fontSize === 'large') {
      document.documentElement.classList.add('text-lg');
    } else {
      document.documentElement.classList.remove('text-lg');
    }
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('cyber_high_contrast', String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'te' : 'en'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleFontSize = () => {
    setFontSize(prev => (prev === 'normal' ? 'large' : 'normal'));
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        language,
        fontSize,
        highContrast,
        toggleLanguage,
        setLanguage,
        toggleFontSize,
        toggleHighContrast
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

