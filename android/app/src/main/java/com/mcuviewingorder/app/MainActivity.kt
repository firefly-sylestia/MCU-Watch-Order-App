package com.mcuviewingorder.app

import android.os.Bundle
import androidx.activity.OnBackPressedCallback
import com.getcapacitor.BridgeActivity
import com.mcuviewingorder.app.rhythm.RhythmBridgePlugin
import com.mcuviewingorder.app.rhythm.RhythmRuntime

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(RhythmBridgePlugin::class.java)
        super.onCreate(savedInstanceState)
        RhythmRuntime.applyEdgeToEdge(this)

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
