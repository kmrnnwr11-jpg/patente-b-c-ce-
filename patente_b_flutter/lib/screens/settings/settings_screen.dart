import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../models/translation.dart';
import '../../services/stats_service.dart';
import '../../services/bookmark_service.dart';

/// Settings screen with app preferences
class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  AppLanguage _selectedLanguage = AppLanguage.italian;
  bool _soundEnabled = true;
  bool _notificationsEnabled = true;
  bool _autoAdvance = true;
  bool _darkMode = false;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _selectedLanguage = AppLanguage.fromCode(
        prefs.getString('language') ?? 'it',
      );
      _soundEnabled = prefs.getBool('soundEnabled') ?? true;
      _notificationsEnabled = prefs.getBool('notificationsEnabled') ?? true;
      _autoAdvance = prefs.getBool('autoAdvance') ?? true;
      _darkMode = prefs.getBool('darkMode') ?? false;
    });
  }

  Future<void> _saveSetting(String key, dynamic value) async {
    final prefs = await SharedPreferences.getInstance();
    if (value is bool) {
      await prefs.setBool(key, value);
    } else if (value is String) {
      await prefs.setString(key, value);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF5FB894), Color(0xFF4AA9D0), Color(0xFF3B9ED9)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                    ),
                    const Expanded(
                      child: Text(
                        'Impostazioni',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(width: 48),
                  ],
                ),
              ),

              // Settings list
              Expanded(
                child: Container(
                  margin: const EdgeInsets.all(16),
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: ListView(
                    padding: const EdgeInsets.all(12),
                    children: [
                      // Language section
                      _buildSectionHeader('🌐', 'Lingua'),
                      _buildLanguageSelector(),
                      const Divider(height: 32),

                      // Preferences section
                      _buildSectionHeader('⚙️', 'Preferenze'),
                      _buildSwitchTile(
                        'Suoni',
                        'Abilita effetti sonori',
                        Icons.volume_up_outlined,
                        _soundEnabled,
                        (value) {
                          setState(() => _soundEnabled = value);
                          _saveSetting('soundEnabled', value);
                        },
                      ),
                      _buildSwitchTile(
                        'Notifiche',
                        'Promemoria giornalieri',
                        Icons.notifications_outlined,
                        _notificationsEnabled,
                        (value) {
                          setState(() => _notificationsEnabled = value);
                          _saveSetting('notificationsEnabled', value);
                        },
                      ),
                      _buildSwitchTile(
                        'Auto-avanzamento',
                        'Passa alla prossima domanda automaticamente',
                        Icons.skip_next_outlined,
                        _autoAdvance,
                        (value) {
                          setState(() => _autoAdvance = value);
                          _saveSetting('autoAdvance', value);
                        },
                      ),
                      const Divider(height: 32),

                      // Appearance section
                      _buildSectionHeader('🎨', 'Aspetto'),
                      _buildSwitchTile(
                        'Tema Scuro',
                        'Attiva modalità notturna',
                        Icons.dark_mode_outlined,
                        _darkMode,
                        (value) {
                          setState(() => _darkMode = value);
                          _saveSetting('darkMode', value);
                        },
                      ),
                      const Divider(height: 32),

                      // Data section
                      _buildSectionHeader('💾', 'Dati'),
                      _buildActionTile(
                        'Esporta Dati',
                        'Salva i tuoi progressi',
                        Icons.download_outlined,
                        () => _showExportDialog(),
                      ),
                      _buildActionTile(
                        'Cancella Cache',
                        'Libera spazio di archiviazione',
                        Icons.cleaning_services_outlined,
                        () => _showClearCacheDialog(),
                      ),
                      _buildActionTile(
                        'Reset Progressi',
                        'Ricomincia da zero',
                        Icons.refresh_outlined,
                        () => _showResetDialog(),
                        isDestructive: true,
                      ),
                      const Divider(height: 32),

                      // About section
                      _buildSectionHeader('ℹ️', 'Info'),
                      _buildInfoTile('Versione', '1.0.0'),
                      _buildInfoTile('Build', 'Flutter'),

                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String emoji, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12, top: 8),
      child: Row(
        children: [
          Text(emoji, style: const TextStyle(fontSize: 20)),
          const SizedBox(width: 8),
          Text(
            title,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildLanguageSelector() {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: AppLanguage.values.map((lang) {
          final isSelected = _selectedLanguage == lang;
          return ListTile(
            onTap: () {
              setState(() => _selectedLanguage = lang);
              _saveSetting('language', lang.code);
            },
            leading: Text(lang.flag, style: const TextStyle(fontSize: 24)),
            title: Text(lang.name),
            trailing: isSelected
                ? const Icon(Icons.check_circle, color: Color(0xFF4AA9D0))
                : null,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            tileColor: isSelected
                ? const Color(0xFF4AA9D0).withValues(alpha: 0.1)
                : null,
          );
        }).toList(),
      ),
    );
  }

  Widget _buildSwitchTile(
    String title,
    String subtitle,
    IconData icon,
    bool value,
    ValueChanged<bool> onChanged,
  ) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey[600]),
      title: Text(title),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 12)),
      trailing: Switch(
        value: value,
        onChanged: onChanged,
        activeColor: const Color(0xFF4AA9D0),
      ),
    );
  }

  Widget _buildActionTile(
    String title,
    String subtitle,
    IconData icon,
    VoidCallback onTap, {
    bool isDestructive = false,
  }) {
    return ListTile(
      leading: Icon(icon, color: isDestructive ? Colors.red : Colors.grey[600]),
      title: Text(
        title,
        style: TextStyle(color: isDestructive ? Colors.red : null),
      ),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 12)),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }

  Widget _buildInfoTile(String label, String value) {
    return ListTile(
      title: Text(label),
      trailing: Text(value, style: TextStyle(color: Colors.grey[600])),
    );
  }

  void _showExportDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Esporta Dati'),
        content: const Text('I tuoi dati verranno esportati in formato JSON.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annulla'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text('Dati esportati!')));
            },
            child: const Text('Esporta'),
          ),
        ],
      ),
    );
  }

  void _showClearCacheDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancella Cache'),
        content: const Text(
          'Questo cancellerà i dati temporanei. I tuoi progressi non verranno persi.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annulla'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Cache cancellata!')),
              );
            },
            child: const Text('Cancella'),
          ),
        ],
      ),
    );
  }

  void _showResetDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Reset Progressi'),
        content: const Text(
          '⚠️ ATTENZIONE: Questa azione cancellerà TUTTI i tuoi progressi, statistiche e achievement. Non può essere annullata!',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annulla'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);

              // Reset all data
              final statsService = StatsService();
              final bookmarkService = BookmarkService();
              await statsService.reset();
              await bookmarkService.clearAll();

              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Tutti i progressi sono stati cancellati'),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            },
            child: const Text('Reset', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}
