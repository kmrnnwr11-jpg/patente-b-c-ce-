import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../services/admin_service.dart';

/// Pannello Admin completo per gestire utenti, abbonamenti, Creator, Promo Codes e statistiche
class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen>
    with SingleTickerProviderStateMixin {
  final AdminService _adminService = AdminService();
  late TabController _tabController;

  Map<String, dynamic> _stats = {};
  List<Map<String, dynamic>> _creators = [];
  List<Map<String, dynamic>> _users = [];
  List<Map<String, dynamic>> _promoCodes = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    _loadData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final stats = await _adminService.getAdminStats();
      final creators = await _adminService.getCreators();

      // Carica utenti da Firestore
      final usersSnapshot = await FirebaseFirestore.instance
          .collection('users')
          .orderBy('createdAt', descending: true)
          .limit(100)
          .get();

      final users = usersSnapshot.docs
          .map((doc) => {'id': doc.id, ...doc.data()})
          .toList();

      // Carica promo codes da Firestore
      final promoSnapshot = await FirebaseFirestore.instance
          .collection('promocodes')
          .orderBy('createdAt', descending: true)
          .get();

      final promoCodes = promoSnapshot.docs
          .map((doc) => {'id': doc.id, ...doc.data()})
          .toList();

      setState(() {
        _stats = stats;
        _creators = creators;
        _users = users;
        _promoCodes = promoCodes;
        _isLoading = false;
        _error = null;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
        _error = e.toString();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? Colors.grey.shade900 : Colors.grey.shade100,
      appBar: AppBar(
        title: const Text(
          'Admin Dashboard',
          style: TextStyle(fontWeight: FontWeight.w900),
        ),
        backgroundColor: Colors.deepPurple.shade700,
        foregroundColor: Colors.white,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white60,
          isScrollable: true,
          tabs: const [
            Tab(icon: Icon(Icons.analytics), text: 'Stats'),
            Tab(icon: Icon(Icons.people), text: 'Utenti'),
            Tab(icon: Icon(Icons.star), text: 'Premium'),
            Tab(icon: Icon(Icons.campaign), text: 'Creator'),
            Tab(icon: Icon(Icons.discount), text: 'Promo'),
          ],
        ),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadData),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
          ? _buildErrorState()
          : TabBarView(
              controller: _tabController,
              children: [
                _buildStatsTab(theme, isDark),
                _buildUsersTab(theme, isDark),
                _buildPremiumTab(theme, isDark),
                _buildCreatorsTab(theme, isDark),
                _buildPromoTab(theme, isDark),
              ],
            ),
    );
  }

  Widget _buildErrorState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 64, color: Colors.red.shade300),
          const SizedBox(height: 16),
          Text(
            'Accesso Negato',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.red.shade700,
            ),
          ),
          const SizedBox(height: 8),
          const Text('Solo gli Admin possono accedere a questa sezione.'),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.arrow_back),
            label: const Text('Torna Indietro'),
          ),
        ],
      ),
    );
  }

  // ============ STATS TAB ============
  Widget _buildStatsTab(ThemeData theme, bool isDark) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('PANORAMICA', style: _sectionStyle(theme)),
          const SizedBox(height: 16),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.5,
            children: [
              _buildStatCard(
                'Utenti Totali',
                '${_users.length}',
                Icons.people,
                Colors.blue,
                isDark,
              ),
              _buildStatCard(
                'Utenti Premium',
                '${_users.where((u) => u['isPremium'] == true).length}',
                Icons.star,
                Colors.amber,
                isDark,
              ),
              _buildStatCard(
                'Creator Attivi',
                '${_creators.where((c) => c['isActive'] == true).length}',
                Icons.campaign,
                Colors.purple,
                isDark,
              ),
              _buildStatCard(
                'Promo Attivi',
                '${_promoCodes.where((p) => p['isActive'] == true).length}',
                Icons.discount,
                Colors.green,
                isDark,
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildInfoCard(
            'Conversion Rate',
            '${_users.isEmpty ? 0 : ((_users.where((u) => u['isPremium'] == true).length / _users.length) * 100).toStringAsFixed(1)}%',
            Icons.trending_up,
            Colors.teal,
            isDark,
          ),
          const SizedBox(height: 12),
          _buildInfoCard(
            'Commissioni da Pagare',
            '€${(_stats['totalPendingPayout'] ?? 0).toStringAsFixed(2)}',
            Icons.account_balance_wallet,
            Colors.orange,
            isDark,
          ),
          const SizedBox(height: 24),

          // Quick Actions
          Text('AZIONI RAPIDE', style: _sectionStyle(theme)),
          const SizedBox(height: 16),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _buildQuickAction(
                'Aggiungi Creator',
                Icons.person_add,
                Colors.purple,
                () => _tabController.animateTo(3),
              ),
              _buildQuickAction(
                'Nuovo Promo',
                Icons.add_card,
                Colors.green,
                () => _tabController.animateTo(4),
              ),
              _buildQuickAction(
                'Esporta Dati',
                Icons.download,
                Colors.blue,
                _exportData,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickAction(
    String label,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(color: color, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }

  void _exportData() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('📊 Funzionalità esportazione in arrivo...'),
      ),
    );
  }

  Widget _buildStatCard(
    String label,
    String value,
    IconData icon,
    Color color,
    bool isDark,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? Colors.grey.shade800 : Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 28),
          const Spacer(),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w900,
              color: color,
            ),
          ),
          Text(
            label,
            style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard(
    String label,
    String value,
    IconData icon,
    Color color,
    bool isDark,
  ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? Colors.grey.shade800 : Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
              ),
              Text(
                value,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ============ USERS TAB ============
  Widget _buildUsersTab(ThemeData theme, bool isDark) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: TextField(
            decoration: InputDecoration(
              hintText: 'Cerca utente per email...',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              filled: true,
              fillColor: isDark ? Colors.grey.shade800 : Colors.white,
            ),
            onChanged: (value) {
              // Implementare ricerca
            },
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              Text(
                '${_users.length} utenti totali',
                style: TextStyle(color: Colors.grey.shade600),
              ),
              const Spacer(),
              TextButton.icon(
                onPressed: _loadData,
                icon: const Icon(Icons.refresh, size: 18),
                label: const Text('Aggiorna'),
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: _users.length,
            itemBuilder: (context, index) =>
                _buildUserCard(_users[index], isDark),
          ),
        ),
      ],
    );
  }

  Widget _buildUserCard(Map<String, dynamic> user, bool isDark) {
    final isPremium = user['isPremium'] ?? false;
    final role = user['role'] ?? 'user';
    final email = user['email'] ?? 'Anonimo';
    final displayName = user['displayName'] ?? 'Utente';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? Colors.grey.shade800 : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isPremium
              ? Colors.amber.withOpacity(0.3)
              : Colors.grey.withOpacity(0.1),
        ),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: isPremium
                ? Colors.amber.withOpacity(0.2)
                : Colors.grey.withOpacity(0.2),
            child: Icon(
              isPremium ? Icons.star : Icons.person,
              color: isPremium ? Colors.amber.shade700 : Colors.grey,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      displayName,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(width: 8),
                    if (role == 'admin')
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text(
                          'ADMIN',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    if (role == 'creator')
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.purple,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text(
                          'CREATOR',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                  ],
                ),
                Text(
                  email,
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                ),
                Text(
                  'UID: ${user['id']?.substring(0, 10) ?? 'N/A'}...',
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.grey.shade400,
                    fontFamily: 'monospace',
                  ),
                ),
              ],
            ),
          ),
          PopupMenuButton<String>(
            onSelected: (value) => _handleUserAction(value, user),
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'copy_uid', child: Text('Copia UID')),
              if (!isPremium)
                const PopupMenuItem(
                  value: 'make_premium',
                  child: Text('Rendi Premium'),
                ),
              if (isPremium)
                const PopupMenuItem(
                  value: 'remove_premium',
                  child: Text(
                    'Rimuovi Premium',
                    style: TextStyle(color: Colors.orange),
                  ),
                ),
              if (role != 'admin')
                const PopupMenuItem(
                  value: 'make_admin',
                  child: Text('Rendi Admin'),
                ),
              if (role != 'creator' && role != 'admin')
                const PopupMenuItem(
                  value: 'make_creator',
                  child: Text('Rendi Creator'),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Future<void> _handleUserAction(
    String action,
    Map<String, dynamic> user,
  ) async {
    final userId = user['id'];

    switch (action) {
      case 'copy_uid':
        Clipboard.setData(ClipboardData(text: userId));
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('✅ UID copiato!')));
        break;
      case 'make_premium':
        await FirebaseFirestore.instance.collection('users').doc(userId).update(
          {'isPremium': true},
        );
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('⭐ Utente ora è Premium!'),
            backgroundColor: Colors.amber,
          ),
        );
        _loadData();
        break;
      case 'remove_premium':
        await FirebaseFirestore.instance.collection('users').doc(userId).update(
          {'isPremium': false},
        );
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Premium rimosso'),
            backgroundColor: Colors.orange,
          ),
        );
        _loadData();
        break;
      case 'make_admin':
        await FirebaseFirestore.instance.collection('users').doc(userId).update(
          {'role': 'admin'},
        );
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('🔐 Utente ora è Admin!'),
            backgroundColor: Colors.red,
          ),
        );
        _loadData();
        break;
      case 'make_creator':
        _showAddCreatorDialog(context, userId);
        break;
    }
  }

  // ============ PREMIUM TAB ============
  Widget _buildPremiumTab(ThemeData theme, bool isDark) {
    final premiumUsers = _users.where((u) => u['isPremium'] == true).toList();

    return Column(
      children: [
        Container(
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.amber.shade600, Colors.orange.shade700],
            ),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            children: [
              const Icon(Icons.star, color: Colors.white, size: 48),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Utenti Premium',
                      style: TextStyle(color: Colors.white, fontSize: 12),
                    ),
                    Text(
                      '${premiumUsers.length}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '${(premiumUsers.length / (_users.isEmpty ? 1 : _users.length) * 100).toStringAsFixed(1)}% del totale',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              Text(
                'Lista abbonati',
                style: TextStyle(
                  color: Colors.grey.shade600,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Spacer(),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Expanded(
          child: premiumUsers.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.star_border,
                        size: 64,
                        color: Colors.grey.shade300,
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Nessun utente premium',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: premiumUsers.length,
                  itemBuilder: (context, index) =>
                      _buildPremiumUserCard(premiumUsers[index], isDark),
                ),
        ),
      ],
    );
  }

  Widget _buildPremiumUserCard(Map<String, dynamic> user, bool isDark) {
    final email = user['email'] ?? 'Anonimo';
    final displayName = user['displayName'] ?? 'Utente';
    final subscriptionId = user['stripeSubscriptionId'];

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? Colors.grey.shade800 : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.amber.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: Colors.amber.withOpacity(0.2),
            child: Icon(Icons.star, color: Colors.amber.shade700, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  displayName,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                Text(
                  email,
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                ),
                if (subscriptionId != null)
                  Text(
                    'Sub: ${subscriptionId.substring(0, 15)}...',
                    style: TextStyle(
                      fontSize: 10,
                      color: Colors.grey.shade400,
                      fontFamily: 'monospace',
                    ),
                  ),
              ],
            ),
          ),
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'remove') {
                _handleUserAction('remove_premium', user);
              } else if (value == 'view') {
                _showUserDetails(user);
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'view', child: Text('Dettagli')),
              const PopupMenuItem(
                value: 'remove',
                child: Text(
                  'Rimuovi Premium',
                  style: TextStyle(color: Colors.red),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showUserDetails(Map<String, dynamic> user) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.6,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Dettagli Utente',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const Divider(height: 32),
              _buildDetailRow('Email', user['email'] ?? 'N/A'),
              _buildDetailRow('Nome', user['displayName'] ?? 'N/A'),
              _buildDetailRow('UID', user['id'] ?? 'N/A'),
              _buildDetailRow('Ruolo', user['role'] ?? 'user'),
              _buildDetailRow(
                'Premium',
                user['isPremium'] == true ? 'Sì' : 'No',
              ),
              _buildDetailRow(
                'Stripe Customer',
                user['stripeCustomerId'] ?? 'N/A',
              ),
              _buildDetailRow(
                'Stripe Subscription',
                user['stripeSubscriptionId'] ?? 'N/A',
              ),
              _buildDetailRow(
                'Promo Usato',
                user['usedPromoCode'] ?? 'Nessuno',
              ),
              _buildDetailRow('Referral Code', user['referralCode'] ?? 'N/A'),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Chiudi'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          SizedBox(
            width: 120,
            child: Text(label, style: TextStyle(color: Colors.grey.shade600)),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  // ============ CREATORS TAB ============
  Widget _buildCreatorsTab(ThemeData theme, bool isDark) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: ElevatedButton.icon(
            onPressed: () => _showAddCreatorDialog(context, null),
            icon: const Icon(Icons.person_add),
            label: const Text('AGGIUNGI CREATOR'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.deepPurple,
              foregroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),
        ),
        Expanded(
          child: _creators.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.person_off,
                        size: 64,
                        color: Colors.grey.shade300,
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Nessun Creator',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: _creators.length,
                  itemBuilder: (context, index) =>
                      _buildCreatorCard(_creators[index], isDark),
                ),
        ),
      ],
    );
  }

  Widget _buildCreatorCard(Map<String, dynamic> creator, bool isDark) {
    final isActive = creator['isActive'] ?? false;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? Colors.grey.shade800 : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isActive
              ? Colors.green.withOpacity(0.3)
              : Colors.red.withOpacity(0.3),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                backgroundColor: isActive
                    ? Colors.green.withOpacity(0.1)
                    : Colors.red.withOpacity(0.1),
                child: Icon(
                  isActive ? Icons.verified : Icons.block,
                  color: isActive ? Colors.green : Colors.red,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      creator['email'] ?? 'N/A',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    Text(
                      'Codice: ${creator['referralCode']}',
                      style: TextStyle(
                        color: Colors.purple.shade700,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              PopupMenuButton<String>(
                onSelected: (value) {
                  if (value == 'copy') {
                    Clipboard.setData(
                      ClipboardData(
                        text:
                            'https://patenteapp.com/ref/${creator['referralCode']}',
                      ),
                    );
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Link copiato!')),
                    );
                  } else if (value == 'revoke') {
                    _revokeCreator(creator['id']);
                  }
                },
                itemBuilder: (context) => [
                  const PopupMenuItem(value: 'copy', child: Text('Copia Link')),
                  if (isActive)
                    const PopupMenuItem(
                      value: 'revoke',
                      child: Text(
                        'Revoca',
                        style: TextStyle(color: Colors.red),
                      ),
                    ),
                ],
              ),
            ],
          ),
          const Divider(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildCreatorStat(
                'Referral',
                '${creator['totalReferrals'] ?? 0}',
              ),
              _buildCreatorStat(
                'Attivi',
                '${creator['activeSubscriptions'] ?? 0}',
              ),
              _buildCreatorStat(
                'Guadagni',
                '€${(creator['totalEarnings'] ?? 0).toStringAsFixed(0)}',
              ),
              _buildCreatorStat(
                'Pending',
                '€${(creator['pendingPayout'] ?? 0).toStringAsFixed(0)}',
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCreatorStat(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        Text(
          label,
          style: TextStyle(fontSize: 10, color: Colors.grey.shade600),
        ),
      ],
    );
  }

  Future<void> _showAddCreatorDialog(
    BuildContext context,
    String? prefilledUserId,
  ) async {
    final userIdController = TextEditingController(text: prefilledUserId ?? '');
    final referralCodeController = TextEditingController();
    final tiktokController = TextEditingController();
    final instagramController = TextEditingController();

    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Aggiungi Nuovo Creator',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 24),
              TextField(
                controller: userIdController,
                decoration: const InputDecoration(
                  labelText: 'User UID (Firebase)',
                  hintText: 'Es. abc123xyz...',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: referralCodeController,
                textCapitalization: TextCapitalization.characters,
                decoration: const InputDecoration(
                  labelText: 'Codice Referral',
                  hintText: 'Es. TIKTOK01',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: tiktokController,
                decoration: const InputDecoration(
                  labelText: 'TikTok Username (opzionale)',
                  hintText: '@username',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: instagramController,
                decoration: const InputDecoration(
                  labelText: 'Instagram Username (opzionale)',
                  hintText: '@username',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () async {
                  if (userIdController.text.isEmpty ||
                      referralCodeController.text.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text(
                          'User UID e Codice Referral sono obbligatori',
                        ),
                        backgroundColor: Colors.red,
                      ),
                    );
                    return;
                  }
                  Navigator.pop(context);
                  try {
                    // Crea creator in Firestore
                    await FirebaseFirestore.instance.collection('creators').add(
                      {
                        'userId': userIdController.text.trim(),
                        'referralCode': referralCodeController.text.trim(),
                        'socialLinks': {
                          if (tiktokController.text.isNotEmpty)
                            'tiktok': tiktokController.text.trim(),
                          if (instagramController.text.isNotEmpty)
                            'instagram': instagramController.text.trim(),
                        },
                        'isActive': true,
                        'totalReferrals': 0,
                        'activeSubscriptions': 0,
                        'totalEarnings': 0,
                        'pendingPayout': 0,
                        'createdAt': FieldValue.serverTimestamp(),
                      },
                    );
                    // Aggiorna ruolo utente
                    await FirebaseFirestore.instance
                        .collection('users')
                        .doc(userIdController.text.trim())
                        .update({'role': 'creator'});
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('✅ Creator aggiunto con successo!'),
                          backgroundColor: Colors.green,
                        ),
                      );
                      _loadData();
                    }
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('❌ Errore: $e'),
                          backgroundColor: Colors.red,
                        ),
                      );
                    }
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepPurple,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'PROMUOVI A CREATOR',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _revokeCreator(String creatorId) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Revoca Creator'),
        content: const Text('Sei sicuro di voler revocare questo Creator?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Annulla'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Revoca', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await FirebaseFirestore.instance
          .collection('creators')
          .doc(creatorId)
          .update({'isActive': false});
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Creator revocato'),
            backgroundColor: Colors.green,
          ),
        );
        _loadData();
      }
    }
  }

  // ============ PROMO TAB ============
  Widget _buildPromoTab(ThemeData theme, bool isDark) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('CREA NUOVO CODICE', style: _sectionStyle(theme)),
          const SizedBox(height: 16),
          _buildPromoCodeForm(isDark),
          const SizedBox(height: 32),
          Text(
            'CODICI ESISTENTI (${_promoCodes.length})',
            style: _sectionStyle(theme),
          ),
          const SizedBox(height: 16),
          ..._promoCodes.map((promo) => _buildPromoCard(promo, isDark)),
        ],
      ),
    );
  }

  Widget _buildPromoCard(Map<String, dynamic> promo, bool isDark) {
    final isActive = promo['isActive'] ?? false;
    final code = promo['code'] ?? 'N/A';
    final discountType = promo['discountType'] ?? 'percentage';
    final discountValue = promo['discountValue'] ?? 0;
    final usedCount = promo['usedCount'] ?? 0;
    final maxUses = promo['maxUses'];

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? Colors.grey.shade800 : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isActive
              ? Colors.green.withOpacity(0.3)
              : Colors.red.withOpacity(0.3),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: isActive
                  ? Colors.green.withOpacity(0.1)
                  : Colors.red.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              code,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: isActive ? Colors.green : Colors.red,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${discountType == 'percentage' ? '$discountValue%' : '€$discountValue'} OFF',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                Text(
                  'Usato: $usedCount${maxUses != null ? '/$maxUses' : ''} volte',
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                ),
              ],
            ),
          ),
          Switch(
            value: isActive,
            onChanged: (value) async {
              await FirebaseFirestore.instance
                  .collection('promocodes')
                  .doc(promo['id'])
                  .update({'isActive': value});
              _loadData();
            },
          ),
        ],
      ),
    );
  }

  Widget _buildPromoCodeForm(bool isDark) {
    final codeController = TextEditingController();
    final valueController = TextEditingController();
    final descController = TextEditingController();
    final maxUsesController = TextEditingController();
    String discountType = 'percentage';

    return StatefulBuilder(
      builder: (context, setFormState) => Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isDark ? Colors.grey.shade800 : Colors.white,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: codeController,
              textCapitalization: TextCapitalization.characters,
              decoration: const InputDecoration(
                labelText: 'Codice Promo',
                hintText: 'Es. ESTATE2024',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: valueController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Valore Sconto',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                DropdownButton<String>(
                  value: discountType,
                  items: const [
                    DropdownMenuItem(value: 'percentage', child: Text('%')),
                    DropdownMenuItem(value: 'fixed', child: Text('€')),
                  ],
                  onChanged: (value) =>
                      setFormState(() => discountType = value!),
                ),
              ],
            ),
            const SizedBox(height: 16),
            TextField(
              controller: maxUsesController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Max Utilizzi (opzionale)',
                hintText: 'Es. 100',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: descController,
              decoration: const InputDecoration(
                labelText: 'Descrizione (opzionale)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () async {
                if (codeController.text.isEmpty ||
                    valueController.text.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Codice e Valore sono obbligatori'),
                      backgroundColor: Colors.red,
                    ),
                  );
                  return;
                }
                try {
                  await FirebaseFirestore.instance
                      .collection('promocodes')
                      .add({
                        'code': codeController.text.trim().toUpperCase(),
                        'discountType': discountType,
                        'discountValue': double.parse(valueController.text),
                        'maxUses': maxUsesController.text.isNotEmpty
                            ? int.parse(maxUsesController.text)
                            : null,
                        'description': descController.text.trim(),
                        'isActive': true,
                        'usedCount': 0,
                        'createdAt': FieldValue.serverTimestamp(),
                      });
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('✅ Promo Code creato!'),
                        backgroundColor: Colors.green,
                      ),
                    );
                    codeController.clear();
                    valueController.clear();
                    descController.clear();
                    maxUsesController.clear();
                    _loadData();
                  }
                } catch (e) {
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('❌ Errore: $e'),
                        backgroundColor: Colors.red,
                      ),
                    );
                  }
                }
              },
              icon: const Icon(Icons.add),
              label: const Text('CREA PROMO CODE'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepPurple,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  TextStyle _sectionStyle(ThemeData theme) {
    return TextStyle(
      fontSize: 12,
      fontWeight: FontWeight.w800,
      letterSpacing: 1,
      color: theme.colorScheme.onSurface.withOpacity(0.4),
    );
  }
}
