# Arquitectura

## Resumen

TrackGym sigue una arquitectura modular que separa pantallas (routing), componentes reutilizables y logica de negocio central.

## Routing (Expo Router)

Las rutas se definen por la estructura de archivos en `app/`:

| Archivo | Descripcion |
|---|---|
| `app/_layout.tsx` | Layout raiz: envuelve la app con `QueryClientProvider` y un navegador `Stack` con headers ocultos |
| `app/index.tsx` | Pantalla de bienvenida/landing |
| `app/home.tsx` | Pantalla principal con carrusel de imagenes y grilla de partes del cuerpo |
| `app/exercises.tsx` | Lista de ejercicios filtrada por parte del cuerpo, con paginacion infinita |
| `app/exercise-details.tsx` | Modal de detalle del ejercicio, recibe un objeto `Exercise` serializado via params |

### Flujo de Navegacion

```
index (Bienvenida) → home → exercises (fullScreenModal) → exercise-details (modal)
```

### Pasar Datos Complejos Entre Pantallas

Los params de Expo Router solo soportan valores `string | string[]`. Para pasar objetos con arrays anidados (como `Exercise`), se serializa con `JSON.stringify()` al enviar y `JSON.parse()` al recibir:

```typescript
// Enviando
router.push({
  pathname: "/exercise-details",
  params: { item: JSON.stringify(exercise) },
});

// Recibiendo
const { item: itemJson } = useLocalSearchParams<{ item: string }>();
const item: Exercise = JSON.parse(itemJson);
```

## Capa HTTP (Axios)

### Configuracion (`core/axios/index.ts`)

Una instancia centralizada de Axios configurada con:

- **Base URL**: leida de la variable de entorno `EXPO_PUBLIC_RAPID_BASE_URL`
- **Timeout**: 30 segundos
- **Headers**: headers de autenticacion de RapidAPI (`X-RapidAPI-Key`, `X-RapidAPI-Host`)

### Funcion Generica `apiCall<T, R>()`

Todas las llamadas API pasan por una unica funcion generica que estandariza la forma de la respuesta:

```typescript
async function apiCall<T, R>(payload: IRequestPayload<T>): Promise<IRequestResponse<R>>
```

**Parametros** (`IRequestPayload<T>`):
- `url` - ruta del endpoint (se agrega a la baseURL)
- `method` - `GET | POST | PUT | PATCH | DELETE`
- `body` - cuerpo de la peticion (para POST/PUT/PATCH)
- `signal` - AbortSignal para cancelacion
- `params` - configuracion adicional de Axios

**Respuesta** (`IRequestResponse<R>`):
- `response: R | null` - datos de respuesta parseados
- `error: IError | null` - objeto de error estructurado
- `isError: boolean` - si la peticion fallo
- `isCanceled: boolean` - si la peticion fue cancelada
- `message: string` - mensaje del servidor

La funcion maneja parseo automatico de errores y distingue entre errores de red y peticiones canceladas.

### Endpoints API (`core/api/`)

Cada dominio de API tiene su propio archivo exportando funciones de endpoint:

```
core/api/
└── rapid/
    └── body-parts.api.ts   # getExercisesByBodyPart(bodyPart, offset)
```

## Estado del Servidor (TanStack React Query)

### Configuracion

`QueryClient` se crea en `app/_layout.tsx` y se provee via `QueryClientProvider` en el nivel raiz.

### Hooks (`core/hooks/api/`)

Los hooks de API envuelven hooks de TanStack Query y viven junto a sus archivos API correspondientes:

```
core/hooks/
└── api/
    └── rapid/
        └── body-part.hook.ts   # useApiBodyPart(bodyPart)
```

### Patron de Paginacion Infinita

El endpoint de ejercicios usa `useInfiniteQuery` para paginacion basada en offset:

```typescript
export const useApiBodyPart = (bodyPart: string) => {
  return useInfiniteQuery({
    queryKey: ["exercises", bodyPart],
    queryFn: ({ pageParam = 0 }) => getExercisesByBodyPart(bodyPart, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const exercises = lastPage.response;
      if (!exercises || exercises.length < EXERCISES_PAGE_LIMIT) {
        return undefined; // No hay mas paginas
      }
      return allPages.length * EXERCISES_PAGE_LIMIT;
    },
    enabled: !!bodyPart,
    staleTime: 1000 * 60 * 60, // 1 hora de cache
    select: (data) => data.pages.flatMap((page) => page.response ?? []),
  });
};
```

Puntos clave:
- `select` aplana todas las paginas en un unico array `Exercise[]` para los consumidores
- `getNextPageParam` retorna `undefined` cuando la ultima pagina tiene menos items que el limite (indica fin de datos)
- `enabled: !!bodyPart` previene que la query se ejecute cuando no hay parte del cuerpo seleccionada
- El componente consumidor dispara `fetchNextPage()` via `onEndReached` en el FlatList

## Alias de Rutas

Configurados en `tsconfig.json` y `babel.config.js`:

| Alias | Ruta |
|---|---|
| `@components/*` | `components/*` |
| `@core/*` | `core/*` |
| `@modules/*` | `modules/*` |
| `@assets/*` | `assets/*` |

## Estilos

NativeWind (Tailwind CSS para React Native) se usa via props `className`. Para valores que necesitan calculo dinamico (tamanos responsivos), se usa `StyleSheet` o `style` inline junto con las utilidades de porcentaje `hp()`/`wp()` de `core/utils/percentage-screen.ts`.

## Variables de Entorno

Todas las variables de entorno llevan el prefijo `EXPO_PUBLIC_` para que Expo las incluya en el cliente. Se re-exportan desde `core/constants/rapid-api.cts.ts` para acceso centralizado.
