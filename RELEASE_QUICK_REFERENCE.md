# Quick Release Checklist

## First Time Setup (One-time)

- [ ] Generate keystore: `./scripts/setup-keystore.sh`
- [ ] Back up `release.keystore` to secure location
- [ ] Add 4 GitHub Secrets (see KEYSTORE_SETUP.md)
- [ ] Verify all secrets appear in GitHub Settings

## Creating a Release

```bash
# Create and push version tag
git tag v1.0.0
git push origin v1.0.0

# Watch the build:
# Go to Actions tab on GitHub → see live build progress
```

## Manual Signing (if needed)

```bash
# Verify your keystore
keytool -list -v -keystore release.keystore

# Sign an APK manually
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore release.keystore app-release-unsigned.apk mcu-app
```

## GitHub Secrets Reference

| Secret Name | Contains | Example |
|-------------|----------|---------|
| `KEYSTORE_BASE64` | Full Base64-encoded keystore | `MIIKgQIBAzCCCnEGCSqGSIb3...` (very long) |
| `KEYSTORE_PASSWORD` | Keystore password | `MySecurePass123` |
| `KEY_ALIAS` | Key alias | `mcu-app` |
| `KEY_PASSWORD` | Key password | `KeyPass456` |

## Common Issues

| Issue | Fix |
|-------|-----|
| APK build fails with "Tag number over 30" | Re-encode keystore: `base64 release.keystore \| tr -d '\n'` |
| "keytool not found" | Install Java JDK |
| Build succeeds but APK is debug | Secrets not set; falls back to debug build |
| Cannot update app on Play Store | You used a different keystore - must use same one |

## File Locations

- **Keystore:** `release.keystore` (local, never committed)
- **Setup Script:** `scripts/setup-keystore.sh`
- **Full Guide:** `KEYSTORE_SETUP.md`
- **Workflow:** `.github/workflows/release.yml`
- **Build Config:** `android/app/build.gradle`
- **Secrets Location:** GitHub Settings → Secrets and variables → Actions
