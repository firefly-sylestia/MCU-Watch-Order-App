plugins {
    id("com.android.application") version "8.13.0" apply false
    id("com.android.library") version "8.13.0" apply false
    id("org.jetbrains.kotlin.android") version "2.0.21" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.21" apply false
}

tasks.register("assembleDebugApk") {
    group = "build"
    description = "Builds the Android debug APK."
    dependsOn(":androidApp:assembleDebug")
}

tasks.register("assembleReleaseApk") {
    group = "build"
    description = "Builds the Android release APK. Uses signing env vars when provided."
    dependsOn(":androidApp:assembleRelease")
}

tasks.register("assembleAllApks") {
    group = "build"
    description = "Builds both Android debug and release APKs."
    dependsOn("assembleDebugApk", "assembleReleaseApk")
}
