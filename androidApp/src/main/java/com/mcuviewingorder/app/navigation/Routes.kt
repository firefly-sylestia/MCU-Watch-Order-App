package com.mcuviewingorder.app.navigation

object Routes {
    const val Home = "home"
    const val Title = "title/{slug}"
    const val Settings = "settings"
    const val Analytics = "analytics"
    const val Library = "library"
    const val Collections = "collections"
    const val ThemeStudio = "theme-studio"
    const val Search = "search?query={query}"
    const val Phase = "phase/{phaseNumber}"
    const val Universe = "universe/{universeId}"
    fun title(slug: String) = "title/$slug"
}
