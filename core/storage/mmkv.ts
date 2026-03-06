import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV({
  id: "trackgym-storage",
});

export const queryStorage = createMMKV({
  id: "trackgym-query-cache",
});
