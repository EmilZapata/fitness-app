# MMKV Storage

TrackGym uses [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) for fast, synchronous key-value storage. This document explains the setup, current usage, and how to extend it.

## Overview

MMKV provides two main capabilities in this project:

1. **React Query cache persistence** — Cached API responses survive app restarts, so users see data instantly without waiting for network requests.
2. **User preferences** — Synchronous read/write of user settings (onboarding state, last selected body part, etc.).

## File Structure

```
core/storage/
├── index.ts                # Re-exports everything
├── mmkv.ts                 # MMKV instances
├── client-storage.ts       # Adapter for TanStack Query persister
└── user-preferences.ts     # User preference accessors
```

## MMKV Instances

Two separate MMKV instances keep concerns isolated (`core/storage/mmkv.ts`):

| Instance | ID | Purpose |
|---|---|---|
| `storage` | `trackgym-storage` | User preferences, app state, future auth tokens |
| `queryStorage` | `trackgym-query-cache` | React Query persisted cache only |

Separating them means you can clear the query cache without losing user preferences (and vice versa).

## React Query Persistence

### How It Works

In `app/_layout.tsx`, the standard `QueryClientProvider` is replaced with `PersistQueryClientProvider`:

```tsx
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { clientStorage } from "@core/storage";

const persister = createSyncStoragePersister({
  storage: clientStorage,
});

// Wraps the app
<PersistQueryClientProvider
  client={queryClient}
  persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }}
>
  {/* ... */}
</PersistQueryClientProvider>
```

- `clientStorage` (`core/storage/client-storage.ts`) adapts MMKV to the `SyncStorage` interface that TanStack expects (`getItem`, `setItem`, `removeItem`).
- `maxAge` controls how long persisted data is valid (24 hours by default).
- `gcTime` on the `QueryClient` must be >= `maxAge`, otherwise queries get garbage-collected before they can be restored.

### What Gets Persisted

All successful query results are automatically persisted. When the app restarts, cached data is restored before any network request fires, giving users an instant UI.

Queries with `staleTime` (like the exercises hook with 24h stale time) will show cached data and only refetch when stale.

### Adding a New API Endpoint

No extra storage configuration is needed. Just create your hook as usual:

```ts
// core/hooks/api/rapid/equipment.hook.ts
import { useQuery } from "@tanstack/react-query";
import { getEquipmentList } from "@core/api/rapid/equipment.api";

export const useApiEquipment = () => {
  return useQuery({
    queryKey: ["equipment"],
    queryFn: getEquipmentList,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
```

The persister handles caching automatically because it wraps the entire `QueryClient`.

## User Preferences

`core/storage/user-preferences.ts` provides a typed API for storing user settings. All reads are **synchronous** — no `async/await` needed.

### Current Preferences

```ts
import { userPreferences } from "@core/storage";

// Onboarding
userPreferences.getHasSeenOnboarding(); // boolean
userPreferences.setHasSeenOnboarding(true);

// Last selected body part
userPreferences.getLastBodyPart(); // string | null
userPreferences.setLastBodyPart("chest");
```

### Adding a New Preference

1. Add the key to the `KEYS` constant:

```ts
const KEYS = {
  HAS_SEEN_ONBOARDING: "user.hasSeenOnboarding",
  LAST_BODY_PART: "user.lastBodyPart",
  THEME: "user.theme",              // new
} as const;
```

2. Add getter/setter methods:

```ts
export const userPreferences = {
  // ... existing methods

  getTheme: (): "light" | "dark" => {
    return (storage.getString(KEYS.THEME) as "light" | "dark") ?? "light";
  },

  setTheme: (theme: "light" | "dark"): void => {
    storage.set(KEYS.THEME, theme);
  },
};
```

3. Use it in your component:

```tsx
const theme = userPreferences.getTheme();
```

### Supported Value Types

MMKV supports these types natively (no serialization needed):

| Method | Type |
|---|---|
| `storage.getString(key)` | `string` |
| `storage.getNumber(key)` | `number` |
| `storage.getBoolean(key)` | `boolean` |
| `storage.set(key, value)` | `string \| number \| boolean` |

For objects or arrays, serialize manually:

```ts
// Write
storage.set("user.favorites", JSON.stringify(["bench-press", "squat"]));

// Read
const favorites: string[] = JSON.parse(storage.getString("user.favorites") ?? "[]");
```

## Clearing Storage

```ts
import { storage, queryStorage } from "@core/storage";

// Clear user preferences only
storage.clearAll();

// Clear query cache only
queryStorage.clearAll();

// Remove a specific key
storage.remove("user.hasSeenOnboarding");
```

## Encryption (Optional)

For sensitive data like auth tokens, create an encrypted instance:

```ts
import { createMMKV } from "react-native-mmkv";

const secureStorage = createMMKV({
  id: "trackgym-secure",
  encryptionKey: "your-secret-key",
});
```

## Key Naming Convention

Use dot-notation namespaces to organize keys:

| Prefix | Purpose | Example |
|---|---|---|
| `user.*` | User preferences/settings | `user.theme`, `user.language` |
| `auth.*` | Authentication data | `auth.token`, `auth.refreshToken` |
| `app.*` | App-level state | `app.lastVersion`, `app.installDate` |
