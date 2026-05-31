package com.mcuviewingorder.app.rhythm

/**
 * Native app-system contract inspired by Rhythm's Kotlin-first architecture.
 *
 * The React/JSX website remains the source of truth for UI rendering, while this Kotlin layer
 * gives the APK a typed place to map home, phase library, saved statuses, and native chrome.
 */
object RhythmAppSystem {
    const val sourceRepository = "https://github.com/cromaguy/Rhythm"
    const val appNamespace = "com.mcuviewingorder.app"
    const val statusStorageName = "mcu_phase_status_library"
    const val statusStorageVersion = 1

    val defaultChrome = RhythmChrome(
        darkStatusBarIcons = false,
        darkNavigationBarIcons = false,
        contrastEnforced = false,
    )

    val homeSections = listOf(
        RhythmHomeSection(
            id = "hero",
            title = "Home",
            description = "Resume the current MCU/DC viewing order and surface featured titles.",
            route = "/",
        ),
        RhythmHomeSection(
            id = "phases",
            title = "Phases Library",
            description = "Group every title into its proper phase, timeline, and universe placement.",
            route = "/phase/all",
        ),
        RhythmHomeSection(
            id = "saved-status",
            title = "Saved Status",
            description = "Persist watched, watching, watchlist, paused, dropped, ratings, notes, and bookmarks.",
            route = "/settings#profile",
        ),
        RhythmHomeSection(
            id = "analytics",
            title = "Progress Analytics",
            description = "Show completion, runtime, status, and library insights with subtle feedback.",
            route = "/settings#analytics",
        ),
    )

    val statusBuckets = listOf(
        RhythmStatusBucket("watched", "Completed", true),
        RhythmStatusBucket("watching", "In Progress", true),
        RhythmStatusBucket("plan-to-watch", "Watchlist", true),
        RhythmStatusBucket("on-hold", "Paused", true),
        RhythmStatusBucket("dropped", "Dropped", true),
        RhythmStatusBucket("unwatched", "Unwatched", false),
    )
}

data class RhythmHomeSection(
    val id: String,
    val title: String,
    val description: String,
    val route: String,
)

data class RhythmStatusBucket(
    val id: String,
    val label: String,
    val saved: Boolean,
)

data class RhythmChrome(
    val darkStatusBarIcons: Boolean,
    val darkNavigationBarIcons: Boolean,
    val contrastEnforced: Boolean,
)
