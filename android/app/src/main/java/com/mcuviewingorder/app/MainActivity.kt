package com.mcuviewingorder.app

import android.graphics.Color
import android.os.Bundle
import androidx.activity.OnBackPressedCallback
import androidx.core.view.WindowCompat
import com.getcapacitor.BridgeActivity
import com.mcuviewingorder.app.rhythm.RhythmAppSystem
import com.mcuviewingorder.app.rhythm.RhythmStatusPlugin
import com.mcuviewingorder.app.rhythm.applyRhythmEdgeToEdge

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(RhythmStatusPlugin::class.java)
        super.onCreate(savedInstanceState)

        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT
        window.applyRhythmEdgeToEdge(RhythmAppSystem.defaultChrome)

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                val webView = bridge?.webView
                if (webView?.canGoBack() == true) {
                    webView.goBack()
                } else {
                    moveTaskToBack(true)
                }
            }
        })
    }
}
