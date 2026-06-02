package com.mcuviewingorder.app.data

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.mcuviewingorder.shared.model.WatchProgress
import com.mcuviewingorder.shared.model.WatchStatus
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.time.LocalDate

private val Context.progressStore by preferencesDataStore("mcu_watch_progress")

class ProgressRepository(private val context: Context) {
    private val progressKey = stringPreferencesKey("progress_blob")
    val progress: Flow<Map<String, WatchProgress>> = context.progressStore.data.map { decode(it[progressKey] ?: "") }
    suspend fun setStatus(titleId: String, status: WatchStatus) = context.progressStore.edit { prefs ->
        val current = decode(prefs[progressKey] ?: "").toMutableMap()
        val old = current[titleId] ?: WatchProgress(titleId)
        current[titleId] = old.copy(status = status, watchedDate = if (status == WatchStatus.Watched) LocalDate.now().toString() else old.watchedDate, progress = if (status == WatchStatus.Watched) 1f else old.progress)
        prefs[progressKey] = encode(current)
    }
    suspend fun toggleWatched(titleId: String) = context.progressStore.edit { prefs ->
        val current = decode(prefs[progressKey] ?: "").toMutableMap()
        val old = current[titleId] ?: WatchProgress(titleId)
        val next = if (old.status == WatchStatus.Watched) WatchStatus.Unwatched else WatchStatus.Watched
        current[titleId] = old.copy(status = next, watchedDate = if (next == WatchStatus.Watched) LocalDate.now().toString() else old.watchedDate, progress = if (next == WatchStatus.Watched) 1f else 0f)
        prefs[progressKey] = encode(current)
    }
    suspend fun clear() = context.progressStore.edit { it.remove(progressKey) }
    fun export(progress: Map<String, WatchProgress>): String = encode(progress)
    fun import(raw: String): Map<String, WatchProgress> = decode(raw)
    private fun encode(map: Map<String, WatchProgress>) = map.values.joinToString("\n") { listOf(it.titleId, it.status.name, it.watchedDate ?: "", it.rewatchCount, it.favorite, it.bookmarked, it.progress).joinToString("|") }
    private fun decode(raw: String): Map<String, WatchProgress> = raw.lines().filter { it.isNotBlank() }.mapNotNull { line ->
        val p = line.split("|")
        if (p.size < 7) null else runCatching { WatchProgress(p[0], WatchStatus.valueOf(p[1]), p[2].ifBlank { null }, p[3].toInt(), p[4].toBoolean(), p[5].toBoolean(), p[6].toFloat()) }.getOrNull()
    }.associateBy { it.titleId }
}
