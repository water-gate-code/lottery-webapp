import en from "./en.json";
import ar from "./ar.json";
import ms from "./ms.json";
import th from "./th.json";

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
  th: {
    translation: th,
    displayName: "ภาษาไทย",
  },
};
