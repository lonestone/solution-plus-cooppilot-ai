import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./assets/i18n/en.json";
import fr from "./assets/i18n/fr.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    fr: {
      translation: fr,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
