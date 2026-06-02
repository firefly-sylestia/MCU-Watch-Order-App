package com.mcuviewingorder.shared.sorting

import com.mcuviewingorder.shared.model.SortMode
import com.mcuviewingorder.shared.model.TitleEntry
import com.mcuviewingorder.shared.model.WatchProgress

object TitleSorter {
    fun sort(titles: List<TitleEntry>, progress: Map<String, WatchProgress>, mode: SortMode): List<TitleEntry> = when (mode) {
        SortMode.Chronological -> titles.sortedWith(compareBy<TitleEntry> { it.universe.name }.thenBy { it.chronologicalOrder }.thenBy { it.releaseYear ?: Int.MAX_VALUE })
        SortMode.ReleaseYear -> titles.sortedWith(compareBy<TitleEntry> { it.releaseYear ?: Int.MAX_VALUE }.thenBy { it.title })
        SortMode.Alphabetical -> titles.sortedBy { it.title }
        SortMode.Runtime -> titles.sortedByDescending { it.runtimeMinutes ?: 0 }
        SortMode.RecentlyWatched -> titles.sortedByDescending { progress[it.id]?.watchedDate ?: "" }
        SortMode.Status -> titles.sortedWith(compareBy<TitleEntry> { progress[it.id]?.status?.ordinal ?: Int.MAX_VALUE }.thenBy { it.title })
    }
}
