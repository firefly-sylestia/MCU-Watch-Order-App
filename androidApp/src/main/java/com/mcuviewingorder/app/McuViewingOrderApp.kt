package com.mcuviewingorder.app

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.lifecycle.viewmodel.compose.viewModel
import com.mcuviewingorder.app.domain.AppViewModel
import com.mcuviewingorder.app.navigation.AppNavGraph
import com.mcuviewingorder.app.ui.theme.McuTheme
import com.mcuviewingorder.shared.model.ThemeMode

@Composable
fun McuViewingOrderApp(viewModel: AppViewModel = viewModel()) {
    val preferences by viewModel.preferences.collectAsState()
    val dark = when (preferences.themeMode) { ThemeMode.System -> isSystemInDarkTheme(); ThemeMode.Dark -> true; ThemeMode.Light -> false }
    McuTheme(darkTheme = dark) { AppNavGraph(viewModel) }
}
