# TrackGym

A cross-platform fitness tracking app built with Expo and React Native. Runs on iOS, Android, and web.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (included via npx)
- For iOS: Xcode and iOS Simulator
- For Android: Android Studio and an emulator

## Getting Started

```bash
pnpm install
pnpm start
```

This launches the Expo dev server. From there, press:
- `w` to open in web browser
- `i` to open in iOS Simulator
- `a` to open in Android emulator

Or run directly on a specific platform:

```bash
pnpm run web
pnpm run ios
pnpm run android
```

## Running Tests

```bash
pnpm test
```

## Tech Stack

- **Expo 55** (managed workflow)
- **React Native 0.84** / **React 19**
- **TypeScript** (strict mode)
- **Expo Router** (file-based routing)
- **Jest** (testing)
