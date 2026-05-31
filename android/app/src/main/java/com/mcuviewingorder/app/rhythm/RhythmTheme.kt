package com.mcuviewingorder.app.rhythm

import android.os.Build
import android.view.Window
import androidx.core.view.WindowCompat

fun Window.applyRhythmEdgeToEdge(chrome: RhythmChrome) {
    WindowCompat.getInsetsController(this, decorView).apply {
        isAppearanceLightStatusBars = chrome.darkStatusBarIcons
        isAppearanceLightNavigationBars = chrome.darkNavigationBarIcons
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        isStatusBarContrastEnforced = chrome.contrastEnforced
        isNavigationBarContrastEnforced = chrome.contrastEnforced
    }
}
