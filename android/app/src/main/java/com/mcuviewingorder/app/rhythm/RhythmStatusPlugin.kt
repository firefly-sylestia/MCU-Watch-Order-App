package com.mcuviewingorder.app.rhythm

import android.content.Context
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.PluginMethod
import org.json.JSONObject

@CapacitorPlugin(name = "RhythmStatus")
class RhythmStatusPlugin : Plugin() {
    private val preferences by lazy {
        context.getSharedPreferences(RhythmAppSystem.statusStorageName, Context.MODE_PRIVATE)
    }

    @PluginMethod
    fun getAppSystem(call: PluginCall) {
        val payload = JSObject().apply {
            put("sourceRepository", RhythmAppSystem.sourceRepository)
            put("namespace", RhythmAppSystem.appNamespace)
            put("storageVersion", RhythmAppSystem.statusStorageVersion)
            put("homeSections", JSArray(RhythmAppSystem.homeSections.map { section ->
                JSObject().apply {
                    put("id", section.id)
                    put("title", section.title)
                    put("description", section.description)
                    put("route", section.route)
                }
            }))
            put("statusBuckets", JSArray(RhythmAppSystem.statusBuckets.map { status ->
                JSObject().apply {
                    put("id", status.id)
                    put("label", status.label)
                    put("saved", status.saved)
                }
            }))
        }
        call.resolve(payload)
    }

    @PluginMethod
    fun saveStatus(call: PluginCall) {
        val titleId = call.getString("titleId")
        val status = call.getString("status")
        if (titleId.isNullOrBlank() || status.isNullOrBlank()) {
            call.reject("titleId and status are required")
            return
        }

        val metadata = call.getObject("metadata") ?: JSObject()
        val record = JSObject().apply {
            put("titleId", titleId)
            put("status", status)
            put("metadata", metadata)
            put("updatedAt", System.currentTimeMillis())
        }

        preferences.edit().putString(statusKey(titleId), record.toString()).apply()
        call.resolve(record)
    }

    @PluginMethod
    fun getStatus(call: PluginCall) {
        val titleId = call.getString("titleId")
        if (titleId.isNullOrBlank()) {
            call.reject("titleId is required")
            return
        }

        call.resolve(readStatus(titleId) ?: JSObject().apply {
            put("titleId", titleId)
            put("status", "unwatched")
        })
    }

    @PluginMethod
    fun getAllStatuses(call: PluginCall) {
        val statuses = preferences.all.keys
            .filter { key -> key.startsWith(STATUS_PREFIX) }
            .mapNotNull { key -> preferences.getString(key, null)?.toJsonObjectOrNull() }
            .sortedByDescending { json -> json.optLong("updatedAt", 0L) }

        call.resolve(JSObject().apply {
            put("statuses", JSArray(statuses))
        })
    }

    @PluginMethod
    fun clearStatus(call: PluginCall) {
        val titleId = call.getString("titleId")
        if (titleId.isNullOrBlank()) {
            call.reject("titleId is required")
            return
        }

        preferences.edit().remove(statusKey(titleId)).apply()
        call.resolve(JSObject().apply {
            put("titleId", titleId)
            put("status", "unwatched")
        })
    }

    private fun readStatus(titleId: String): JSObject? = preferences
        .getString(statusKey(titleId), null)
        ?.toJsonObjectOrNull()

    private fun statusKey(titleId: String) = "$STATUS_PREFIX$titleId"

    private fun String.toJsonObjectOrNull(): JSObject? = runCatching {
        JSObject(JSONObject(this).toString())
    }.getOrNull()

    private companion object {
        const val STATUS_PREFIX = "status:"
    }
}
