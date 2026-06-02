package com.mcuviewingorder.app.ui.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable fun PosterImage(title: String, posterPath: String?, modifier: Modifier = Modifier) { PosterFallback(title, modifier) }
