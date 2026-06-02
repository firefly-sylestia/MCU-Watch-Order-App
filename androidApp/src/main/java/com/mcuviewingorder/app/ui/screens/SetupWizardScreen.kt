package com.mcuviewingorder.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.mcuviewingorder.app.ui.theme.Spacing

@Composable
fun SetupWizardScreen(onComplete: () -> Unit) { Column(Modifier.padding(Spacing.x4)) { Text("Welcome to MCU Viewing Order", style = MaterialTheme.typography.headlineMedium); Button(onClick = onComplete) { Text("Start") } } }
data class OnboardingState(val complete: Boolean = false, val preferredUniverse: String = "mcu", val mode: String = "release")
