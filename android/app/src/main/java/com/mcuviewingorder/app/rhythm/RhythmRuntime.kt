package com.mcuviewingorder.app.rhythm

import android.app.Activity
import android.content.Context
import android.content.res.Configuration
import android.graphics.Color
import android.os.Build
import android.view.Window
import androidx.core.view.WindowCompat

/**
 * Native runtime defaults adapted for the MCU library shell from Rhythm's
 * Material 3 / Kotlin-first app system. This keeps the web JSX/CSS surface
 * intact while giving the APK a dedicated Android integration layer.
 */
object RhythmRuntime {
    const val SNAPSHOT_PREFS = "rhythm_mcu_library_snapshot"
    const val SNAPSHOT_KEY = "library_snapshot_json"

    private const val DARK_SURFACE = "#171A1F"
    private const val LIGHT_SURFACE = "#F3F6FB"

    val phaseDestinations = listOf(
        RhythmDestination("home", "Home", "Hero dashboard and continue-watching focus"),
        RhythmDestination("phases", "Phases", "MCU and DC phase library with saved progress"),
        RhythmDestination("status", "Status", "Completed, watching, watchlist, paused and dropped shelves"),
        RhythmDestination("search", "Search", "Fast title, cast, director and metadata lookup"),
        RhythmDestination("settings", "Settings", "Theme, backup, export and APK preferences"),
    )

    fun applyEdgeToEdge(activity: Activity) {
        val window = activity.window
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.isStatusBarContrastEnforced = false
            window.isNavigationBarContrastEnforced = false
        }
        setSystemBarsForTheme(window, activity.resources.configuration)
    }

    fun setSystemBarsForTheme(window: Window, configuration: Configuration) {
        val isNight = configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK == Configuration.UI_MODE_NIGHT_YES
        WindowCompat.getInsetsController(window, window.decorView).apply {
            isAppearanceLightStatusBars = !isNight
            isAppearanceLightNavigationBars = !isNight
        }
        window.decorView.setBackgroundColor(Color.parseColor(if (isNight) DARK_SURFACE else LIGHT_SURFACE))
    }

    fun saveSnapshot(context: Context, snapshotJson: String) {
        context.getSharedPreferences(SNAPSHOT_PREFS, Context.MODE_PRIVATE)
            .edit()
            .putString(SNAPSHOT_KEY, snapshotJson)
            .apply()
    }

    fun readSnapshot(context: Context): String =
        context.getSharedPreferences(SNAPSHOT_PREFS, Context.MODE_PRIVATE)
            .getString(SNAPSHOT_KEY, "{}") ?: "{}"
}

data class RhythmDestination(
    val id: String,
    val label: String,
    val role: String,
)
