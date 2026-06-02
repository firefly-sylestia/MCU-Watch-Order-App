package com.mcuviewingorder.shared.filters

import com.mcuviewingorder.shared.model.TitleEntry
import com.mcuviewingorder.shared.model.WatchProgress
import com.mcuviewingorder.shared.model.WatchStatus

object TitleFilter {
    fun apply(titles: List<TitleEntry>, progress: Map<String, WatchProgress>, state: FilterState): List<TitleEntry> =
        titles.filter { title ->
            val watch = progress[title.id]
            val status = watch?.status ?: WatchStatus.Unwatched
            val query = state.searchText.trim().lowercase()
            val matchesQuery = query.isBlank() || when (state.searchScope) {
                SearchScope.All -> listOf(title.title, title.synopsis, title.type.name, title.universe.name, "phase ${title.phase ?: ""}").any { it?.lowercase()?.contains(query) == true }
                SearchScope.Title -> title.title.lowercase().contains(query)
                SearchScope.Synopsis -> title.synopsis?.lowercase()?.contains(query) == true
                SearchScope.Metadata -> listOf(title.type.name, title.universe.name, "phase ${title.phase ?: ""}").any { it.lowercase().contains(query) }
            }
            matchesQuery &&
                (state.type == null || title.type == state.type) &&
                (state.status == null || status == state.status) &&
                (!state.watchedOnly || status == WatchStatus.Watched) &&
                (!state.essentialOnly || title.isEssential) &&
                (state.phase == null || title.phase == state.phase) &&
                (state.universe == null || title.universe == state.universe) &&
                (state.collectionId == null || title.collectionIds.contains(state.collectionId)) &&
                !state.autoHideStatuses.contains(status)
        }
}
