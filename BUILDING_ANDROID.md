# Building Android

## Debug APK

This repository intentionally uses the installed `gradle` command for the native root build so no Gradle wrapper binary has to be moved into the new root layout.


```bash
gradle :androidApp:assembleDebug
```

Expected output path:

```text
androidApp/build/outputs/apk/debug/androidApp-debug.apk
```

## Release APK

```bash
gradle :androidApp:assembleRelease
```

Expected output path:

```text
androidApp/build/outputs/apk/release/androidApp-release.apk
```

Release signing is intentionally not hard-coded in the native app. Add signing configuration through local Gradle properties or CI secrets.

## Environment notes

The native build uses Android Gradle Plugin, Kotlin Android, Compose compiler plugin, Material 3, Navigation Compose, Lifecycle Compose, DataStore, and Coil. The Android SDK should include API 36. If a sandbox blocks access to Google's Maven repository, Gradle cannot download Android plugin artifacts until those dependencies are restored in cache or network access is opened.
