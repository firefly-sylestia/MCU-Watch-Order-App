package com.mcuviewingorder.shared.repository

import com.mcuviewingorder.shared.data.GeneratedCatalog
import com.mcuviewingorder.shared.model.TitleEntry

class CatalogRepository {
    fun titles(): List<TitleEntry> = GeneratedCatalog.titles
    fun titleBySlug(slug: String): TitleEntry? = titles().firstOrNull { it.slug == slug }
}
