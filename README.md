# TrackGym

A cross-platform fitness tracking app built with Expo (React Native). Browse exercises by body part, view animated GIFs, and track your workouts.

> [Documentacion en Espanol](docs/es/README.md)

## Tech Stack

- **React 19** / **React Native 0.83** / **Expo 55** (managed workflow)
- **Expo Router** - file-based routing
- **TypeScript** - strict mode
- **TanStack React Query** - server state & infinite pagination
- **Axios** - HTTP client
- **NativeWind (Tailwind CSS)** - styling
- **React Native Reanimated Carousel** - image slider

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm (`npm install -g pnpm`)
- Expo CLI (`npx expo`)
- Android Studio (for Android emulator/APK builds)

### Installation

```bash
git clone <repo-url>
cd fitness-app
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_RAPID_API_KEY` | RapidAPI key for the exercises API |
| `EXPO_PUBLIC_RAPID_BASE_URL` | Base URL for the exercises API |
| `EXPO_PUBLIC_RAPID_API_HOST` | RapidAPI host header value |

### Running

```bash
pnpm start           # Start Expo dev server
pnpm run android     # Run on Android emulator
pnpm run ios         # Run on iOS simulator
pnpm run web         # Run on web
```

### Testing

```bash
pnpm test                                    # Jest in watch mode
pnpm test -- --watchAll=false                # Run once (CI)
pnpm test -- --testPathPattern="Component"   # Single test file
```

## Documentation

| Topic | English | Spanish |
|---|---|---|
| Architecture | [docs/en/architecture.md](docs/en/architecture.md) | [docs/es/architecture.md](docs/es/architecture.md) |
| Android APK Build | [docs/en/android-build.md](docs/en/android-build.md) | [docs/es/android-build.md](docs/es/android-build.md) |

## Project Structure

```
fitness-app/
├── app/                    # Screens (Expo Router file-based routing)
│   ├── _layout.tsx         # Root layout (Stack + QueryClientProvider)
│   ├── index.tsx           # Welcome screen
│   ├── home.tsx            # Home with image slider & body parts grid
│   ├── exercises.tsx       # Exercise list by body part (infinite scroll)
│   └── exercise-details.tsx # Exercise detail view
├── components/             # Reusable UI components
├── core/                   # Business logic & infrastructure
│   ├── api/                # API endpoint definitions
│   ├── axios/              # Axios instance & interceptors
│   ├── constants/          # App constants & config
│   ├── hooks/              # Custom hooks (API hooks)
│   ├── toolbox/            # Shared interfaces & utilities
│   └── utils/              # Utility functions
├── assets/                 # Images, fonts, static files
└── docs/                   # Project documentation
    ├── en/                 # English
    └── es/                 # Spanish
```

## License

Private project.
