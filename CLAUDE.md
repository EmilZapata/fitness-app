# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TrackGym is a cross-platform fitness tracking app built with Expo (React Native). It targets iOS, Android, and web from a single codebase.

## Commands

- `pnpm start` - Start Expo dev server
- `pnpm run android` - Run on Android emulator
- `pnpm run ios` - Run on iOS simulator
- `pnpm run web` - Run on web (Metro with CSS support)
- `pnpm test` - Run tests (Jest in watch mode)
- `pnpm test -- --watchAll=false` - Run tests once (CI mode)
- `pnpm test -- --testPathPattern="ComponentName"` - Run a single test file

## Tech Stack

- **React 19** / **React Native 0.84** / **Expo 55** (managed workflow)
- **Expo Router** - file-based routing under `app/`
- **TypeScript** - strict mode enabled
- **Jest + jest-expo** - testing
- **React Navigation** - underlying navigation with ThemeProvider

## Architecture

### Routing (Expo Router)

Routes are defined by the file structure in `app/`. Key conventions:
- `app/_layout.tsx` - Root layout: loads fonts, sets up ThemeProvider and Stack navigator
- `app/(tabs)/` - Parenthesized directory creates a tab group (does not affect URL path)
- `app/(tabs)/_layout.tsx` - Tab navigator configuration
- `app/[...missing].tsx` - Catch-all 404 screen
- `app/modal.tsx` - Modal presentation screen
- Initial route is `(tabs)` (configured via `unstable_settings`)

### Theme System

Light/dark mode is handled through a custom system:
- `constants/Colors.ts` - Defines color tokens for both themes (text, background, tint, tabIcon*)
- `components/Themed.tsx` - Exports theme-aware `<Text>` and `<View>` wrappers plus `useThemeColor()` hook
- Use the themed components from `components/Themed.tsx` instead of raw React Native `Text`/`View` for automatic dark mode support
- Color scheme is detected from the system via `useColorScheme()`, defaulting to light

### Component Conventions

- Components use `.tsx` extension, utilities/constants use `.ts`
- Styling uses React Native `StyleSheet.create()` (no external CSS-in-JS)
- Tests live in `components/__tests__/`
- Entry point is `expo-router/entry` (configured in package.json `main` field)

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
