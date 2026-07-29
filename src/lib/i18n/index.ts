export type { CabinId, Messages } from "./types";
export {
  defaultLocale,
  localeLabels,
  locales,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "./locales";
export { getMessages } from "./dictionaries";
export { LocaleProvider, useI18n } from "./LocaleProvider";
