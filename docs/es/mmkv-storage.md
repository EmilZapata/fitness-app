# MMKV Storage

TrackGym usa [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) para almacenamiento key-value rapido y sincrono. Este documento explica la configuracion, el uso actual y como extenderlo.

## Resumen

MMKV proporciona dos capacidades principales en este proyecto:

1. **Persistencia de cache de React Query** — Las respuestas de la API cacheadas sobreviven al reinicio de la app, asi los usuarios ven datos instantaneamente sin esperar peticiones de red.
2. **Preferencias de usuario** — Lectura/escritura sincrona de configuraciones del usuario (estado de onboarding, ultimo body part seleccionado, etc.).

## Estructura de Archivos

```
core/storage/
├── index.ts                # Re-exporta todo
├── mmkv.ts                 # Instancias de MMKV
├── client-storage.ts       # Adaptador para el persister de TanStack Query
└── user-preferences.ts     # Accesores de preferencias de usuario
```

## Instancias de MMKV

Dos instancias separadas mantienen las responsabilidades aisladas (`core/storage/mmkv.ts`):

| Instancia | ID | Proposito |
|---|---|---|
| `storage` | `trackgym-storage` | Preferencias de usuario, estado de app, futuros tokens de auth |
| `queryStorage` | `trackgym-query-cache` | Solo cache persistida de React Query |

Separarlas permite limpiar la cache de queries sin perder preferencias del usuario (y viceversa).

## Persistencia de React Query

### Como Funciona

En `app/_layout.tsx`, el `QueryClientProvider` estandar se reemplaza por `PersistQueryClientProvider`:

```tsx
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { clientStorage } from "@core/storage";

const persister = createSyncStoragePersister({
  storage: clientStorage,
});

// Envuelve la app
<PersistQueryClientProvider
  client={queryClient}
  persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }}
>
  {/* ... */}
</PersistQueryClientProvider>
```

- `clientStorage` (`core/storage/client-storage.ts`) adapta MMKV a la interfaz `SyncStorage` que TanStack espera (`getItem`, `setItem`, `removeItem`).
- `maxAge` controla cuanto tiempo son validos los datos persistidos (24 horas por defecto).
- `gcTime` en el `QueryClient` debe ser >= `maxAge`, de lo contrario las queries se recolectan antes de poder restaurarse.

### Que Se Persiste

Todos los resultados exitosos de queries se persisten automaticamente. Cuando la app reinicia, los datos cacheados se restauran antes de que se dispare cualquier peticion de red, dando al usuario una UI instantanea.

Las queries con `staleTime` (como el hook de ejercicios con 24h) mostraran datos cacheados y solo refetchearan cuando esten stale.

### Agregar un Nuevo Endpoint de API

No se necesita configuracion de storage adicional. Solo crea tu hook como siempre:

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

El persister maneja el caching automaticamente porque envuelve todo el `QueryClient`.

## Preferencias de Usuario

`core/storage/user-preferences.ts` proporciona una API tipada para almacenar configuraciones del usuario. Todas las lecturas son **sincronas** — no se necesita `async/await`.

### Preferencias Actuales

```ts
import { userPreferences } from "@core/storage";

// Onboarding
userPreferences.getHasSeenOnboarding(); // boolean
userPreferences.setHasSeenOnboarding(true);

// Ultimo body part seleccionado
userPreferences.getLastBodyPart(); // string | null
userPreferences.setLastBodyPart("chest");
```

### Agregar una Nueva Preferencia

1. Agrega la key a la constante `KEYS`:

```ts
const KEYS = {
  HAS_SEEN_ONBOARDING: "user.hasSeenOnboarding",
  LAST_BODY_PART: "user.lastBodyPart",
  THEME: "user.theme",              // nueva
} as const;
```

2. Agrega metodos getter/setter:

```ts
export const userPreferences = {
  // ... metodos existentes

  getTheme: (): "light" | "dark" => {
    return (storage.getString(KEYS.THEME) as "light" | "dark") ?? "light";
  },

  setTheme: (theme: "light" | "dark"): void => {
    storage.set(KEYS.THEME, theme);
  },
};
```

3. Usalo en tu componente:

```tsx
const theme = userPreferences.getTheme();
```

### Tipos de Valores Soportados

MMKV soporta estos tipos nativamente (sin serializacion necesaria):

| Metodo | Tipo |
|---|---|
| `storage.getString(key)` | `string` |
| `storage.getNumber(key)` | `number` |
| `storage.getBoolean(key)` | `boolean` |
| `storage.set(key, value)` | `string \| number \| boolean` |

Para objetos o arrays, serializa manualmente:

```ts
// Escribir
storage.set("user.favorites", JSON.stringify(["bench-press", "squat"]));

// Leer
const favorites: string[] = JSON.parse(storage.getString("user.favorites") ?? "[]");
```

## Limpiar Storage

```ts
import { storage, queryStorage } from "@core/storage";

// Limpiar solo preferencias de usuario
storage.clearAll();

// Limpiar solo cache de queries
queryStorage.clearAll();

// Eliminar una key especifica
storage.remove("user.hasSeenOnboarding");
```

## Encriptacion (Opcional)

Para datos sensibles como tokens de auth, crea una instancia encriptada:

```ts
import { createMMKV } from "react-native-mmkv";

const secureStorage = createMMKV({
  id: "trackgym-secure",
  encryptionKey: "your-secret-key",
});
```

## Convencion de Nombres para Keys

Usa namespaces con dot-notation para organizar las keys:

| Prefijo | Proposito | Ejemplo |
|---|---|---|
| `user.*` | Preferencias/configuraciones del usuario | `user.theme`, `user.language` |
| `auth.*` | Datos de autenticacion | `auth.token`, `auth.refreshToken` |
| `app.*` | Estado a nivel de app | `app.lastVersion`, `app.installDate` |
