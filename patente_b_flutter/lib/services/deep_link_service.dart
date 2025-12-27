import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/creator_service.dart';

/// Service per gestire i deep link dell'app
/// Supporta:
/// - patenteapp://ref/CODE - Referral link
/// - https://patenteapp.com/ref/CODE - Universal link
class DeepLinkService {
  static final DeepLinkService _instance = DeepLinkService._internal();
  factory DeepLinkService() => _instance;
  DeepLinkService._internal();

  // Channel per ricevere deep links nativi
  static const MethodChannel _channel = MethodChannel(
    'app.patenteapp/deeplink',
  );

  // Stream controller per i deep link
  final StreamController<Uri> _deepLinkController =
      StreamController<Uri>.broadcast();
  Stream<Uri> get deepLinkStream => _deepLinkController.stream;

  // Ultimo deep link ricevuto (per cold start)
  Uri? _initialLink;
  Uri? get initialLink => _initialLink;

  final CreatorService _creatorService = CreatorService();

  /// Inizializza il servizio di deep linking
  Future<void> initialize() async {
    // Ascolta link in arrivo mentre l'app è attiva
    _channel.setMethodCallHandler((call) async {
      if (call.method == 'onDeepLink') {
        final String? link = call.arguments as String?;
        if (link != null) {
          _handleDeepLink(Uri.parse(link));
        }
      }
    });

    // Controlla se l'app è stata avviata da un deep link
    try {
      final String? initialLink = await _channel.invokeMethod('getInitialLink');
      if (initialLink != null) {
        _initialLink = Uri.parse(initialLink);
        _handleDeepLink(_initialLink!);
      }
    } catch (e) {
      debugPrint('Error getting initial link: $e');
    }
  }

  /// Gestisce un deep link ricevuto
  void _handleDeepLink(Uri uri) {
    debugPrint('📱 Deep link received: $uri');

    // Notifica gli ascoltatori
    _deepLinkController.add(uri);

    // Gestisci automaticamente i referral
    _processReferralLink(uri);
  }

  /// Estrae e salva il codice referral da un link
  Future<void> _processReferralLink(Uri uri) async {
    String? referralCode;

    // Formato: patenteapp://ref/CODE
    if (uri.scheme == 'patenteapp' && uri.host == 'ref') {
      referralCode = uri.pathSegments.isNotEmpty
          ? uri.pathSegments.first
          : null;
    }

    // Formato: https://patenteapp.com/ref/CODE
    if ((uri.scheme == 'https' || uri.scheme == 'http') &&
        uri.host == 'patenteapp.com' &&
        uri.pathSegments.isNotEmpty &&
        uri.pathSegments.first == 'ref') {
      referralCode = uri.pathSegments.length > 1 ? uri.pathSegments[1] : null;
    }

    if (referralCode != null && referralCode.isNotEmpty) {
      debugPrint('🎯 Referral code detected: $referralCode');

      // Valida il codice
      final isValid = await _creatorService.validateReferralCode(referralCode);

      if (isValid) {
        // Salva per applicarlo durante la registrazione
        await _creatorService.savePendingReferralCode(referralCode);
        debugPrint('✅ Referral code saved: $referralCode');
      } else {
        debugPrint('❌ Invalid referral code: $referralCode');
      }
    }
  }

  /// Parser manuale per URI (fallback)
  static Uri? parseLink(String? link) {
    if (link == null || link.isEmpty) return null;
    try {
      return Uri.parse(link);
    } catch (e) {
      debugPrint('Error parsing link: $e');
      return null;
    }
  }

  /// Ottiene il codice referral pendente (se presente)
  Future<String?> getPendingReferralCode() async {
    return await _creatorService.getPendingReferralCode();
  }

  /// Pulisce il codice referral pendente
  Future<void> clearPendingReferralCode() async {
    await _creatorService.clearPendingReferralCode();
  }

  /// Dispose
  void dispose() {
    _deepLinkController.close();
  }
}

/// Widget per gestire i deep link nell'albero widget
class DeepLinkHandler extends StatefulWidget {
  final Widget child;
  final void Function(Uri uri)? onDeepLink;

  const DeepLinkHandler({super.key, required this.child, this.onDeepLink});

  @override
  State<DeepLinkHandler> createState() => _DeepLinkHandlerState();
}

class _DeepLinkHandlerState extends State<DeepLinkHandler> {
  late StreamSubscription<Uri> _subscription;
  final DeepLinkService _deepLinkService = DeepLinkService();

  @override
  void initState() {
    super.initState();

    // Inizializza il servizio
    _deepLinkService.initialize();

    // Ascolta nuovi deep link
    _subscription = _deepLinkService.deepLinkStream.listen((uri) {
      widget.onDeepLink?.call(uri);
    });

    // Gestisci link iniziale
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final initialLink = _deepLinkService.initialLink;
      if (initialLink != null) {
        widget.onDeepLink?.call(initialLink);
      }
    });
  }

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return widget.child;
  }
}
