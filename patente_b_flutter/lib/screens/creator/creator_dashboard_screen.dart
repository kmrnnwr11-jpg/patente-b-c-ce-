import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../providers/auth_provider.dart';
import '../../services/creator_service.dart';
import '../../models/creator_model.dart';
import '../../models/referral_model.dart';
import 'become_creator_screen.dart';

/// Dashboard per i Creator con statistiche e strumenti di condivisione
class CreatorDashboardScreen extends StatefulWidget {
  const CreatorDashboardScreen({super.key});

  @override
  State<CreatorDashboardScreen> createState() => _CreatorDashboardScreenState();
}

class _CreatorDashboardScreenState extends State<CreatorDashboardScreen> {
  final CreatorService _creatorService = CreatorService();
  Creator? _creator;
  List<Referral> _referrals = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCreatorData();
  }

  Future<void> _loadCreatorData() async {
    final authProvider = context.read<AuthProvider>();
    if (authProvider.firebaseUser != null) {
      final creator = await _creatorService.getCreatorByUserId(
        authProvider.firebaseUser!.uid,
      );

      if (creator != null) {
        final referrals = await _creatorService.getCreatorReferrals(creator.id);
        setState(() {
          _creator = creator;
          _referrals = referrals;
          _isLoading = false;
        });
      } else {
        setState(() => _isLoading = false);
        if (mounted) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const BecomeCreatorScreen()),
          );
        }
      }
    }
  }

  void _copyLink() {
    if (_creator != null) {
      Clipboard.setData(ClipboardData(text: _creator!.referralLink));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Link copiato negli appunti!'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  void _shareLink() {
    if (_creator != null) {
      Share.share(
        'Preparati per l\'esame della patente con questa app fantastica! '
        'Usa il mio link per uno sconto: ${_creator!.referralLink}',
        subject: 'Patente B Quiz - Invito',
      );
    }
  }

  void _showQRCode() {
    if (_creator == null) return;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Il tuo QR Code',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Fai scansionare questo codice ai tuoi amici',
              style: TextStyle(color: Colors.grey.shade600),
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 20,
                  ),
                ],
              ),
              child: QrImageView(
                data: _creator!.referralLink,
                version: QrVersions.auto,
                size: 200,
                backgroundColor: Colors.white,
                errorCorrectionLevel: QrErrorCorrectLevel.M,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              _creator!.referralCode,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.purple.shade700,
                letterSpacing: 4,
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Future<void> _requestPayout() async {
    if (_creator == null || !_creator!.canRequestPayout) return;

    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Richiedi pagamento'),
        content: Text(
          'Vuoi richiedere il pagamento di €${_creator!.pendingPayout.toStringAsFixed(2)}?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Annulla'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
            ),
            child: const Text('Conferma'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      final success = await _creatorService.requestPayout(_creator!.id);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              success
                  ? 'Richiesta di pagamento inviata!'
                  : 'Errore nella richiesta',
            ),
            backgroundColor: success ? Colors.green : Colors.red,
          ),
        );
        if (success) _loadCreatorData();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (_creator == null) {
      return const BecomeCreatorScreen();
    }

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text(
          'Dashboard Promoter',
          style: TextStyle(fontWeight: FontWeight.w900),
        ),
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
          // Sfondo con gradienti (Coerente con SubscriptionPlansScreen)
          Positioned(
            top: -100,
            left: -50,
            child: _buildBlurCircle(Colors.purple.withOpacity(0.15), 300),
          ),
          Positioned(
            bottom: -50,
            right: -50,
            child: _buildBlurCircle(Colors.blue.withOpacity(0.1), 250),
          ),

          RefreshIndicator(
            onRefresh: _loadCreatorData,
            color: Colors.purple,
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(24, 120, 24, 40),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Card Principale (Premium Look)
                  _buildMainCard(theme, isDark),
                  const SizedBox(height: 32),

                  // Statistiche Rapide
                  _buildStatsGrid(theme, isDark),
                  const SizedBox(height: 32),

                  // Guadagni (Vibrant Card)
                  _buildEarningsCard(theme, isDark),
                  const SizedBox(height: 32),

                  // Strumenti Condivisione (Modern Layout)
                  _buildShareTools(theme, isDark),
                  const SizedBox(height: 40),

                  // Lista Referral (Clean List)
                  _buildReferralsList(theme, isDark),
                ],
              ),
            ),
          ),
        ],
      ),
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

  Widget _buildMainCard(ThemeData theme, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(32),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.purple.shade600, Colors.blue.shade700],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.purple.withOpacity(0.3),
            blurRadius: 30,
            offset: const Offset(0, 15),
          ),
        ],
      ),
      child: Column(
        children: [
          const Icon(
            Icons.verified_user_rounded,
            color: Colors.white,
            size: 56,
          ),
          const SizedBox(height: 20),
          const Text(
            'PROMOTER VERIFICATO',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w900,
              letterSpacing: 2,
              color: Colors.white70,
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Il tuo codice referral',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.15),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withOpacity(0.2)),
            ),
            child: Text(
              _creator!.referralCode,
              style: const TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w900,
                color: Colors.white,
                letterSpacing: 6,
              ),
            ),
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildIconButton(Icons.copy_rounded, 'Copia', _copyLink),
              const SizedBox(width: 20),
              _buildIconButton(Icons.share_rounded, 'Condividi', _shareLink),
              const SizedBox(width: 20),
              _buildIconButton(Icons.qr_code_2_rounded, 'QR Code', _showQRCode),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildIconButton(IconData icon, String label, VoidCallback onTap) {
    return Column(
      children: [
        InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 10,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildStatsGrid(ThemeData theme, bool isDark) {
    final activeReferrals = _referrals
        .where((r) => r.status == ReferralStatus.active)
        .length;

    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            theme,
            'TOTAL REFERRALS',
            '${_creator!.totalReferrals}',
            Icons.people_alt_rounded,
            Colors.blue.shade600,
            isDark,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildStatCard(
            theme,
            'ACTIVE USERS',
            '$activeReferrals',
            Icons.check_circle_rounded,
            Colors.green.shade600,
            isDark,
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(
    ThemeData theme,
    String label,
    String value,
    IconData icon,
    Color color,
    bool isDark,
  ) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isDark ? Colors.white.withOpacity(0.05) : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: color.withOpacity(0.2)),
        boxShadow: [
          if (!isDark)
            BoxShadow(
              color: color.withOpacity(0.05),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 16),
          Text(
            value,
            style: theme.textTheme.headlineLarge?.copyWith(
              fontWeight: FontWeight.w900,
              color: theme.colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              letterSpacing: 1,
              color: theme.colorScheme.onSurface.withOpacity(0.4),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEarningsCard(ThemeData theme, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: isDark ? Colors.grey.shade900 : Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: theme.colorScheme.outline.withOpacity(0.05)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 30,
            offset: const Offset(0, 15),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'GUADAGNI & PAYOUT',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1,
                  color: theme.colorScheme.onSurface.withOpacity(0.4),
                ),
              ),
              Icon(
                Icons.account_balance_wallet_rounded,
                color: Colors.green.shade600,
                size: 20,
              ),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildEarningItem(
                theme,
                'Da Incassare',
                '€${_creator!.pendingPayout.toStringAsFixed(2)}',
                Colors.orange.shade700,
              ),
              _buildEarningItem(
                theme,
                'Totale Guadagni',
                '€${_creator!.totalEarnings.toStringAsFixed(2)}',
                Colors.green.shade700,
              ),
            ],
          ),
          const SizedBox(height: 32),
          const Divider(),
          const SizedBox(height: 24),
          if (_creator!.canRequestPayout)
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _requestPayout,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green.shade600,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'PRELEVA FONDI',
                  style: TextStyle(
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1,
                  ),
                ),
              ),
            )
          else
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.onSurface.withOpacity(0.03),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.info_outline_rounded,
                    color: theme.colorScheme.onSurface.withOpacity(0.4),
                    size: 20,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Raggiungi €50.00 per richiedere il payout',
                      style: TextStyle(
                        fontSize: 12,
                        color: theme.colorScheme.onSurface.withOpacity(0.5),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildEarningItem(
    ThemeData theme,
    String label,
    String value,
    Color color,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w900,
            color: color,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label.toUpperCase(),
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            color: theme.colorScheme.onSurface.withOpacity(0.4),
          ),
        ),
      ],
    );
  }

  Widget _buildShareTools(ThemeData theme, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'STRUMENTI DI CONDIVISIONE',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            letterSpacing: 1,
            color: theme.colorScheme.onSurface.withOpacity(0.4),
          ),
        ),
        const SizedBox(height: 20),
        _buildShareOption(
          theme,
          'Copia Link',
          'Condividi il tuo link personale ovunque.',
          Icons.link_rounded,
          Colors.blue,
          _copyLink,
          isDark,
        ),
        const SizedBox(height: 12),
        _buildShareOption(
          theme,
          'Mostra QR Code',
          'Incontra i tuoi amici e fagli scansionare il codice.',
          Icons.qr_code_scanner_rounded,
          Colors.purple,
          _showQRCode,
          isDark,
        ),
      ],
    );
  }

  Widget _buildShareOption(
    ThemeData theme,
    String title,
    String subtitle,
    IconData icon,
    Color color,
    VoidCallback onTap,
    bool isDark,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isDark ? Colors.white.withOpacity(0.03) : Colors.grey.shade50,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: theme.colorScheme.outline.withOpacity(0.05),
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: TextStyle(
                      color: theme.colorScheme.onSurface.withOpacity(0.5),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios_rounded,
              color: theme.colorScheme.onSurface.withOpacity(0.2),
              size: 16,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReferralsList(ThemeData theme, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'LISTA REFERRAL RECENTI',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            letterSpacing: 1,
            color: theme.colorScheme.onSurface.withOpacity(0.4),
          ),
        ),
        const SizedBox(height: 20),
        if (_referrals.isEmpty)
          _buildEmptyReferrals(theme, isDark)
        else
          ..._referrals.map((r) => _buildReferralItem(theme, r, isDark)),
      ],
    );
  }

  Widget _buildEmptyReferrals(ThemeData theme, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(40),
      decoration: BoxDecoration(
        color: isDark ? Colors.white.withOpacity(0.03) : Colors.grey.shade50,
        borderRadius: BorderRadius.circular(32),
      ),
      child: Column(
        children: [
          Icon(
            Icons.person_add_rounded,
            size: 48,
            color: theme.colorScheme.onSurface.withOpacity(0.1),
          ),
          const SizedBox(height: 16),
          Text(
            'Inizia a condividere',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.onSurface.withOpacity(0.5),
            ),
          ),
          Text(
            'Non hai ancora nessun referral registrato.',
            style: TextStyle(
              fontSize: 12,
              color: theme.colorScheme.onSurface.withOpacity(0.3),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildReferralItem(ThemeData theme, Referral referral, bool isDark) {
    final statusColor = referral.isActive ? Colors.green : Colors.orange;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? Colors.white.withOpacity(0.04) : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: theme.colorScheme.outline.withOpacity(0.05)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: statusColor.withOpacity(0.1),
            child: Icon(
              referral.isActive
                  ? Icons.check_rounded
                  : Icons.access_time_rounded,
              color: statusColor,
              size: 20,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  referral.statusText.toUpperCase(),
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.5,
                    color: statusColor,
                  ),
                ),
                Text(
                  'ID: ${referral.userId.substring(0, 8)}...',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                Text(
                  'Dalla data: ${_formatDate(referral.dateReferred)}',
                  style: TextStyle(
                    fontSize: 11,
                    color: theme.colorScheme.onSurface.withOpacity(0.4),
                  ),
                ),
              ],
            ),
          ),
          if (referral.isEarning)
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '+€${referral.monthlyCommission.toStringAsFixed(2)}',
                  style: TextStyle(
                    fontWeight: FontWeight.w900,
                    color: Colors.green.shade600,
                    fontSize: 16,
                  ),
                ),
                Text(
                  'Comm. Mensile',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.onSurface.withOpacity(0.3),
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}
