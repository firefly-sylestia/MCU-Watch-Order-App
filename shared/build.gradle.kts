plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.mcuviewingorder.shared"
    compileSdk = 36
    defaultConfig { minSdk = 26 }
}

android.sourceSets["main"].java.srcDir("src/commonMain/kotlin")
