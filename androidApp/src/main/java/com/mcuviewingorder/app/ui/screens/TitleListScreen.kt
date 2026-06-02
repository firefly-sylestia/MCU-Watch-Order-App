package com.mcuviewingorder.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.mcuviewingorder.app.domain.AppViewModel
import com.mcuviewingorder.app.ui.components.*
import com.mcuviewingorder.app.ui.theme.Spacing

@Composable
fun TitleListScreen(viewModel: AppViewModel, padding: PaddingValues, onOpen: (String) -> Unit) {
    val titles by viewModel.visibleTitles.collectAsState()
    val progress by viewModel.progress.collectAsState()
    val ui by viewModel.ui.collectAsState()
    val stats by viewModel.stats.collectAsState()
    LazyColumn(contentPadding = PaddingValues(start = Spacing.x4, end = Spacing.x4, top = padding.calculateTopPadding() + Spacing.x4, bottom = padding.calculateBottomPadding() + Spacing.x4), verticalArrangement = Arrangement.spacedBy(Spacing.x4)) {
        item { Text("MCU Viewing Order", style = MaterialTheme.typography.headlineLarge) }
        item { ProgressSection(stats) }
        item { FilterBar(ui.filter, ui.sortMode, viewModel::updateFilter, viewModel::setSort) }
        if (titles.isEmpty()) item { Text("No titles match your search. Try clearing filters.", style = MaterialTheme.typography.bodyLarge) }
        items(titles, key = { it.id }) { title -> TitleCard(title, progress[title.id], onOpen = { onOpen(title.slug) }, onToggleWatched = { viewModel.toggleWatched(title.id) }) }
    }
}

@Composable
fun TitleRoute(viewModel: AppViewModel, slug: String?, padding: PaddingValues, onBack: () -> Unit) {
    val title = viewModel.allTitles.firstOrNull { it.slug == slug }
    val progress by viewModel.progress.collectAsState()
    if (title == null) Box(Modifier.padding(padding).padding(Spacing.x4)) { Text("Title not found") } else TitleDetailPane(title, progress[title.id], padding, onBack, onStatus = { viewModel.setStatus(title.id, it) }, onToggle = { viewModel.toggleWatched(title.id) })
}
