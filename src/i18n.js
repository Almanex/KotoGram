import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ru from './locales/ru';
import en from './locales/en';
import de from './locales/de';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            ru,
            en,
            de
        },
        lng: 'ru',
        fallbackLng: 'ru',
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'i18nextLng',
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false
        },
        load: 'languageOnly',
        returnEmptyString: false,
        returnNull: false,
        returnObjects: true,
        saveMissing: false,
        nsSeparator: false,
        keySeparator: '.',
    });

// Сохраняем выбранный язык при его изменении
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('i18nextLng', lng);
});

// Принудительно устанавливаем русский язык при первом запуске
if (!localStorage.getItem('i18nextLng')) {
    i18n.changeLanguage('ru');
}

export default i18n; 