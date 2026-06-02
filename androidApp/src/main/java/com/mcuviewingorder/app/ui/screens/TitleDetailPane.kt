package com.mcuviewingorder.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.mcuviewingorder.app.ui.components.*
import com.mcuviewingorder.app.ui.theme.Spacing
import com.mcuviewingorder.shared.model.*

@Composable
fun TitleDetailPane(title: TitleEntry, progress: WatchProgress?, padding: PaddingValues, onBack: () -> Unit, onStatus: (WatchStatus) -> Unit, onToggle: () -> Unit) {
    val status = progress?.status ?: WatchStatus.Unwatched
    Column(Modifier.padding(padding).padding(Spacing.x4), verticalArrangement = Arrangement.spacedBy(Spacing.x4)) {
        Row(horizontalArrangement = Arrangement.spacedBy(Spacing.x4)) {
            PosterFallback(title.title, Modifier.size(120.dp, 180.dp))
            Column(Modifier.weight(1f)) {
                Text(title.title, style = MaterialTheme.typography.headlineMedium)
                Text("${title.universe.name.uppercase()} • ${title.type.name} • Phase ${title.phase ?: "—"}", color = MaterialTheme.colorScheme.secondary)
                Button(onClick = onToggle) { Text(if (status == WatchStatus.Watched) "Mark unwatched" else "Mark watched") }
            }
        }
        Text(title.synopsis ?: "No synopsis available.")
        Text("Prerequisites", style = MaterialTheme.typography.titleMedium)
        Text(title.prerequisites.ifEmpty { listOf("None") }.joinToString())
        Text("Trailers and after-credits", style = MaterialTheme.typography.titleMedium)
        Text("Trailer links and after-credits metadata are synced from shared-data and ready for native linking.")
        Text("Status", style = MaterialTheme.typography.titleMedium)
        StatusPicker(status, onStatus)
        OutlinedButton(onClick = onBack) { Text("Back") }
    }
}
@Composable fun TitleDetailSheet(title: TitleEntry, progress: WatchProgress?, onStatus: (WatchStatus) -> Unit) { TitleDetailPane(title, progress, PaddingValues(0.dp), {}, onStatus, {}) }
