import org.gradle.api.provider.Provider
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

val ciVersionName = providers.gradleProperty("VERSION_NAME")
    .orElse(providers.environmentVariable("VERSION_NAME"))
    .orElse("1.0-native")
val ciVersionCode = providers.gradleProperty("VERSION_CODE")
    .orElse(providers.environmentVariable("VERSION_CODE"))
    .orElse("1")

val keystorePath = providers.environmentVariable("KEYSTORE_PATH")
val keystorePassword = providers.environmentVariable("KEYSTORE_PASSWORD")
val signingKeyAlias = providers.environmentVariable("KEY_ALIAS")
val keyPasswordEnv = providers.environmentVariable("KEY_PASSWORD")
fun Provider<String>.isPresentAndNotBlank(): Boolean = isPresent && get().isNotBlank()

val hasReleaseSigning = listOf(keystorePath, keystorePassword, signingKeyAlias, keyPasswordEnv)
    .all { it.isPresentAndNotBlank() } && file(keystorePath.get()).isFile

android {
    namespace = "com.mcuviewingorder.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.mcuviewingorder.app"
        minSdk = 26
        targetSdk = 36
        versionCode = ciVersionCode.get().toInt()
        versionName = ciVersionName.get()
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    signingConfigs {
        if (hasReleaseSigning) {
            create("release") {
                storeFile = file(keystorePath.get())
                storePassword = keystorePassword.get()
                keyAlias = signingKeyAlias.get()
                keyPassword = keyPasswordEnv.get()
            }
        }
    }

    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
        }

        release {
            isMinifyEnabled = false
            isShrinkResources = false
            signingConfig = if (hasReleaseSigning) {
                signingConfigs.getByName("release")
            } else {
                null
            }
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }
}

tasks.register("printApkLocations") {
    group = "build"
    description = "Prints the expected debug and release APK output locations."
    doLast {
        println("Debug APK: ${layout.buildDirectory.file("outputs/apk/debug/androidApp-debug.apk").get().asFile}")
        println("Release APK: ${layout.buildDirectory.file("outputs/apk/release/androidApp-release.apk").get().asFile}")
        println("Unsigned release APK: ${layout.buildDirectory.file("outputs/apk/release/androidApp-release-unsigned.apk").get().asFile}")
    }
}

dependencies {
    implementation(project(":shared"))
    val composeBom = platform("androidx.compose:compose-bom:2024.10.01")
    implementation(composeBom)
    androidTestImplementation(composeBom)
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose:2.8.3")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.6")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.6")
    implementation("androidx.datastore:datastore-preferences:1.1.1")
    implementation("io.coil-kt:coil-compose:2.7.0")
    debugImplementation("androidx.compose.ui:ui-tooling")
}
