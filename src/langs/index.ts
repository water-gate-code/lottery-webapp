import en from "./en.json";
import ar from "./ar.json";
import ms from "./ms.json";

export const langs: {
  [lang: string]: { translation: object; displayName: string };
} = {
  en: {
    translation: en,
    displayName: "English",
  },
  ms: {
    translation: ms,
    displayName: "Bahasa Melayu",
  },
  ar: {
    translation: ar,
    displayName: "العربية",
  },
};
