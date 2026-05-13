#!/bin/bash

# MCU Viewing Order - Keystore Generation & GitHub Secrets Setup
# This script helps you generate a keystore and configure GitHub secrets for signed releases

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║  MCU Viewing Order - Release Keystore Setup            ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Get user inputs
echo "Step 1: Enter Keystore Details"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
read -p "MCUWatchOrder.keystore: " KEYSTORE_FILE
KEYSTORE_FILE=${KEYSTORE_FILE:-release.keystore}

read -sp "12MCU@Me: " STORE_PASSWORD
echo ""
read -sp "12MCU@Me: " STORE_PASSWORD_CONFIRM
echo ""

if [ "$STORE_PASSWORD" != "$STORE_PASSWORD_CONFIRM" ]; then
  echo "❌ Passwords don't match!"
  exit 1
fi

read -p "mcu-app: " KEY_ALIAS
KEY_ALIAS=${KEY_ALIAS:-mcu-app}

read -sp "12MCU@Me: " KEY_PASSWORD
echo ""
read -sp "12MCU@Me: " KEY_PASSWORD_CONFIRM
echo ""

if [ "$KEY_PASSWORD" != "$KEY_PASSWORD_CONFIRM" ]; then
  echo "❌ Passwords don't match!"
  exit 1
fi

read -p "Enter your name (for certificate): " NAME
read -p "Enter your organization: " ORG
read -p "Enter your city: " CITY
read -p "Enter your state/province: " STATE
read -p "Enter your country code (e.g., US): " COUNTRY

# Step 2: Generate keystore
echo ""
echo "Step 2: Generating Keystore..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

keytool -genkey -v \
  -keystore "$KEYSTORE_FILE" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias "$KEY_ALIAS" \
  -keypass "$KEY_PASSWORD" \
  -storepass "$STORE_PASSWORD" \
  -dname "CN=$NAME, OU=$ORG, L=$CITY, ST=$STATE, C=$COUNTRY"

echo "✅ Keystore created: $KEYSTORE_FILE"
echo ""

# Step 3: Encode to Base64
echo "Step 3: Encoding Keystore to Base64..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

KEYSTORE_BASE64=$(base64 < "$KEYSTORE_FILE" | tr -d '\n')

echo "✅ Keystore encoded successfully"
echo ""

# Step 4: Display secrets
echo "Step 4: GitHub Secrets Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Add the following secrets to your GitHub repository:"
echo "📍 Go to: Settings → Secrets and variables → Actions"
echo ""
echo "Secret Name: KEYSTORE_BASE64"
echo "Secret Value (very long base64 string):"
echo "$KEYSTORE_BASE64"
echo ""
echo "Secret Name: KEYSTORE_PASSWORD"
echo "Secret Value: $STORE_PASSWORD"
echo ""
echo "Secret Name: KEY_ALIAS"
echo "Secret Value: $KEY_ALIAS"
echo ""
echo "Secret Name: KEY_PASSWORD"
echo "Secret Value: $KEY_PASSWORD"
echo ""

# Step 5: Save backup
echo "Step 5: Backup Instructions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  IMPORTANT:"
echo "  1. Save '$KEYSTORE_FILE' in a secure location (NOT in this repo)"
echo "  2. You MUST use this same keystore for all future app releases"
echo "  3. Without the keystore, you cannot update the app on Play Store"
echo "  4. Keep a backup of the keystore file somewhere safe"
echo ""

# Step 6: Verify keystore
echo "Step 6: Verifying Keystore..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
keytool -list -v -keystore "$KEYSTORE_FILE" -storepass "$STORE_PASSWORD" | head -20

echo ""
echo "✅ Keystore Setup Complete!"
echo ""
echo "Next steps:"
echo "  1. Add the secrets to GitHub (see above)"
echo "  2. Move $KEYSTORE_FILE to a secure location"
echo "  3. Create a release: git tag v1.0.0 && git push origin v1.0.0"
echo "  4. The workflow will automatically build and sign the APK"
echo ""
