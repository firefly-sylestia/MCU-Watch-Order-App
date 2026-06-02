package com.mcuviewingorder.app.domain

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.mcuviewingorder.app.data.ProgressRepository
import com.mcuviewingorder.app.data.UserPreferencesRepository
import com.mcuviewingorder.shared.filters.FilterState
import com.mcuviewingorder.shared.filters.TitleFilter
import com.mcuviewingorder.shared.model.SortMode
import com.mcuviewingorder.shared.model.WatchStatus
import com.mcuviewingorder.shared.progress.ProgressCalculator
import com.mcuviewingorder.shared.repository.CatalogRepository
import com.mcuviewingorder.shared.sorting.TitleSorter
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class AppUiState(
    val filter: FilterState = FilterState(),
    val sortMode: SortMode = SortMode.Chronological,
    val selectedSlug: String? = null,
    val snackbar: String? = null
)

class AppViewModel(application: Application) : AndroidViewModel(application) {
    private val catalogRepository = CatalogRepository()
    private val progressRepository = ProgressRepository(application)
    val preferencesRepository = UserPreferencesRepository(application)
    private val mutableUi = MutableStateFlow(AppUiState())
    val allTitles = catalogRepository.titles()
    val progress = progressRepository.progress.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyMap())
    val ui = mutableUi.asStateFlow()
    val visibleTitles = combine(ui, progress) { uiState, progressMap ->
        TitleSorter.sort(TitleFilter.apply(allTitles, progressMap, uiState.filter), progressMap, uiState.sortMode)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), allTitles)
    val stats = combine(progress, visibleTitles) { progressMap, titles -> ProgressCalculator.calculate(titles, progressMap) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), ProgressCalculator.calculate(allTitles, emptyMap()))
    val preferences = preferencesRepository.preferences.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), com.mcuviewingorder.app.data.UserPreferences())
    fun updateFilter(transform: (FilterState) -> FilterState) { mutableUi.update { it.copy(filter = transform(it.filter)) } }
    fun setSort(mode: SortMode) { mutableUi.update { it.copy(sortMode = mode) } }
    fun select(slug: String?) { mutableUi.update { it.copy(selectedSlug = slug) } }
    fun setSnackbar(message: String?) { mutableUi.update { it.copy(snackbar = message) } }
    fun toggleWatched(id: String) = viewModelScope.launch { progressRepository.toggleWatched(id); setSnackbar("Watch status updated") }
    fun setStatus(id: String, status: WatchStatus) = viewModelScope.launch { progressRepository.setStatus(id, status); setSnackbar("Status set to ${status.name}") }
    fun clearProgress() = viewModelScope.launch { progressRepository.clear(); setSnackbar("Progress reset") }
}
