package com.mcuviewingorder.shared.progress

import com.mcuviewingorder.shared.model.TitleEntry
import com.mcuviewingorder.shared.model.WatchProgress
import com.mcuviewingorder.shared.model.WatchStatus

data class ProgressStats(
    val totalCount: Int,
    val watchedCount: Int,
    val remainingCount: Int,
    val completion: Float,
    val byPhase: Map<Int, Float>,
    val statusDistribution: Map<WatchStatus, Int>,
    val totalRuntimeMinutes: Int,
    val watchedRuntimeMinutes: Int,
    val watchStreakDays: Int
)

object ProgressCalculator {
    fun calculate(titles: List<TitleEntry>, progress: Map<String, WatchProgress>): ProgressStats {
        val watched = titles.filter { progress[it.id]?.status == WatchStatus.Watched }
        val byPhase = titles.groupBy { it.phase ?: 0 }.mapValues { (_, phaseTitles) ->
            if (phaseTitles.isEmpty()) 0f else phaseTitles.count { progress[it.id]?.status == WatchStatus.Watched }.toFloat() / phaseTitles.size
        }
        val distribution = WatchStatus.entries.associateWith { status -> titles.count { (progress[it.id]?.status ?: WatchStatus.Unwatched) == status } }
        return ProgressStats(
            totalCount = titles.size,
            watchedCount = watched.size,
            remainingCount = titles.size - watched.size,
            completion = if (titles.isEmpty()) 0f else watched.size.toFloat() / titles.size,
            byPhase = byPhase,
            statusDistribution = distribution,
            totalRuntimeMinutes = titles.sumOf { it.runtimeMinutes ?: 0 },
            watchedRuntimeMinutes = watched.sumOf { it.runtimeMinutes ?: 0 },
            watchStreakDays = streak(progress.values.mapNotNull { it.watchedDate })
        )
    }
    private fun streak(dates: List<String>): Int = dates.distinct().sortedDescending().takeIf { it.isNotEmpty() }?.size?.coerceAtMost(30) ?: 0
}
