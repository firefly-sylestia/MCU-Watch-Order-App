package com.mcuviewingorder.app.ui.components

import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import com.mcuviewingorder.shared.model.WatchStatus

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun StatusPicker(selected: WatchStatus, onSelect: (WatchStatus) -> Unit) {
    FlowRow { WatchStatus.entries.forEach { status -> FilterChip(selected = selected == status, onClick = { onSelect(status) }, label = { Text(status.name) }) } }
}
