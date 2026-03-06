# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TrackGym is a cross-platform fitness tracking app built with Expo (React Native). It targets iOS, Android, and web from a single codebase. The app allows users to browse exercises by body part with infinite scroll pagination.

## Commands

- `pnpm start` - Start Expo dev server
- `pnpm run android` - Run on Android emulator
- `pnpm run ios` - Run on iOS simulator
- `pnpm run web` - Run on web (Metro with CSS support)
- `pnpm test` - Run tests (Jest in watch mode)
- `pnpm test -- --watchAll=false` - Run tests once (CI mode)
- `pnpm test -- --testPathPattern="ComponentName"` - Run a single test file

## Tech Stack

- **React 19** / **React Native 0.83** / **Expo 55** (managed workflow)
- **Expo Router** - file-based routing under `app/`
- **TypeScript** - strict mode enabled
- **TanStack React Query** - server state management with `useInfiniteQuery` for pagination
- **Axios** - HTTP client with centralized instance
- **NativeWind** - Tailwind CSS for React Native styling
- **react-native-mmkv** - synchronous key-value storage (query cache persistence + user preferences)
- **Jest + jest-expo** - testing

## Architecture

### Routing (Expo Router)

Routes are defined by the file structure in `app/`:
- `app/_layout.tsx` - Root layout: wraps app with `PersistQueryClientProvider` (MMKV-backed) + `Stack` navigator
- `app/index.tsx` - Welcome/landing screen
- `app/home.tsx` - Home screen with image slider carousel and body parts grid
- `app/exercises.tsx` - Exercise list by body part with infinite scroll (fullScreenModal)
- `app/exercise-details.tsx` - Exercise detail view (modal)

Navigation flow: `index → home → exercises → exercise-details`

### HTTP Layer (Axios)

- `core/axios/index.ts` - Centralized Axios instance with RapidAPI auth headers
- `apiCall<T, R>()` - Generic function that standardizes all API responses into `IRequestResponse<R>` shape (response, error, isCanceled, isError, message)
- API endpoints live in `core/api/` organized by domain (e.g., `core/api/rapid/body-parts.api.ts`)

### Server State (TanStack React Query)

- `QueryClient` is created and provided in `app/_layout.tsx` with MMKV-backed persistence via `PersistQueryClientProvider`
- API hooks live in `core/hooks/api/` mirroring the API structure
- Uses `useInfiniteQuery` for paginated endpoints with offset-based pagination
- The `select` option flattens pages into a single array for consumers
- `getNextPageParam` returns `undefined` when last page has fewer items than the limit

### Local Storage (MMKV)

- `core/storage/mmkv.ts` - Two MMKV instances: `storage` (user preferences) and `queryStorage` (React Query cache)
- `core/storage/client-storage.ts` - Adapter bridging MMKV to TanStack's `SyncStorage` interface
- `core/storage/user-preferences.ts` - Typed accessor API for user preferences (onboarding, last body part, etc.)
- New queries are automatically persisted — no extra config needed per endpoint
- See `docs/{en,es}/mmkv-storage.md` for full guide on adding preferences and endpoints

### Passing Data Between Screens

Expo Router params only support `string | string[]`. For complex objects, serialize with `JSON.stringify()` and parse with `JSON.parse()` on the receiving screen.

### Path Aliases

Configured in `tsconfig.json` and `babel.config.js`:
- `@components/*` → `components/*`
- `@core/*` → `core/*`
- `@modules/*` → `modules/*`
- `@assets/*` → `assets/*`

### Component Conventions

- Components use `.tsx` extension, utilities/constants use `.ts`
- Styling uses NativeWind (`className`) + inline `style` for dynamic responsive values
- Responsive sizing uses `hp()`/`wp()` utilities from `core/utils/percentage-screen.ts`
- Skeleton loading components use React Native `Animated` for pulse animations
- Entry point is `expo-router/entry` (configured in package.json `main` field)

### Environment Variables

All env vars use `EXPO_PUBLIC_` prefix. Defined in `.env` and re-exported from `core/constants/rapid-api.cts.ts`:
- `EXPO_PUBLIC_RAPID_API_KEY` - RapidAPI authentication key
- `EXPO_PUBLIC_RAPID_BASE_URL` - API base URL
- `EXPO_PUBLIC_RAPID_API_HOST` - RapidAPI host header

## Documentation

Full documentation available in `docs/` directory in both English (`docs/en/`) and Spanish (`docs/es/`):
- Architecture details: `docs/{en,es}/architecture.md`
- Android APK build guide: `docs/{en,es}/android-build.md`
- MMKV storage guide: `docs/{en,es}/mmkv-storage.md`

## Commit Conventions

Format: `<emoji> <type>(<scope>): <description>`

### Allowed Types

- ✨ `feat` - New feature
- 🐛 `fix` - Bug fix
- ♻️ `refactor` - Code change without fixing a bug or adding a feature
- 🎨 `style` - Formatting changes (whitespace, semicolons, etc.)
- 📝 `docs` - Documentation changes
- 🧪 `test` - Add or update tests
- 🔧 `chore` - Maintenance tasks (deps, configs, scripts)
- ⚡ `perf` - Performance improvement
- 🗑️ `remove` - Remove code or files
- 🚀 `deploy` - Deployment changes
- 🔒 `security` - Security fix
- 🏗️ `build` - Build system or external dependency changes

### Rules

- Always start with the emoji matching the type
- Write in English
- Use imperative mood: "add", "fix", "remove" (not "added", "fixing")
- First line: max 72 characters (including emoji)
- Scope is optional but recommended (name of the affected module/component)
- If the change needs more context, add a body separated by a blank line
- The body explains the **why**, not the **what** (the diff already shows the what)
- No period at the end of the first line

### Examples

```
✨ feat(auth): add login screen with email and password

🐛 fix(tabs): fix navigation not preserving state on tab switch

♻️ refactor(theme): extract colors into reusable constants

🔧 chore(deps): update expo to v55 and resolve incompatibilities

🧪 test(utils): add unit tests for date helper functions

🗑️ remove(legacy): remove deprecated v1 components
```
