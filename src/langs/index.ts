import en from "./en.json";
import ar from "./ar.json";
import ms from "./ms.json";
import th from "./th.json";
import uk from "./uk.json";

export const langs: {
  [lang: string]: { translation: object; displayName: string };
} = {
  uk: {
    translation: uk,
    displayName: "Українська мова",
  },
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
