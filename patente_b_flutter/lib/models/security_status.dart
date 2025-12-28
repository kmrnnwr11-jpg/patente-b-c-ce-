class SecurityStatus {
  final bool allowed;
  final String? reason;
  final bool isRooted;
  final bool isEmulator;
  final String? apkSignature;
  final String? deviceFingerprint;
  final DateTime? serverTime;

  SecurityStatus({
    required this.allowed,
    this.reason,
    this.isRooted = false,
    this.isEmulator = false,
    this.apkSignature,
    this.deviceFingerprint,
    this.serverTime,
  });

  factory SecurityStatus.fromJson(Map<String, dynamic> json) {
    return SecurityStatus(
      allowed: json['allowed'] ?? false,
      reason: json['reason'],
      serverTime: json['serverTime'] != null
          ? DateTime.parse(json['serverTime'])
          : null,
    );
  }
}
