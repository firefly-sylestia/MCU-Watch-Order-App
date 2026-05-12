# MCU Viewing Order - Release APK Setup Guide

This guide explains how to set up the release APK signing process for the MCU Viewing Order app.

## 🔐 GitHub Secrets Configuration

To build and release signed APKs, you need to configure the following secrets in your GitHub repository:

### 1. Generate a Keystore

If you don't have a keystore file yet, generate one locally:

```bash
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias mcu-app -keypass yourKeyPassword \
  -storepass yourStorePassword
```

### 2. Encode the Keystore to Base64

Convert your keystore to Base64 for GitHub secrets:

```bash
base64 release.keystore | tr -d '\n' | pbcopy
```

Or on Linux:
```bash
base64 release.keystore | tr -d '\n' | xclip -selection clipboard
```

### 3. Add GitHub Secrets

Go to your repository **Settings → Secrets and variables → Actions** and add:

- **KEYSTORE_BASE64**: The Base64-encoded keystore content (paste from step 2)
- **KEYSTORE_PASSWORD**: The keystore password (what you used for `-storepass`)
- **KEY_ALIAS**: The key alias (what you used for `-alias`, default: `mcu-app`)
- **KEY_PASSWORD**: The key password (what you used for `-keypass`)

### 4. Create a Release

To trigger the build workflow, create a new tag and push it:

```bash
git tag v1.0.0
git push origin v1.0.0
```

This will automatically build a signed release APK and create a GitHub Release with the APK attached.

## 🔑 Important Security Notes

- **Never commit your keystore** to version control
- **Keep your keystore backup** in a secure location
- **Protect your GitHub secrets** - they're only used during CI/CD builds
- The same keystore must be used for all releases to maintain the app's signing certificate

## ✅ Workflow Steps

The release workflow will:

1. Extract version from the git tag
2. Install dependencies
3. Build the web app
4. Sync Capacitor to Android
5. Create a keystore from the Base64 secret
6. Build a signed release APK using `assembleRelease`
7. Upload the APK to the GitHub Release
