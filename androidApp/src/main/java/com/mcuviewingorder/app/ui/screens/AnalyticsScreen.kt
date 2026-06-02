package com.mcuviewingorder.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.mcuviewingorder.app.domain.AppViewModel
import com.mcuviewingorder.app.ui.theme.Spacing

@Composable
fun AnalyticsScreen(viewModel: AppViewModel, padding: PaddingValues) {
    val stats by viewModel.stats.collectAsState()
    Column(Modifier.padding(padding).padding(Spacing.x4), verticalArrangement = Arrangement.spacedBy(Spacing.x4)) {
        Text("Analytics", style = MaterialTheme.typography.headlineLarge)
        ElevatedCard { Column(Modifier.padding(Spacing.x4)) { Text("Completion"); Text("${stats.watchedCount}/${stats.totalCount} watched") } }
        ElevatedCard { Column(Modifier.padding(Spacing.x4)) { Text("Status distribution"); stats.statusDistribution.forEach { (status, count) -> Text("${status.name}: $count") } } }
        ElevatedCard { Column(Modifier.padding(Spacing.x4)) { Text("Runtime"); Text("${stats.watchedRuntimeMinutes / 60}h watched / ${stats.totalRuntimeMinutes / 60}h total") } }
    }
}
