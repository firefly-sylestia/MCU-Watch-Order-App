package com.mcuviewingorder.shared.filters

import com.mcuviewingorder.shared.model.TitleType
import com.mcuviewingorder.shared.model.Universe
import com.mcuviewingorder.shared.model.WatchStatus

data class FilterState(
    val searchText: String = "",
    val searchScope: SearchScope = SearchScope.All,
    val type: TitleType? = null,
    val status: WatchStatus? = null,
    val watchedOnly: Boolean = false,
    val essentialOnly: Boolean = false,
    val phase: Int? = null,
    val timelineMode: String = "release",
    val universe: Universe? = null,
    val collectionId: String? = null,
    val autoHideStatuses: Set<WatchStatus> = emptySet()
)

enum class SearchScope { All, Title, Synopsis, Metadata }
