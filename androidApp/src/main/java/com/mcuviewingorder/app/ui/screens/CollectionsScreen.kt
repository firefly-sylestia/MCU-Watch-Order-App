package com.mcuviewingorder.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.mcuviewingorder.app.domain.AppViewModel
import com.mcuviewingorder.app.ui.theme.Spacing

@Composable
fun CollectionsScreen(viewModel: AppViewModel, padding: PaddingValues) {
    Column(Modifier.padding(padding).padding(Spacing.x4), verticalArrangement = Arrangement.spacedBy(Spacing.x4)) {
        Text("Collections", style = MaterialTheme.typography.headlineLarge)
        listOf("Infinity Saga", "Multiverse Saga", "Guardians", "Street-Level Heroes").forEach { ElevatedCard { Text(it, Modifier.padding(Spacing.x4)) } }
    }
}
