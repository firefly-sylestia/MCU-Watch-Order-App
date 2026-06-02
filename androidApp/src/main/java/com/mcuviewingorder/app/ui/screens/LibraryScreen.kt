package com.mcuviewingorder.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.mcuviewingorder.app.domain.AppViewModel
import com.mcuviewingorder.app.ui.theme.Spacing

@Composable
fun LibraryScreen(viewModel: AppViewModel, padding: PaddingValues, onOpen: (String) -> Unit) {
    LazyColumn(contentPadding = PaddingValues(start = Spacing.x4, end = Spacing.x4, top = padding.calculateTopPadding() + Spacing.x4, bottom = padding.calculateBottomPadding() + Spacing.x4), verticalArrangement = Arrangement.spacedBy(Spacing.x3)) {
        item { Text("Library Atrium", style = MaterialTheme.typography.headlineLarge) }
        item { Text("Command catalog and collection rooms preserve the web app hierarchy in native cards.") }
        items(viewModel.allTitles.groupBy { it.phase ?: 0 }.toList(), key = { it.first }) { (phase, titles) -> ArchiveCard("Phase $phase", "${titles.size} titles", onClick = { titles.firstOrNull()?.let { onOpen(it.slug) } }) }
    }
}
@Composable fun ArchiveCard(title: String, subtitle: String, onClick: () -> Unit) { ElevatedCard(onClick = onClick, modifier = Modifier.fillMaxWidth()) { Column(Modifier.padding(Spacing.x4)) { Text(title, style = MaterialTheme.typography.titleMedium); Text(subtitle) } } }
@Composable fun CommandCatalog() { Text("Command Catalog") }
@Composable fun CollectionRooms() { Text("Collection Rooms") }
