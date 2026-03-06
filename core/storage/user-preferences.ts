import { storage } from "./mmkv";

const KEYS = {
  HAS_SEEN_ONBOARDING: "user.hasSeenOnboarding",
  LAST_BODY_PART: "user.lastBodyPart",
  LANGUAGE: "user.language",
} as const;

export const userPreferences = {
  getHasSeenOnboarding: (): boolean => {
    return storage.getBoolean(KEYS.HAS_SEEN_ONBOARDING) ?? false;
  },

  setHasSeenOnboarding: (value: boolean): void => {
    storage.set(KEYS.HAS_SEEN_ONBOARDING, value);
  },

  getLastBodyPart: (): string | null => {
    return storage.getString(KEYS.LAST_BODY_PART) ?? null;
  },

  setLastBodyPart: (bodyPart: string): void => {
    storage.set(KEYS.LAST_BODY_PART, bodyPart);
  },

  getLanguage: (): string | null => {
    return storage.getString(KEYS.LANGUAGE) ?? null;
  },

  setLanguage: (lang: string): void => {
    storage.set(KEYS.LANGUAGE, lang);
  },
};
