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

// <script id="bootstrap-tag">
//   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous" />
// </script>
// <script id="bootstrap-rtl-tag">
//   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.rtl.min.css" rel="stylesheet" integrity="sha384-T5m5WERuXcjgzF8DAb7tRkByEZQGcpraRTinjpywg37AO96WoYN9+hrhDVoM6CaT" crossorigin="anonymous" />
// </script>

const ltr = {
  href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css",
  rel: "stylesheet",
  integrity:
    "sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ",
  crossorigin: "anonymous",
};
const rtl = {
  href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.rtl.min.css",
  rel: "stylesheet",
  integrity:
    "sha384-T5m5WERuXcjgzF8DAb7tRkByEZQGcpraRTinjpywg37AO96WoYN9+hrhDVoM6CaT",
  crossorigin: "anonymous",
};

function switchBootstrap() {
  const id = "bootstrap-css";
  const preLinkDom = document.getElementById(id);

  if (preLinkDom) preLinkDom.remove(); // remove previous css link dom

  // create new link dom with correct config(css link, all dom settings)
  const bootstrapConfig: { [key: string]: string } =
    i18n.dir() === "rtl" ? rtl : ltr;
  const nextLinkDom = document.createElement("link");
  Object.keys(bootstrapConfig).forEach((key) => {
    nextLinkDom.setAttribute(key, bootstrapConfig[key]);
  });
  nextLinkDom.setAttribute("id", id);

  // append new link dom into head
  document.getElementsByTagName("head")[0].append(nextLinkDom);
}

const setHtmlAttribute = () => {
  const htmlDom = document.getElementsByTagName("html")[0];
  htmlDom.setAttribute("lang", i18n.language); // set language

  const preDir = htmlDom.getAttribute("dir");
  const nextDir = i18n.dir();

  if (!preDir && nextDir === "ltr") return; // default css is loaded as ltr, don't need to do anything

  // if dir changed, switch bootstrap
  if (preDir !== nextDir) {
    htmlDom.setAttribute("dir", nextDir);
    switchBootstrap();
  }
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
