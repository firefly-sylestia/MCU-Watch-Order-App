package com.mcuviewingorder.app.data

import android.content.Context
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import com.mcuviewingorder.shared.model.ThemeMode
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore("mcu_user_preferences")

data class UserPreferences(val themeMode: ThemeMode = ThemeMode.System, val density: String = "comfortable", val textScale: Float = 1f, val dataSaver: Boolean = false, val onboardingComplete: Boolean = false)

class UserPreferencesRepository(private val context: Context) {
    private val theme = stringPreferencesKey("theme")
    private val density = stringPreferencesKey("density")
    private val textScale = floatPreferencesKey("text_scale")
    private val dataSaver = booleanPreferencesKey("data_saver")
    private val onboarding = booleanPreferencesKey("onboarding")
    val preferences: Flow<UserPreferences> = context.dataStore.data.map { p ->
        UserPreferences(
            themeMode = runCatching { ThemeMode.valueOf(p[theme] ?: ThemeMode.System.name) }.getOrDefault(ThemeMode.System),
            density = p[density] ?: "comfortable",
            textScale = p[textScale] ?: 1f,
            dataSaver = p[dataSaver] ?: false,
            onboardingComplete = p[onboarding] ?: false
        )
    }
    suspend fun setThemeMode(mode: ThemeMode) = context.dataStore.edit { it[theme] = mode.name }
    suspend fun setDensity(value: String) = context.dataStore.edit { it[density] = value }
    suspend fun setDataSaver(value: Boolean) = context.dataStore.edit { it[dataSaver] = value }
    suspend fun completeOnboarding() = context.dataStore.edit { it[onboarding] = true }
}
