import type { Locale } from "../locales";
import type { Messages } from "../types";
import { cs } from "./cs";
import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";

const map: Record<Locale, Messages> = { en, es, fr, de, cs };

export function getMessages(locale: Locale): Messages {
  return map[locale] ?? en;
}
