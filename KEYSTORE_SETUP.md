# MCU Viewing Order - Keystore & Release Signing Setup

This guide walks you through setting up signed APK releases for the MCU Viewing Order app on Google Play Store.

## Overview

To release the app on Google Play Store, you need:
1. A keystore file (`.keystore`) - signs your APK
2. GitHub Secrets - stores your signing credentials securely
3. A version tag - triggers the automated build

**Security Note:** Keystores are NEVER committed to the repository. They're managed locally and only used in GitHub CI/CD via encrypted secrets.

---

## Step 1: Generate Your Keystore

### Option A: Interactive Script (Recommended)

```bash
./scripts/setup-keystore.sh
```

This script will:
- Prompt you for all required information
- Generate the keystore file
- Encode it to Base64
- Display the secrets you need to add to GitHub

### Option B: Manual Command

If you prefer manual setup, run:

```bash
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias mcu-app \
  -keypass your_key_password \
  -storepass your_store_password \
  -dname "CN=Your Name, OU=Your Org, L=City, ST=State, C=CountryCode"
```

Replace:
- `your_key_password` - password for the key (remember this!)
- `your_store_password` - password for the keystore (remember this!)
- Certificate info (CN, OU, L, ST, C) with your actual details

---

## Step 2: Encode Keystore to Base64

The GitHub workflow expects the keystore as a Base64-encoded string.

### On macOS:
```bash
base64 release.keystore | tr -d '\n' | pbcopy
```
(The keystore is now copied to clipboard)

### On Linux:
```bash
base64 release.keystore | tr -d '\n' | xclip -selection clipboard
```

### On Windows (PowerShell):
```powershell
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("release.keystore")) | Set-Clipboard
```

### Or save to file (all platforms):
```bash
base64 release.keystore > keystore.base64
cat keystore.base64
```

---

## Step 3: Configure GitHub Secrets

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Select **Secrets and variables** → **Actions**
4. Click **New repository secret**

Add these 4 secrets:

### Secret 1: KEYSTORE_BASE64
- **Name:** `KEYSTORE_BASE64`
- **Value:** The entire Base64-encoded string from Step 2 (paste the full output)

### Secret 2: KEYSTORE_PASSWORD
- **Name:** `KEYSTORE_PASSWORD`
- **Value:** The keystore password from Step 1 (`-storepass` value)

### Secret 3: KEY_ALIAS
- **Name:** `KEY_ALIAS`
- **Value:** The key alias from Step 1 (default: `mcu-app`)

### Secret 4: KEY_PASSWORD
- **Name:** `KEY_PASSWORD`
- **Value:** The key password from Step 1 (`-keypass` value)

**Verification:** All 4 secrets should appear in your repository's Actions secrets list.

---

## Step 4: Create a Release

Once all secrets are configured, create a release by pushing a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The GitHub Actions workflow will automatically:
1. Detect the tag
2. Build the web app
3. Sync to Android
4. Build a **signed release APK** using your keystore
5. Create a GitHub Release with the APK attached
6. Display the APK for download

---

## Step 5: Deploy to Google Play Store

After your APK is built:

1. Go to [Google Play Console](https://play.google.com/console/)
2. Select your app
3. Go to **Release** → **Production**
4. Upload the APK
5. Review and publish

**Important:** Use the SAME keystore for all releases. If you lose it or use a different keystore, you cannot update the app on Play Store.

---

## Workflow Build Process

The release workflow (`/.github/workflows/release.yml`) does:

### Conditional Signing:
- If `KEYSTORE_BASE64` secret is configured → builds **signed release APK** (`app-release.apk`)
- If `KEYSTORE_BASE64` secret is missing → builds **unsigned debug APK** (`app-debug.apk`)

This allows development builds to work immediately while you set up production signing.

### Build Steps:
1. Check out code
2. Extract version from git tag
3. Set up Java 17 & Android SDK
4. Install npm dependencies
5. Build web app (`npm run build`)
6. Sync Capacitor to Android
7. Create keystore from Base64 secret (if configured)
8. Build APK with Gradle
9. Upload to GitHub Release

---

## Important Security Guidelines

### DO:
- ✅ Store your keystore file in a **secure location** (NOT in the repo)
- ✅ Keep a **backup** of the keystore file (encrypted, offline)
- ✅ Use **strong passwords** for both keystore and key
- ✅ Treat GitHub secrets like passwords
- ✅ Use the **same keystore** for all app versions

### DON'T:
- ❌ Never commit `*.keystore` or `*.jks` files to the repo (already in `.gitignore`)
- ❌ Never share your keystore file or passwords
- ❌ Never lose your keystore file (you'll be unable to update the app)
- ❌ Never use different keystores for updates

---

## Troubleshooting

### Workflow Build Failed

**Error: "Tag number over 30 is not supported"**
- The keystore is corrupted or invalid
- Solution: Check that `KEYSTORE_BASE64` secret is correctly formatted (no line breaks)

**Error: "Keystore was tampered with"**
- The Base64 encoding is corrupted
- Solution: Re-encode the keystore: `base64 release.keystore | tr -d '\n'`

**Error: "KEYSTORE_PASSWORD" not found**
- Missing GitHub secret
- Solution: Add all 4 secrets to repository settings

### Cannot Generate Keystore

**Error: "keytool command not found"**
- Java/keytool not installed
- Solution: Install Java JDK (includes keytool)

**On macOS:** `brew install openjdk`
**On Linux:** `apt-get install default-jdk`
**On Windows:** Download from [java.com](https://java.com)

---

## File Reference

- **Keystore File:** `release.keystore` (NOT committed, stored locally)
- **Build Gradle:** `android/app/build.gradle` (includes signing config)
- **Release Workflow:** `.github/workflows/release.yml`
- **Keystore Script:** `scripts/setup-keystore.sh`

---

## Next Steps

1. Run the keystore setup script or generate manually
2. Encode the keystore to Base64
3. Add all 4 secrets to GitHub repository settings
4. Create a release: `git tag v1.0.0 && git push origin v1.0.0`
5. Verify the APK builds successfully
6. Download the APK from the GitHub Release
7. Upload to Google Play Console

---

## Questions?

Refer to:
- [keytool Documentation](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/keytool.html)
- [Android Signing Documentation](https://developer.android.com/studio/publish/app-signing)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
