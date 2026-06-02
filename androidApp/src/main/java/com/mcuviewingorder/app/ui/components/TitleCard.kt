package com.mcuviewingorder.app.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.mcuviewingorder.app.ui.theme.Spacing
import com.mcuviewingorder.shared.model.*

@Composable
fun TitleCard(title: TitleEntry, progress: WatchProgress?, onOpen: () -> Unit, onToggleWatched: () -> Unit) {
    val status = progress?.status ?: WatchStatus.Unwatched
    ElevatedCard(modifier = Modifier.fillMaxWidth().clickable(onClick = onOpen)) {
        Row(Modifier.padding(Spacing.x4), horizontalArrangement = Arrangement.spacedBy(Spacing.x4)) {
            PosterFallback(title.title, Modifier.size(82.dp, 122.dp))
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(Spacing.x2)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(title.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, maxLines = 2, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f))
                    AssistChip(onClick = onToggleWatched, label = { Text(if (status == WatchStatus.Watched) "✓" else "+") })
                }
                Text("${title.universe.name.uppercase()} • ${title.type.name} • Phase ${title.phase ?: "—"} • ${title.releaseYear ?: "TBA"}", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.secondary)
                AnimatedVisibility(title.isEssential) { AssistChip(onClick = {}, label = { Text("Essential") }) }
                Text(title.synopsis ?: "No synopsis available.", maxLines = 3, overflow = TextOverflow.Ellipsis, style = MaterialTheme.typography.bodyMedium)
                StatusPill(status)
            }
        }
    }
}

@Composable fun PosterFallback(title: String, modifier: Modifier = Modifier) {
    Box(modifier.clip(RoundedCornerShape(16.dp)).background(MaterialTheme.colorScheme.surfaceVariant), contentAlignment = Alignment.Center) { Text(title.take(1), style = MaterialTheme.typography.displaySmall, color = MaterialTheme.colorScheme.primary) }
}
@Composable fun StatusPill(status: WatchStatus) { SuggestionChip(onClick = {}, label = { Text(status.name) }) }
