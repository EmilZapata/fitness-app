import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { userPreferences } from "@core/storage/user-preferences";

import en from "./locales/en";
import es from "./locales/es";

const deviceLang = getLocales()[0]?.languageCode ?? "en";
const savedLang = userPreferences.getLanguage();
const resolvedLang = savedLang ?? (deviceLang === "es" ? "es" : "en");

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: resolvedLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
