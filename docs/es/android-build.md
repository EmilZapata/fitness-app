# Generar APK para Android

## Requisitos Previos

- Node.js >= 18
- pnpm instalado globalmente
- EAS CLI: `npm install -g eas-cli`
- Una [cuenta de Expo](https://expo.dev/signup) (gratis)
- Android Studio (solo necesario para builds locales)

## Opcion 1: EAS Build (Recomendado - Nube)

EAS Build compila el APK en la nube de Expo. No necesitas el SDK de Android local.

### 1. Instalar y loguearse en EAS

```bash
npm install -g eas-cli
eas login
```

### 2. Configurar EAS Build

```bash
eas build:configure
```

Esto crea un archivo `eas.json`. Para un APK de desarrollo/preview, usa esta configuracion:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### 3. Configurar variables de entorno

Configura tus API keys como secretos de EAS (para que no se expongan en el repo):

```bash
eas secret:create --name EXPO_PUBLIC_RAPID_API_KEY --value "tu-key"
eas secret:create --name EXPO_PUBLIC_RAPID_BASE_URL --value "tu-url"
eas secret:create --name EXPO_PUBLIC_RAPID_API_HOST --value "tu-host"
```

### 4. Generar el APK

```bash
# APK de preview (para testing, instalacion directa)
eas build --platform android --profile preview

# AAB de produccion (para Google Play Store)
eas build --platform android --profile production
```

### 5. Descargar e instalar

Una vez completado el build, EAS proporciona una URL de descarga. Tambien puedes ejecutar:

```bash
eas build:list --platform android
```

Transfiere el archivo `.apk` a tu dispositivo Android e instalalo.

## Opcion 2: Build Local

Si prefieres compilar localmente (requiere Android SDK y Java).

### 1. Instalar dependencias

Asegurate de tener:
- **Java 17** (JDK): `java -version`
- **Android SDK**: via Android Studio o herramientas de linea de comandos
- Variable de entorno **ANDROID_HOME** configurada

```bash
# Ejemplo para Linux
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 2. Generar proyecto nativo

```bash
npx expo prebuild --platform android
```

Esto genera el directorio `android/` con el proyecto nativo.

### 3. Compilar el APK

```bash
cd android
./gradlew assembleRelease
```

El APK estara en: `android/app/build/outputs/apk/release/app-release.apk`

### 4. (Opcional) Build con EAS localmente

```bash
eas build --platform android --profile preview --local
```

Esto ejecuta el pipeline de EAS en tu maquina. Requiere Docker o Android SDK.

## Problemas Comunes

### El build falla con "SDK location not found"

Crea `android/local.properties`:

```
sdk.dir=/ruta/a/tu/Android/Sdk
```

### "JAVA_HOME is not set"

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
```

### El APK crashea al abrir

- Verifica que todas las variables `EXPO_PUBLIC_*` esten configuradas
- Ejecuta `npx expo prebuild --clean` para regenerar archivos nativos
- Revisa `adb logcat` para logs de error detallados

## Comandos Utiles

```bash
# Ver dispositivos conectados
adb devices

# Instalar APK directamente
adb install app-release.apk

# Ver logs de la app
adb logcat -s ReactNativeJS

# Limpiar cache del build
cd android && ./gradlew clean
```
