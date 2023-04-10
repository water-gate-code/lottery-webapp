import i18n, { ResourceLanguage } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./langs/en.json";

export const initI18next = () => {
  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: {
        en: {
          translation: en as ResourceLanguage,
        },
      },
      lng: "en", // if you're using a language detector, do not define the lng option
      fallbackLng: "en",

      interpolation: {
        escapeValue: true,
      },
    });
};
