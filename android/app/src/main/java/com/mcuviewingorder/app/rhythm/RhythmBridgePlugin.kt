package com.mcuviewingorder.app.rhythm

import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "RhythmBridge")
class RhythmBridgePlugin : Plugin() {
    @PluginMethod
    fun getRuntime(call: PluginCall) {
        val destinations = JSArray()
        RhythmRuntime.phaseDestinations.forEach { destination ->
            destinations.put(JSObject().apply {
                put("id", destination.id)
                put("label", destination.label)
                put("role", destination.role)
            })
        }

        call.resolve(JSObject().apply {
            put("system", "Rhythm Material 3 Expressive")
            put("content", "MCU viewing order phase library")
            put("statusPersistence", "localStorage + native SharedPreferences snapshot")
            put("destinations", destinations)
        })
    }

    @PluginMethod
    fun saveLibrarySnapshot(call: PluginCall) {
        val snapshot = call.getString("snapshot") ?: "{}"
        RhythmRuntime.saveSnapshot(context, snapshot)
        call.resolve(JSObject().apply {
            put("saved", true)
            put("bytes", snapshot.length)
        })
    }

    @PluginMethod
    fun getLibrarySnapshot(call: PluginCall) {
        call.resolve(JSObject().apply {
            put("snapshot", RhythmRuntime.readSnapshot(context))
        })
    }
}
