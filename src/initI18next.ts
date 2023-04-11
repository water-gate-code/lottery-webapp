import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { store } from "./store";
import { langs } from "./langs";
import {
  NotificationType,
  newNotification,
  notify,
  clearNotify,
} from "./store/slices/app";

const setHtmlAttribute = () => {
  document.getElementsByTagName("html")[0].setAttribute("dir", i18n.dir());
  document.getElementsByTagName("html")[0].setAttribute("lang", i18n.language);
};

export const changeLanguage = (lang: string) => {
  const notification = newNotification(
    NotificationType.info,
    "languageChanged"
  );
  store.dispatch(notify(notification));

  i18n.changeLanguage(lang, () => {
    setHtmlAttribute();
    setTimeout(() => store.dispatch(clearNotify(notification)), 3000);
  });
};
export const initI18next = () => {
  return i18n
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: langs,
      fallbackLng: "en",
      detection: {
        // keys or params to lookup language from
        lookupQuerystring: "lang",
        lookupCookie: "barsinoLang",
        lookupLocalStorage: "barsinoLang",
        lookupSessionStorage: "barsinoLang",
      },
    })
    .then(setHtmlAttribute);
};
