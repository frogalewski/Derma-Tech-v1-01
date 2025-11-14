import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations, TranslationKey } from '../i18n/translations';
import * as dbService from '../services/dbService';

export type Language = 'pt-BR' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('pt-BR');

    useEffect(() => {
        const loadLanguage = async () => {
            await dbService.initDB();
            const savedLang = await dbService.getSetting<Language>('language');
            if (savedLang && (savedLang === 'en' || savedLang === 'pt-BR')) {
                setLanguageState(savedLang);
            }
        };
        loadLanguage();
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        dbService.setSetting('language', lang);
    }, []);

    const t = useCallback((key: TranslationKey, replacements?: Record<string, string | number>): string => {
        // FIX: The translation key can resolve to an object (e.g., 'prompts'), which would cause a runtime error.
        // We handle this by checking the type and returning the key as a fallback for non-string values.
        const translationValue = translations[language]?.[key] || translations['en'][key] || key;

        if (typeof translationValue !== 'string') {
            return key;
        }

        let translation: string = translationValue;
        if (replacements) {
            Object.keys(replacements).forEach(rKey => {
                // The replace call is now safe because we've confirmed `translation` is a string.
                translation = translation.replace(`{{${rKey}}}`, String(replacements[rKey]));
            });
        }
        // The return is now safe because we either returned early or are returning a string.
        return translation;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
