package com.patenteb.patente_b_flutter

import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.provider.Settings
import io.flutter.embedding.engine.plugins.FlutterPlugin
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import java.io.File
import java.security.MessageDigest

class SecurityPlugin : FlutterPlugin, MethodChannel.MethodCallHandler {
    private lateinit var channel: MethodChannel
    private lateinit var context: Context

    override fun onAttachedToEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel = MethodChannel(binding.binaryMessenger, "com.patenteb.patente_b_flutter/security")
        channel.setMethodCallHandler(this)
        context = binding.applicationContext
    }

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        when (call.method) {
            "getApkSignature" -> result.success(getApkSignature())
            "checkRoot" -> result.success(isDeviceRooted())
            "checkEmulator" -> result.success(isEmulator())
            "getDeviceInfo" -> result.success(getDeviceInfo())
            else -> result.notImplemented()
        }
    }

    private fun getApkSignature(): String {
        return try {
            val packageInfo = context.packageManager.getPackageInfo(
                context.packageName,
                PackageManager.GET_SIGNATURES
            )
            val signatures = packageInfo.signatures
            if (signatures.isNotEmpty()) {
                val signature = signatures[0].toByteArray()
                val md = MessageDigest.getInstance("SHA-256")
                val digest = md.digest(signature)
                digest.joinToString("") { "%02x".format(it) }
            } else {
                ""
            }
        } catch (e: Exception) {
            ""
        }
    }

    private fun isDeviceRooted(): Boolean {
        val rootIndicators = listOf(
            "/system/app/Superuser.apk",
            "/sbin/su",
            "/system/bin/su",
            "/system/xbin/su",
            "/data/local/xbin/su",
            "/data/local/bin/su",
            "/system/sd/xbin/su",
            "/system/bin/failsafe/su",
            "/data/local/su",
            "/su/bin/su"
        )
        
        for (path in rootIndicators) {
            if (File(path).exists()) return true
        }
        
        return try {
            val process = Runtime.getRuntime().exec("which su")
            process.inputStream.bufferedReader().use { it.readLine() != null }
        } catch (e: Exception) {
            false
        }
    }

    private fun isEmulator(): Boolean {
        return (Build.FINGERPRINT.startsWith("generic")
                || Build.FINGERPRINT.startsWith("unknown")
                || Build.MODEL.contains("google_sdk")
                || Build.MODEL.contains("Emulator")
                || Build.MODEL.contains("Android SDK built for x86")
                || Build.MANUFACTURER.contains("Genymotion")
                || Build.BRAND.startsWith("generic")
                || Build.DEVICE.startsWith("generic")
                || "google_sdk" == Build.PRODUCT
                || Build.HARDWARE.contains("goldfish")
                || Build.HARDWARE.contains("ranchu"))
    }

    private fun getDeviceInfo(): Map<String, String> {
        return mapOf(
            "androidId" to Settings.Secure.getString(
                context.contentResolver,
                Settings.Secure.ANDROID_ID
            ),
            "model" to Build.MODEL,
            "manufacturer" to Build.MANUFACTURER,
            "brand" to Build.BRAND,
            "device" to Build.DEVICE,
            "product" to Build.PRODUCT,
            "hardware" to Build.HARDWARE,
            "fingerprint" to Build.FINGERPRINT
        )
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel.setMethodCallHandler(null)
    }
}
