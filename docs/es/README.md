# TrackGym

Aplicacion de seguimiento de fitness multiplataforma construida con Expo (React Native). Explora ejercicios por parte del cuerpo, ve GIFs animados y registra tus entrenamientos.

> [English documentation](../en/)

## Stack Tecnologico

- **React 19** / **React Native 0.83** / **Expo 55** (managed workflow)
- **Expo Router** - routing basado en archivos
- **TypeScript** - modo estricto
- **TanStack React Query** - estado del servidor y paginacion infinita
- **Axios** - cliente HTTP
- **NativeWind (Tailwind CSS)** - estilos
- **React Native Reanimated Carousel** - carrusel de imagenes

## Inicio Rapido

### Requisitos Previos

- Node.js >= 18
- pnpm (`npm install -g pnpm`)
- Expo CLI (`npx expo`)
- Android Studio (para emulador Android / builds de APK)

### Instalacion

```bash
git clone <repo-url>
cd fitness-app
pnpm install
```

### Variables de Entorno

Copia `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

Variables requeridas:

| Variable | Descripcion |
|---|---|
| `EXPO_PUBLIC_RAPID_API_KEY` | API key de RapidAPI para el endpoint de ejercicios |
| `EXPO_PUBLIC_RAPID_BASE_URL` | URL base de la API de ejercicios |
| `EXPO_PUBLIC_RAPID_API_HOST` | Valor del header host de RapidAPI |

### Ejecucion

```bash
pnpm start           # Iniciar servidor de desarrollo Expo
pnpm run android     # Ejecutar en emulador Android
pnpm run ios         # Ejecutar en simulador iOS
pnpm run web         # Ejecutar en web
```

### Testing

```bash
pnpm test                                    # Jest en modo watch
pnpm test -- --watchAll=false                # Ejecutar una vez (CI)
pnpm test -- --testPathPattern="Component"   # Archivo de test individual
```

## Documentacion

| Tema | Enlace |
|---|---|
| Arquitectura | [docs/es/architecture.md](architecture.md) |
| Generar APK Android | [docs/es/android-build.md](android-build.md) |

## Estructura del Proyecto

```
fitness-app/
├── app/                    # Pantallas (routing basado en archivos de Expo Router)
│   ├── _layout.tsx         # Layout raiz (Stack + QueryClientProvider)
│   ├── index.tsx           # Pantalla de bienvenida
│   ├── home.tsx            # Home con carrusel y grilla de partes del cuerpo
│   ├── exercises.tsx       # Lista de ejercicios por parte del cuerpo (scroll infinito)
│   └── exercise-details.tsx # Vista de detalle del ejercicio
├── components/             # Componentes UI reutilizables
├── core/                   # Logica de negocio e infraestructura
│   ├── api/                # Definiciones de endpoints API
│   ├── axios/              # Instancia de Axios e interceptores
│   ├── constants/          # Constantes y configuracion de la app
│   ├── hooks/              # Hooks personalizados (hooks de API)
│   ├── toolbox/            # Interfaces y utilidades compartidas
│   └── utils/              # Funciones utilitarias
├── assets/                 # Imagenes, fuentes, archivos estaticos
└── docs/                   # Documentacion del proyecto
    ├── en/                 # Ingles
    └── es/                 # Espanol
```
