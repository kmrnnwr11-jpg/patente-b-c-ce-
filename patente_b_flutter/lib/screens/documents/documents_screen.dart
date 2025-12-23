import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../theme/app_theme.dart';

class DocumentsScreen extends StatefulWidget {
  const DocumentsScreen({super.key});

  @override
  State<DocumentsScreen> createState() => _DocumentsScreenState();
}

class _DocumentsScreenState extends State<DocumentsScreen> {
  DateTime? _foglioRosaExpiry;
  bool _isLoading = true;

  final List<Map<String, dynamic>> _guides = [
    {'date': DateTime.now().add(const Duration(days: 2)), 'type': 'Guida Notturna', 'instructor': 'Mario'},
    {'date': DateTime.now().add(const Duration(days: 5)), 'type': 'Guida Autostrada', 'instructor': 'Mario'},
  ];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final prefs = await SharedPreferences.getInstance();
    final expiryIso = prefs.getString('foglio_rosa_expiry');
    if (expiryIso != null) {
      setState(() {
        _foglioRosaExpiry = DateTime.parse(expiryIso);
        _isLoading = false;
      });
    } else {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _setExpiryDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _foglioRosaExpiry ?? DateTime.now().add(const Duration(days: 180)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365 * 2)),
    );
    if (picked != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('foglio_rosa_expiry', picked.toIso8601String());
      setState(() {
        _foglioRosaExpiry = picked;
      });
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }

  String _formatDateTime(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}\n${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Documenti'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildFoglioRosaCard(),
                  const SizedBox(height: 24),
                  _buildGuidesSection(),
                  const SizedBox(height: 24),
                  _buildArchiveSection(),
                ],
              ),
            ),
    );
  }

  Widget _buildFoglioRosaCard() {
    final daysLeft = _foglioRosaExpiry != null
        ? _foglioRosaExpiry!.difference(DateTime.now()).inDays
        : 0;
    
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Foglio Rosa',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                Icon(Icons.drive_eta, color: Theme.of(context).primaryColor),
              ],
            ),
            const SizedBox(height: 16),
            if (_foglioRosaExpiry == null)
              Center(
                child: ElevatedButton.icon(
                  onPressed: _setExpiryDate,
                  icon: const Icon(Icons.calendar_today),
                  label: const Text('Imposta Scadenza'),
                ),
              )
            else
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Scade il: ${_formatDate(_foglioRosaExpiry!)}',
                    style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color),
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: daysLeft > 0 ? (daysLeft / 180).clamp(0.0, 1.0) : 0,
                      minHeight: 10,
                      backgroundColor: Theme.of(context).dividerColor,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        daysLeft < 30 ? AppTheme.accentRed : AppTheme.accentGreen,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '$daysLeft giorni rimanenti',
                    style: TextStyle(
                      color: daysLeft < 30 ? AppTheme.accentRed : AppTheme.accentGreen,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: _setExpiryDate,
                      child: const Text('Modifica'),
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildGuidesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Guide Prenotate',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            IconButton(
              icon: const Icon(Icons.add_circle_outline),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Funzionalità di prenotazione in arrivo')),
                );
              },
            ),
          ],
        ),
        const SizedBox(height: 8),
        ..._guides.map((guide) => Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
              child: Icon(Icons.access_time_filled, color: Theme.of(context).primaryColor),
            ),
            title: Text(guide['type']),
            subtitle: Text('Istruttore: ${guide['instructor']}'),
            trailing: Text(
              _formatDateTime(guide['date']),
              textAlign: TextAlign.center,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        )),
      ],
    );
  }

  Widget _buildArchiveSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Archivio Documenti',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Card(
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Icons.picture_as_pdf, color: Colors.orange),
                title: const Text('Certificato Medico.pdf'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {},
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.picture_as_pdf, color: Colors.orange),
                title: const Text('Bollettini Pagati.pdf'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {},
              ),
            ],
          ),
        ),
      ],
    );
  }
}
