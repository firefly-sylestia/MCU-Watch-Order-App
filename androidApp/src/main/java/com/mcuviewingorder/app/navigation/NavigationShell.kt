package com.mcuviewingorder.app.navigation

import androidx.compose.material3.*
import androidx.compose.runtime.Composable

@Composable
fun NavigationShell(currentRoute: String?, onNavigate: (String) -> Unit) {
    NavigationBar {
        listOf(Routes.Home to "Home", Routes.Library to "Library", Routes.Analytics to "Analytics", Routes.Settings to "Settings").forEach { (route, label) ->
            NavigationBarItem(selected = currentRoute == route, onClick = { onNavigate(route) }, icon = { Text(label.take(1)) }, label = { Text(label) })
        }
    }
}
