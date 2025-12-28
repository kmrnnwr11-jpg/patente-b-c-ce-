import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../providers/auth_provider.dart';
import '../../providers/subscription_provider.dart';
import '../../models/subscription_model.dart';
import 'my_subscription_screen.dart';

/// Schermata per visualizzare i piani di abbonamento
class SubscriptionPlansScreen extends StatefulWidget {
  const SubscriptionPlansScreen({super.key});

  @override
  State<SubscriptionPlansScreen> createState() =>
      _SubscriptionPlansScreenState();
}

class _SubscriptionPlansScreenState extends State<SubscriptionPlansScreen> {
  final _promoCodeController = TextEditingController();
  bool _isValidatingPromo = false;

  @override
  void dispose() {
    _promoCodeController.dispose();
    super.dispose();
  }

  Future<void> _applyPromoCode() async {
    if (_promoCodeController.text.isEmpty) return;

    setState(() => _isValidatingPromo = true);

    final authProvider = context.read<AuthProvider>();
    final subscriptionProvider = context.read<SubscriptionProvider>();

    if (authProvider.firebaseUser != null) {
      final success = await subscriptionProvider.applyPromoCode(
        _promoCodeController.text.toUpperCase(),
        authProvider.firebaseUser!.uid,
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Codice ${subscriptionProvider.appliedPromoCode?.discountText} applicato!',
            ),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
          ),
        );
      } else if (mounted && subscriptionProvider.error != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(subscriptionProvider.error!),
            backgroundColor: Colors.red.shade700,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }

    setState(() => _isValidatingPromo = false);
  }

  Future<void> _startCheckout() async {
    final authProvider = context.read<AuthProvider>();
    final subscriptionProvider = context.read<SubscriptionProvider>();

    if (authProvider.firebaseUser == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Devi essere loggato per abbonarti'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    final result = await subscriptionProvider.startCheckout(
      userId: authProvider.firebaseUser!.uid,
      email: authProvider.firebaseUser!.email ?? '',
    );

    if (result != null && result['url'] != null && mounted) {
      // Apri URL di checkout Stripe
      final url = Uri.parse(result['url']);
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      }
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(subscriptionProvider.error ?? 'Errore nel pagamento'),
          backgroundColor: Colors.red.shade700,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Consumer2<AuthProvider, SubscriptionProvider>(
      builder: (context, authProvider, subscriptionProvider, child) {
        if (subscriptionProvider.isPremium) {
          return const MySubscriptionScreen();
        }

        final plan = SubscriptionPlan.premiumMonthly;
        final finalPrice = subscriptionProvider.calculateFinalPrice();
        final hasDiscount = finalPrice < plan.price;

        return Scaffold(
          extendBodyBehindAppBar: true,
          appBar: AppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            leading: IconButton(
              icon: Icon(
                Icons.arrow_back_ios_new,
                color: theme.colorScheme.onSurface,
              ),
              onPressed: () => Navigator.pop(context),
            ),
          ),
          body: Stack(
            children: [
              // Sfondo con gradienti sfumati (Premium Look)
              Positioned(
                top: -100,
                right: -50,
                child: _buildBlurCircle(Colors.amber.withOpacity(0.2), 300),
              ),
              Positioned(
                bottom: -50,
                left: -50,
                child: _buildBlurCircle(Colors.orange.withOpacity(0.15), 250),
              ),

              SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(24, 120, 24, 40),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Header Premium (Vibrant)
                    _buildPremiumHeader(theme),
                    const SizedBox(height: 48),

                    // Card Piano Premium (Glassmorphism & Gold)
                    _buildPlanCard(theme, plan, finalPrice, hasDiscount),
                    const SizedBox(height: 32),

                    // Campo Codice Promo (Modern)
                    _buildPromoCodeSection(theme, subscriptionProvider, isDark),
                    const SizedBox(height: 40),

                    // Bottone Abbonati (Grandioso)
                    _buildSubscribeButton(
                      theme,
                      subscriptionProvider,
                      finalPrice,
                    ),
                    const SizedBox(height: 24),

                    // Info garanzia
                    _buildGuaranteeInfo(theme, isDark),
                    const SizedBox(height: 40),

                    // Comparazione Free vs Premium (Scrittura chiara)
                    _buildComparisonSection(theme, isDark),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildBlurCircle(Color color, double size) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(color: color, shape: BoxShape.circle),
      child: Center(
        child: Container(
          width: size * 0.8,
          height: size * 0.8,
          decoration: BoxDecoration(
            color: color.withOpacity(0.3),
            shape: BoxShape.circle,
          ),
        ),
      ),
    );
  }

  Widget _buildPremiumHeader(ThemeData theme) {
    return Column(
      children: [
        ShaderMask(
          shaderCallback: (bounds) => LinearGradient(
            colors: [Colors.amber.shade400, Colors.orange.shade700],
          ).createShader(bounds),
          child: const Icon(Icons.stars_rounded, size: 80, color: Colors.white),
        ),
        const SizedBox(height: 24),
        Text(
          'Passa al Prossimo Livello',
          style: theme.textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.w900,
            letterSpacing: -0.5,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 12),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            'L\'unico strumento completo per superare l\'esame della patente al primo colpo.',
            style: theme.textTheme.bodyLarge?.copyWith(
              color: theme.colorScheme.onSurface.withOpacity(0.6),
              height: 1.4,
            ),
            textAlign: TextAlign.center,
          ),
        ),
      ],
    );
  }

  Widget _buildPlanCard(
    ThemeData theme,
    SubscriptionPlan plan,
    double finalPrice,
    bool hasDiscount,
  ) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(32),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            theme.brightness == Brightness.dark
                ? Colors.grey.shade900
                : Colors.white,
            theme.brightness == Brightness.dark
                ? Colors.black
                : Colors.grey.shade50,
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 30,
            offset: const Offset(0, 15),
          ),
          BoxShadow(
            color: Colors.amber.withOpacity(0.2),
            blurRadius: 40,
            offset: const Offset(0, 5),
            spreadRadius: -10,
          ),
        ],
        border: Border.all(
          color: Colors.amber.shade600.withOpacity(0.3),
          width: 1.5,
        ),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(32),
        child: Stack(
          children: [
            // Angolo Oro
            Positioned(
              top: -20,
              right: -20,
              child: Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.amber.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        plan.name.toUpperCase(),
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 2,
                          color: Colors.amber.shade700,
                        ),
                      ),
                      if (plan.isPopular)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Colors.amber.shade600,
                                Colors.orange.shade700,
                              ],
                            ),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Text(
                            'CONSIGLIATO',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        '€${finalPrice.toStringAsFixed(2)}',
                        style: theme.textTheme.displayMedium?.copyWith(
                          fontWeight: FontWeight.w900,
                          color: theme.colorScheme.onSurface,
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(bottom: 12, left: 4),
                        child: Text(
                          '/mese',
                          style: theme.textTheme.bodyLarge?.copyWith(
                            color: theme.colorScheme.onSurface.withOpacity(0.5),
                          ),
                        ),
                      ),
                    ],
                  ),
                  if (hasDiscount)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Text(
                        'Invece di €${plan.price.toStringAsFixed(2)}',
                        style: TextStyle(
                          color: theme.colorScheme.error,
                          decoration: TextDecoration.lineThrough,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  const SizedBox(height: 32),
                  const Divider(),
                  const SizedBox(height: 24),
                  ...plan.features.map(
                    (feature) => _buildFeatureItem(theme, feature),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureItem(ThemeData theme, String feature) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: Colors.amber.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.check_rounded,
              color: Colors.amber.shade800,
              size: 18,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              feature,
              style: theme.textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w500,
                color: theme.colorScheme.onSurface.withOpacity(0.8),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPromoCodeSection(
    ThemeData theme,
    SubscriptionProvider provider,
    bool isDark,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'CODICE PROMOZIONALE',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                letterSpacing: 1,
                color: theme.colorScheme.onSurface.withOpacity(0.5),
              ),
            ),
            if (provider.appliedPromoCode != null)
              GestureDetector(
                onTap: () {
                  provider.removePromoCode();
                  _promoCodeController.clear();
                },
                child: Text(
                  'RIMUOVI',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.error,
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 12),
        Container(
          height: 64,
          decoration: BoxDecoration(
            color: isDark
                ? Colors.white.withOpacity(0.05)
                : Colors.grey.shade100,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: provider.error != null
                  ? theme.colorScheme.error.withOpacity(0.5)
                  : Colors.transparent,
            ),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            children: [
              Icon(
                Icons.local_offer_rounded,
                color: Colors.amber.shade700,
                size: 24,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: TextField(
                  controller: _promoCodeController,
                  textCapitalization: TextCapitalization.characters,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                    letterSpacing: 2,
                  ),
                  decoration: const InputDecoration(
                    hintText: 'COUPON20',
                    hintStyle: TextStyle(
                      color: Colors.grey,
                      fontSize: 16,
                      letterSpacing: 0,
                    ),
                    border: InputBorder.none,
                  ),
                ),
              ),
              if (_isValidatingPromo)
                const SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              else if (provider.appliedPromoCode == null)
                TextButton(
                  onPressed: _applyPromoCode,
                  child: Text(
                    'APPLICA',
                    style: TextStyle(
                      fontWeight: FontWeight.w900,
                      color: Colors.amber.shade800,
                    ),
                  ),
                )
              else
                Icon(
                  Icons.check_circle_rounded,
                  color: Colors.green.shade600,
                  size: 28,
                ),
            ],
          ),
        ),
        if (provider.error != null && _promoCodeController.text.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 8, left: 8),
            child: Text(
              provider.error!,
              style: TextStyle(color: theme.colorScheme.error, fontSize: 13),
            ),
          ),
      ],
    );
  }

  Widget _buildSubscribeButton(
    ThemeData theme,
    SubscriptionProvider provider,
    double finalPrice,
  ) {
    return Container(
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: Colors.amber.withOpacity(0.4),
            blurRadius: 25,
            offset: const Offset(0, 10),
            spreadRadius: -5,
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: provider.isLoading ? null : _startCheckout,
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 20),
          backgroundColor: Colors.amber.shade600,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          elevation: 0,
        ),
        child: provider.isLoading
            ? const SizedBox(
                width: 28,
                height: 28,
                child: CircularProgressIndicator(
                  color: Colors.white,
                  strokeWidth: 3,
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'ATTIVA ORA',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1,
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Icon(Icons.arrow_forward_rounded, size: 24),
                ],
              ),
      ),
    );
  }

  Widget _buildGuaranteeInfo(ThemeData theme, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? Colors.white.withOpacity(0.03) : Colors.grey.shade50,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: theme.colorScheme.outline.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          Icon(Icons.security_rounded, color: Colors.green.shade400, size: 40),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Pagamento Sicuro',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Criptografia a 256bit. Annulla in ogni momento.',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.5),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildComparisonSection(ThemeData theme, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'CONFRONTO PIANI',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            letterSpacing: 1,
            color: theme.colorScheme.onSurface.withOpacity(0.5),
          ),
        ),
        const SizedBox(height: 20),
        _buildComparisonRow(
          theme,
          'Quiz Ministeriali',
          'Limitati',
          'ILLIMITATI',
          true,
          isDark,
        ),
        _buildComparisonRow(
          theme,
          'Traduzione multilingua',
          'No',
          'SÌ (URDU/PUNJABI...)',
          true,
          isDark,
        ),
        _buildComparisonRow(
          theme,
          'Audio Teoria & Quiz',
          'No',
          'SÌ',
          true,
          isDark,
        ),
        _buildComparisonRow(
          theme,
          'Simulazioni Esame',
          '1/giorno',
          'ILLIMITATE',
          true,
          isDark,
        ),
        _buildComparisonRow(
          theme,
          'Statistiche Avanzate',
          'No',
          'SÌ',
          false,
          isDark,
        ),
      ],
    );
  }

  Widget _buildComparisonRow(
    ThemeData theme,
    String title,
    String free,
    String premium,
    bool hasBorder,
    bool isDark,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        border: hasBorder
            ? Border(
                bottom: BorderSide(
                  color: theme.colorScheme.outline.withOpacity(0.05),
                ),
              )
            : null,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            flex: 3,
            child: Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(
            child: Text(
              free,
              style: TextStyle(
                color: theme.colorScheme.onSurface.withOpacity(0.4),
                fontSize: 11,
              ),
              textAlign: TextAlign.right,
            ),
          ),
          Expanded(
            child: Text(
              premium,
              style: TextStyle(
                color: Colors.amber.shade700,
                fontWeight: FontWeight.w900,
                fontSize: 11,
              ),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }
}
