# Architecture

## Overview

TrackGym follows a modular architecture separating screens (routing), reusable components, and core business logic.

## Routing (Expo Router)

Routes are defined by the file structure in `app/`:

| File | Description |
|---|---|
| `app/_layout.tsx` | Root layout: wraps the app with `QueryClientProvider` and a `Stack` navigator with hidden headers |
| `app/index.tsx` | Welcome/landing screen |
| `app/home.tsx` | Home screen with image slider carousel and body parts grid |
| `app/exercises.tsx` | Exercise list filtered by body part, with infinite scroll pagination |
| `app/exercise-details.tsx` | Exercise detail modal, receives serialized `Exercise` object via params |

### Navigation Flow

```
index (Welcome) → home → exercises (fullScreenModal) → exercise-details (modal)
```

### Passing Complex Data Between Screens

Expo Router params only support `string | string[]` values. To pass objects with nested arrays (like `Exercise`), serialize with `JSON.stringify()` on push and `JSON.parse()` on receive:

```typescript
// Sending
router.push({
  pathname: "/exercise-details",
  params: { item: JSON.stringify(exercise) },
});

// Receiving
const { item: itemJson } = useLocalSearchParams<{ item: string }>();
const item: Exercise = JSON.parse(itemJson);
```

## HTTP Layer (Axios)

### Configuration (`core/axios/index.ts`)

A centralized Axios instance configured with:

- **Base URL**: read from `EXPO_PUBLIC_RAPID_BASE_URL` env var
- **Timeout**: 30 seconds
- **Headers**: RapidAPI authentication headers (`X-RapidAPI-Key`, `X-RapidAPI-Host`)

### `apiCall<T, R>()` Generic Function

All API calls go through a single generic function that standardizes the response shape:

```typescript
async function apiCall<T, R>(payload: IRequestPayload<T>): Promise<IRequestResponse<R>>
```

**Parameters** (`IRequestPayload<T>`):
- `url` - endpoint path (appended to baseURL)
- `method` - `GET | POST | PUT | PATCH | DELETE`
- `body` - request body (for POST/PUT/PATCH)
- `signal` - AbortSignal for cancellation
- `params` - additional Axios config

**Response** (`IRequestResponse<R>`):
- `response: R | null` - parsed response data
- `error: IError | null` - structured error object
- `isError: boolean` - whether the request failed
- `isCanceled: boolean` - whether the request was cancelled
- `message: string` - server message

The function handles automatic error parsing and distinguishes between network errors and cancelled requests.

### API Endpoints (`core/api/`)

Each API domain has its own file exporting endpoint functions:

```
core/api/
└── rapid/
    └── body-parts.api.ts   # getExercisesByBodyPart(bodyPart, offset)
```

## Server State (TanStack React Query)

### Setup

`QueryClient` is created in `app/_layout.tsx` and provided via `QueryClientProvider` at the root level.

### Hooks (`core/hooks/api/`)

API hooks wrap TanStack Query hooks and live alongside their corresponding API files:

```
core/hooks/
└── api/
    └── rapid/
        └── body-part.hook.ts   # useApiBodyPart(bodyPart)
```

### Infinite Pagination Pattern

The exercises endpoint uses `useInfiniteQuery` for offset-based pagination:

```typescript
export const useApiBodyPart = (bodyPart: string) => {
  return useInfiniteQuery({
    queryKey: ["exercises", bodyPart],
    queryFn: ({ pageParam = 0 }) => getExercisesByBodyPart(bodyPart, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const exercises = lastPage.response;
      if (!exercises || exercises.length < EXERCISES_PAGE_LIMIT) {
        return undefined; // No more pages
      }
      return allPages.length * EXERCISES_PAGE_LIMIT;
    },
    enabled: !!bodyPart,
    staleTime: 1000 * 60 * 60, // 1 hour cache
    select: (data) => data.pages.flatMap((page) => page.response ?? []),
  });
};
```

Key points:
- `select` flattens all pages into a single `Exercise[]` array for consumers
- `getNextPageParam` returns `undefined` when the last page has fewer items than the limit (signals end of data)
- `enabled: !!bodyPart` prevents the query from running when no body part is selected
- The consuming component triggers `fetchNextPage()` via `onEndReached` on the FlatList

## Path Aliases

Configured in `tsconfig.json` and `babel.config.js`:

| Alias | Path |
|---|---|
| `@components/*` | `components/*` |
| `@core/*` | `core/*` |
| `@modules/*` | `modules/*` |
| `@assets/*` | `assets/*` |

## Styling

NativeWind (Tailwind CSS for React Native) is used via `className` props. For values that need dynamic calculation (responsive sizing), `StyleSheet` or inline `style` is used alongside `hp()`/`wp()` percentage utilities from `core/utils/percentage-screen.ts`.

## Environment Variables

All env vars are prefixed with `EXPO_PUBLIC_` so Expo bundles them into the client. They are re-exported from `core/constants/rapid-api.cts.ts` for centralized access.
