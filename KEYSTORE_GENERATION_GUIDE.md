# Keystore Generation Guide for MCU Viewing Order

Your keystore details have been prepared. Follow these steps on your local machine to generate the keystore.

## Your Keystore Details

**Organization Details:**
- App Name: MCU Watch Order
- Package: com.mcuviewingorder.app
- Organization: MCU Order
- Organization Unit: Apps
- City: Jajpur
- State: Odisha
- Country: IN

**Key Details:**
- Key Alias: mcu-app-key
- Keystore Password: 46MCU@&
- Key Password: 46MCU@& (same as keystore)
- Validity: 20 years (7300 days)

---

## Step 1: Generate Keystore (Run on Your Local Machine)

Make sure you have Java JDK installed. Then run this command in your terminal:

```bash
keytool -genkey -v -keystore mcu-release.keystore \
  -keyalg RSA -keysize 2048 -validity 7300 \
  -alias mcu-app-key \
  -storepass "46MCU@&" \
  -keypass "46MCU@&" \
  -dname "CN=MCU Watch Order,OU=Apps,O=MCU Order,L=Jajpur,ST=Odisha,C=IN"
```

This will create a file named `mcu-release.keystore` in your current directory.

---

## Step 2: Encode Keystore to Base64

### On macOS or Linux:
```bash
cat mcu-release.keystore | base64 > keystore.base64
# Print it to copy
cat keystore.base64
```

### On Windows (PowerShell):
```powershell
$fileBytes = [System.IO.File]::ReadAllBytes("mcu-release.keystore")
$encodedString = [System.Convert]::ToBase64String($fileBytes)
$encodedString | Set-Content -Path keystore.base64
# Print it to copy
Get-Content keystore.base64
```

---

## Step 3: Add GitHub Secrets

Go to: **GitHub → Your Repository → Settings → Secrets and variables → Actions**

Add these 4 secrets:

| Secret Name | Value |
|-------------|-------|
| KEYSTORE_BASE64 | (Paste the entire Base64 string from keystore.base64) |
| KEYSTORE_PASSWORD | 46MCU@& |
| KEY_ALIAS | mcu-app-key |
| KEY_PASSWORD | 46MCU@& |

---

## Step 4: Create a Release

After adding the secrets, create a release by pushing a version tag:

```bash
git tag v2.0.0
git push origin v2.0.0
```

The GitHub Actions workflow will automatically:
1. Detect the tag version
2. Decode your keystore from KEYSTORE_BASE64
3. Build a signed release APK
4. Create a GitHub Release with the APK attached

---

## Important Notes

- Keep `mcu-release.keystore` file safe and backed up offline
- Never commit the keystore file to git (it's in .gitignore)
- The keystore is valid for 20 years
- For future releases, just push new tags (v2.0.1, v2.0.2, etc.)

---

## Troubleshooting

**Error: "keytool command not found"**
- Install Java JDK from https://adoptopenjdk.net/ or use your system package manager

**Error: "Tag number over 30 is not supported"**
- The Base64 encoding was corrupted. Re-encode the keystore file and update the GitHub secret.

**APK still building as unsigned?**
- Verify all 4 secrets are added to GitHub
- Check the GitHub Actions log to confirm secrets are loaded
- Re-push the tag to trigger a new build
