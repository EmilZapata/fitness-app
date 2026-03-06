import { queryStorage } from "./mmkv";

export const clientStorage = {
  getItem: (key: string): string | null => {
    return queryStorage.getString(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    queryStorage.set(key, value);
  },
  removeItem: (key: string): void => {
    queryStorage.remove(key);
  },
};
