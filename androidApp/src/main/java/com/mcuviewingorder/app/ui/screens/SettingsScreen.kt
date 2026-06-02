package com.mcuviewingorder.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.mcuviewingorder.app.domain.AppViewModel
import com.mcuviewingorder.app.ui.theme.Spacing
import com.mcuviewingorder.shared.model.ThemeMode
import kotlinx.coroutines.launch

@Composable
fun SettingsScreen(viewModel: AppViewModel, padding: PaddingValues) {
    val prefs by viewModel.preferences.collectAsState()
    val scope = rememberCoroutineScope()
    Column(Modifier.padding(padding).padding(Spacing.x4), verticalArrangement = Arrangement.spacedBy(Spacing.x4)) {
        Text("Settings", style = MaterialTheme.typography.headlineLarge)
        Text("Theme mode")
        Row(horizontalArrangement = Arrangement.spacedBy(Spacing.x2)) { ThemeMode.entries.forEach { mode -> FilterChip(selected = prefs.themeMode == mode, onClick = { scope.launch { viewModel.preferencesRepository.setThemeMode(mode) } }, label = { Text(mode.name) }) } }
        Text("Density")
        Row(horizontalArrangement = Arrangement.spacedBy(Spacing.x2)) { listOf("compact", "comfortable").forEach { density -> FilterChip(selected = prefs.density == density, onClick = { scope.launch { viewModel.preferencesRepository.setDensity(density) } }, label = { Text(density) }) } }
        Row { Text("Performance data saver", Modifier.weight(1f)); Switch(checked = prefs.dataSaver, onCheckedChange = { scope.launch { viewModel.preferencesRepository.setDataSaver(it) } }) }
        ElevatedCard { Column(Modifier.padding(Spacing.x4)) { Text("Import / Export", style = MaterialTheme.typography.titleMedium); Text("Use the native share sheet or paste backups from the web app export tools.") } }
        Button(colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error), onClick = { viewModel.clearProgress() }) { Text("Reset progress") }
        Text("MCU Viewing Order native Kotlin APK • package com.mcuviewingorder.app")
    }
}
