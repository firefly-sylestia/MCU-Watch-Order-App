package com.mcuviewingorder.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

object McuColors {
    val MarvelRed = Color(0xFFE11D48)
    val ArcGold = Color(0xFFF59E0B)
    val CosmicBlue = Color(0xFF38BDF8)
    val Success = Color(0xFF22C55E)
    val Warning = Color(0xFFF59E0B)
    val Danger = Color(0xFFEF4444)
}
object Spacing { val x1 = 4.dp; val x2 = 8.dp; val x3 = 12.dp; val x4 = 16.dp; val x6 = 24.dp; val x8 = 32.dp }
private val DarkScheme = darkColorScheme(primary = McuColors.MarvelRed, secondary = McuColors.ArcGold, tertiary = McuColors.CosmicBlue, background = Color(0xFF090B12), surface = Color(0xFF111827), surfaceVariant = Color(0xFF1F2937), onSurface = Color(0xFFE5E7EB), outline = Color(0xFF64748B))
private val LightScheme = lightColorScheme(primary = Color(0xFFB91C1C), secondary = Color(0xFFB45309), tertiary = Color(0xFF0369A1), background = Color(0xFFFAFAFA), surface = Color.White, surfaceVariant = Color(0xFFF1F5F9), onSurface = Color(0xFF111827), outline = Color(0xFF64748B))
@Composable fun McuTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = if (darkTheme) DarkScheme else LightScheme, typography = Typography(), shapes = Shapes(), content = content)
}
