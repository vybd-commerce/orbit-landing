import type { Locale } from "../locales";
import { en, type Messages } from "./en";
import { zh } from "./zh";
import { ko } from "./ko";
import { ja } from "./ja";
import { fr } from "./fr";
import { es } from "./es";

export type { Messages };

export const MESSAGES: Record<Locale, Messages> = { en, zh, ko, ja, fr, es };
