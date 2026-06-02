package com.mcuviewingorder.app.platform

import android.content.Context
import android.content.Intent
import java.io.File

class BackupRepository(private val context: Context) {
    fun writeBackup(text: String): File = File(context.filesDir, "mcu-progress-backup.txt").also { it.writeText(text) }
    fun shareProgressIntent(text: String): Intent = Intent(Intent.ACTION_SEND).apply {
        type = "text/plain"
        putExtra(Intent.EXTRA_SUBJECT, "MCU Viewing Order progress backup")
        putExtra(Intent.EXTRA_TEXT, text)
    }
}
