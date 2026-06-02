package com.mcuviewingorder.app.navigation

import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.navigation.NavType
import androidx.navigation.compose.*
import androidx.navigation.navArgument
import com.mcuviewingorder.app.domain.AppViewModel
import com.mcuviewingorder.app.ui.screens.*

@Composable
fun AppNavGraph(viewModel: AppViewModel) {
    val nav = rememberNavController()
    val snackbarHostState = remember { SnackbarHostState() }
    val ui by viewModel.ui.collectAsState()
    LaunchedEffect(ui.snackbar) { ui.snackbar?.let { snackbarHostState.showSnackbar(it); viewModel.setSnackbar(null) } }
    Scaffold(snackbarHost = { SnackbarHost(snackbarHostState) }, bottomBar = { NavigationShell(nav.currentBackStackEntryAsState().value?.destination?.route, onNavigate = { nav.navigate(it) { launchSingleTop = true } }) }) { padding ->
        NavHost(navController = nav, startDestination = Routes.Home) {
            composable(Routes.Home) { TitleListScreen(viewModel, padding, onOpen = { nav.navigate(Routes.title(it)) }) }
            composable(Routes.Title, arguments = listOf(navArgument("slug") { type = NavType.StringType })) { entry -> TitleRoute(viewModel, entry.arguments?.getString("slug"), padding, onBack = { nav.popBackStack() }) }
            composable(Routes.Settings) { SettingsScreen(viewModel, padding) }
            composable(Routes.Analytics) { AnalyticsScreen(viewModel, padding) }
            composable(Routes.Library) { LibraryScreen(viewModel, padding, onOpen = { nav.navigate(Routes.title(it)) }) }
            composable(Routes.Collections) { CollectionsScreen(viewModel, padding) }
            composable(Routes.ThemeStudio) { ThemeStudioScreen(viewModel, padding) }
        }
    }
}
