package com.mcuviewingorder.app.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.mcuviewingorder.app.ui.theme.Spacing
import com.mcuviewingorder.shared.filters.FilterState
import com.mcuviewingorder.shared.model.SortMode
import com.mcuviewingorder.shared.model.Universe

@Composable
fun FilterBar(filter: FilterState, sort: SortMode, onFilter: ((FilterState) -> FilterState) -> Unit, onSort: (SortMode) -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(Spacing.x2)) {
        OutlinedTextField(value = filter.searchText, onValueChange = { q -> onFilter { it.copy(searchText = q) } }, label = { Text("Search titles") }, singleLine = true, modifier = Modifier.fillMaxWidth(), keyboardActions = KeyboardActions.Default)
        Row(horizontalArrangement = Arrangement.spacedBy(Spacing.x2), modifier = Modifier.fillMaxWidth()) {
            FilterChip(selected = filter.essentialOnly, onClick = { onFilter { it.copy(essentialOnly = !it.essentialOnly) } }, label = { Text("Essential") })
            FilterChip(selected = filter.universe == Universe.Mcu, onClick = { onFilter { it.copy(universe = if (it.universe == Universe.Mcu) null else Universe.Mcu) } }, label = { Text("MCU") })
            FilterChip(selected = filter.universe == Universe.Dc, onClick = { onFilter { it.copy(universe = if (it.universe == Universe.Dc) null else Universe.Dc) } }, label = { Text("DC") })
        }
        Row(horizontalArrangement = Arrangement.spacedBy(Spacing.x2)) { SortMode.entries.take(4).forEach { mode -> AssistChip(onClick = { onSort(mode) }, label = { Text(if (sort == mode) "✓ ${mode.name}" else mode.name) }) } }
    }
}
