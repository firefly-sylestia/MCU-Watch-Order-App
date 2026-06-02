package com.mcuviewingorder.app.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.mcuviewingorder.app.ui.theme.Spacing
import com.mcuviewingorder.shared.progress.ProgressStats

@Composable
fun ProgressSection(stats: ProgressStats) {
    val progress by animateFloatAsState(stats.completion, label = "completion")
    ElevatedCard(Modifier.fillMaxWidth()) {
        Column(Modifier.padding(Spacing.x4), verticalArrangement = Arrangement.spacedBy(Spacing.x3)) {
            Text("Viewing Progress", style = MaterialTheme.typography.titleLarge)
            LinearProgressIndicator(progress = { progress }, modifier = Modifier.fillMaxWidth())
            Text("${stats.watchedCount} watched • ${stats.remainingCount} remaining • ${(stats.completion * 100).toInt()}% complete")
            Text("Runtime: ${stats.watchedRuntimeMinutes / 60}h watched of ${stats.totalRuntimeMinutes / 60}h • Streak ${stats.watchStreakDays} days")
            stats.byPhase.toSortedMap().forEach { (phase, value) ->
                if (phase > 0) { Text("Phase $phase ${(value * 100).toInt()}%", style = MaterialTheme.typography.labelMedium); LinearProgressIndicator(progress = { value }, modifier = Modifier.fillMaxWidth()) }
            }
        }
    }
}
