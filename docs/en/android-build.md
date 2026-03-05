# Building APK for Android

## Prerequisites

- Node.js >= 18
- pnpm installed globally
- EAS CLI: `npm install -g eas-cli`
- An [Expo account](https://expo.dev/signup) (free)
- Android Studio (only needed for local builds)

## Option 1: EAS Build (Recommended - Cloud)

EAS Build compiles the APK in Expo's cloud. No local Android SDK required.

### 1. Install and login to EAS

```bash
npm install -g eas-cli
eas login
```

### 2. Configure EAS Build

```bash
eas build:configure
```

This creates an `eas.json` file. For a development/preview APK, use this configuration:

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

### 3. Set environment variables

Configure your API keys as EAS secrets (so they are not exposed in the repo):

```bash
eas secret:create --name EXPO_PUBLIC_RAPID_API_KEY --value "your-key"
eas secret:create --name EXPO_PUBLIC_RAPID_BASE_URL --value "your-url"
eas secret:create --name EXPO_PUBLIC_RAPID_API_HOST --value "your-host"
```

### 4. Build the APK

```bash
# Preview APK (for testing, direct install)
eas build --platform android --profile preview

# Production AAB (for Google Play Store)
eas build --platform android --profile production
```

### 5. Download and install

Once the build completes, EAS provides a download URL. You can also run:

```bash
eas build:list --platform android
```

Transfer the `.apk` file to your Android device and install it.

## Option 2: Local Build

If you prefer building locally (requires Android SDK and Java).

### 1. Install dependencies

Make sure you have:
- **Java 17** (JDK): `java -version`
- **Android SDK**: via Android Studio or command-line tools
- **ANDROID_HOME** environment variable set

```bash
# Example for Linux
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 2. Generate native project

```bash
npx expo prebuild --platform android
```

This generates the `android/` directory with the native project.

### 3. Build the APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### 4. (Optional) Build with EAS locally

```bash
eas build --platform android --profile preview --local
```

This runs the EAS build pipeline on your machine. Requires Docker or Android SDK.

## Common Issues

### Build fails with "SDK location not found"

Create `android/local.properties`:

```
sdk.dir=/path/to/your/Android/Sdk
```

### "JAVA_HOME is not set"

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
```

### APK crashes on launch

- Verify all `EXPO_PUBLIC_*` env vars are set
- Run `npx expo prebuild --clean` to regenerate native files
- Check `adb logcat` for detailed error logs

## Useful Commands

```bash
# Check connected devices
adb devices

# Install APK directly
adb install app-release.apk

# View logs from the app
adb logcat -s ReactNativeJS

# Clean build cache
cd android && ./gradlew clean
```
