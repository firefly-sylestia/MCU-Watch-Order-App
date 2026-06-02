package com.mcuviewingorder.shared.model

data class TitleEntry(
    val id: String,
    val slug: String,
    val title: String,
    val type: TitleType,
    val universe: Universe,
    val phase: Int?,
    val chronologicalOrder: Double,
    val releaseYear: Int?,
    val releaseDate: String?,
    val runtimeMinutes: Int?,
    val episodes: String?,
    val synopsis: String?,
    val posterPath: String?,
    val isEssential: Boolean,
    val prerequisites: List<String>,
    val trailerIds: List<String>,
    val afterCreditsIds: List<String>,
    val collectionIds: List<String>
)

enum class TitleType { Film, Series, Short, Special, Collection, Unknown }
enum class Universe { Mcu, Dc }
enum class WatchStatus { Watched, Watching, PlanToWatch, OnHold, Dropped, Unwatched }
enum class SortMode { Chronological, ReleaseYear, Alphabetical, Runtime, RecentlyWatched, Status }
enum class ThemeMode { System, Light, Dark }

data class WatchProgress(
    val titleId: String,
    val status: WatchStatus = WatchStatus.Unwatched,
    val watchedDate: String? = null,
    val rewatchCount: Int = 0,
    val favorite: Boolean = false,
    val bookmarked: Boolean = false,
    val progress: Float = 0f
)
