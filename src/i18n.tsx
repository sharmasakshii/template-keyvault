import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all locales
import translationEN from './translation/english/translation.json';

const resources = {
    en: {
        translation: translationEN
    },
};

i18next
    .use(initReactI18next)  // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'en', // if you're using a language detector, do not define the lng option
        keySeparator: false, // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    })


export default i18next