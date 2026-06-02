package com.mcuviewingorder.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.mcuviewingorder.app.domain.AppViewModel
import com.mcuviewingorder.app.ui.theme.McuColors
import com.mcuviewingorder.app.ui.theme.Spacing

@Composable
fun ThemeStudioScreen(viewModel: AppViewModel, padding: PaddingValues) {
    Column(Modifier.padding(padding).padding(Spacing.x4), verticalArrangement = Arrangement.spacedBy(Spacing.x4)) {
        Text("Theme Studio", style = MaterialTheme.typography.headlineLarge)
        Text("Native semantic tokens keep the cinematic Marvel-inspired identity accessible in light, dark, and system modes.")
        listOf("Primary" to McuColors.MarvelRed, "Accent" to McuColors.ArcGold, "Cosmic" to McuColors.CosmicBlue).forEach { (name, color) -> AssistChip(onClick = {}, label = { Text(name) }, colors = AssistChipDefaults.assistChipColors(containerColor = color)) }
    }
}
