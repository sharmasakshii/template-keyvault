import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from 'translation/english/translation.json';

const resources = {
    en: {
        translation: translationEN,
    },
};

describe('i18next configuration', () => {
    const useSpy = jest.spyOn(i18next, 'use');
    i18next
        .use(initReactI18next)
        .init({
            resources,
            lng: 'en',
            keySeparator: false,
            interpolation: {
                escapeValue: false,
            },
        });

    expect(useSpy).toHaveBeenCalledWith(initReactI18next);

    // Assert that i18next is initialized
    expect(i18next.isInitialized).toBe(true);

    // Clean up the spy
    useSpy.mockRestore();


    it('should initialize with the correct configuration', () => {
        expect(i18next.language).toBe('en');
        expect(i18next.isInitialized).toBe(true);
    });

    it('should return correct translation for existing keys', () => {
        const sustainabilityDashboardTitle = 'sustainabilityDashboardTitle'; // Replace with an actual key from your translation.json
        const translationENDto: any = translationEN
        const translation = translationENDto[sustainabilityDashboardTitle];

        expect(i18next.t(sustainabilityDashboardTitle)).toBe(translation);
    });

    it('should return the key itself for missing translations', () => {
        const missingKey = 'nonexistent_key';
        expect(i18next.t(missingKey)).toBe(missingKey);
    });
});
