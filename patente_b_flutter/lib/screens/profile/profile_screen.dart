import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../providers/auth_provider.dart';

/// Schermata Profilo Utente con foto, impostazioni e gestione account
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final TextEditingController _nameController = TextEditingController();
  bool _isLoading = false;
  bool _isEditing = false;
  String? _localImagePath;
  XFile? _pickedImage;

  @override
  void initState() {
    super.initState();
    final authProvider = context.read<AuthProvider>();
    _nameController.text = authProvider.appUser?.displayName ?? '';
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 512,
      maxHeight: 512,
      imageQuality: 80,
    );

    if (image != null) {
      setState(() {
        _pickedImage = image;
        _localImagePath = image.path;
      });
    }
  }

  Future<void> _saveProfile() async {
    setState(() => _isLoading = true);

    try {
      final authProvider = context.read<AuthProvider>();
      final userId = authProvider.firebaseUser?.uid;

      if (userId == null) {
        throw Exception('User not logged in');
      }

      String? photoUrl = authProvider.appUser?.photoUrl;

      // Upload nuova foto se selezionata
      if (_pickedImage != null) {
        final storageRef = FirebaseStorage.instance
            .ref()
            .child('profile_photos')
            .child('$userId.jpg');

        if (kIsWeb) {
          final bytes = await _pickedImage!.readAsBytes();
          await storageRef.putData(
            bytes,
            SettableMetadata(contentType: 'image/jpeg'),
          );
        } else {
          await storageRef.putFile(File(_pickedImage!.path));
        }

        photoUrl = await storageRef.getDownloadURL();
      }

      // Aggiorna Firestore
      await FirebaseFirestore.instance.collection('users').doc(userId).update({
        'displayName': _nameController.text.trim(),
        'photoUrl': photoUrl,
      });

      // Aggiorna Firebase Auth profile
      await authProvider.firebaseUser?.updateDisplayName(
        _nameController.text.trim(),
      );
      if (photoUrl != null) {
        await authProvider.firebaseUser?.updatePhotoURL(photoUrl);
      }

      setState(() {
        _isEditing = false;
        _pickedImage = null;
        _localImagePath = null;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Profilo aggiornato!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('❌ Errore: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Consumer<AuthProvider>(
      builder: (context, authProvider, _) {
        final user = authProvider.appUser;
        final firebaseUser = authProvider.firebaseUser;

        return Scaffold(
          backgroundColor: isDark ? Colors.grey.shade900 : Colors.grey.shade100,
          appBar: AppBar(
            title: const Text(
              'Il Mio Profilo',
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
            actions: [
              if (!_isEditing)
                IconButton(
                  icon: const Icon(Icons.edit_rounded),
                  onPressed: () => setState(() => _isEditing = true),
                )
              else
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () {
                    setState(() {
                      _isEditing = false;
                      _pickedImage = null;
                      _localImagePath = null;
                      _nameController.text = user?.displayName ?? '';
                    });
                  },
                ),
            ],
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                // Avatar Section
                _buildAvatarSection(
                  user?.photoUrl,
                  firebaseUser?.email,
                  isDark,
                ),
                const SizedBox(height: 32),

                // Profile Info Section
                _buildProfileInfoCard(user, firebaseUser, isDark),
                const SizedBox(height: 24),

                // Account Status Section
                _buildAccountStatusCard(user, isDark),
                const SizedBox(height: 24),

                // Actions Section
                _buildActionsCard(authProvider, isDark),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildAvatarSection(String? photoUrl, String? email, bool isDark) {
    return Column(
      children: [
        Stack(
          children: [
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [Colors.blue.shade400, Colors.purple.shade600],
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.purple.withOpacity(0.3),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Padding(
                padding: const EdgeInsets.all(4),
                child: CircleAvatar(
                  radius: 56,
                  backgroundColor: isDark ? Colors.grey.shade800 : Colors.white,
                  backgroundImage: _getProfileImage(photoUrl),
                  child: _getProfileImage(photoUrl) == null
                      ? Icon(
                          Icons.person,
                          size: 48,
                          color: Colors.grey.shade400,
                        )
                      : null,
                ),
              ),
            ),
            if (_isEditing)
              Positioned(
                bottom: 0,
                right: 0,
                child: GestureDetector(
                  onTap: _pickImage,
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.purple.shade600,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                    child: const Icon(
                      Icons.camera_alt,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 16),
        Text(
          _nameController.text.isEmpty ? 'Utente' : _nameController.text,
          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        Text(
          email ?? 'Nessuna email',
          style: TextStyle(color: Colors.grey.shade600, fontSize: 14),
        ),
      ],
    );
  }

  ImageProvider? _getProfileImage(String? photoUrl) {
    if (_localImagePath != null && !kIsWeb) {
      return FileImage(File(_localImagePath!));
    } else if (photoUrl != null && photoUrl.isNotEmpty) {
      return NetworkImage(photoUrl);
    }
    return null;
  }

  Widget _buildProfileInfoCard(
    dynamic user,
    dynamic firebaseUser,
    bool isDark,
  ) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isDark ? Colors.grey.shade800 : Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.person_outline, color: Colors.blue.shade600),
              const SizedBox(width: 8),
              const Text(
                'INFORMAZIONI PERSONALI',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Nome
          _buildInfoRow(
            'Nome',
            _isEditing
                ? TextField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                    ),
                  )
                : Text(
                    user?.displayName ?? 'Non impostato',
                    style: const TextStyle(fontSize: 16),
                  ),
          ),
          const Divider(height: 24),

          // Email
          _buildInfoRow(
            'Email',
            Text(
              firebaseUser?.email ?? 'Anonimo',
              style: const TextStyle(fontSize: 16),
            ),
          ),
          const Divider(height: 24),

          // UID (per debug/admin)
          _buildInfoRow(
            'User ID',
            Text(
              firebaseUser?.uid ?? 'N/A',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey.shade500,
                fontFamily: 'monospace',
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),

          if (_isEditing) ...[
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _saveProfile,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green.shade600,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: _isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Text(
                        'SALVA MODIFICHE',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, Widget value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 80,
          child: Text(
            label,
            style: TextStyle(color: Colors.grey.shade600, fontSize: 14),
          ),
        ),
        Expanded(child: value),
      ],
    );
  }

  Widget _buildAccountStatusCard(dynamic user, bool isDark) {
    final isPremium = user?.isPremium ?? false;
    final role = user?.role ?? 'user';

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isDark ? Colors.grey.shade800 : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isPremium
              ? Colors.amber.withOpacity(0.3)
              : Colors.grey.withOpacity(0.1),
          width: 2,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                isPremium ? Icons.star_rounded : Icons.account_circle_outlined,
                color: isPremium ? Colors.amber : Colors.grey,
              ),
              const SizedBox(width: 8),
              const Text(
                'STATO ACCOUNT',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isPremium ? 'PREMIUM' : 'FREE',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: isPremium ? Colors.amber.shade700 : Colors.grey,
                    ),
                  ),
                  Text(
                    'Ruolo: ${role.toUpperCase()}',
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: isPremium
                      ? Colors.amber.withOpacity(0.1)
                      : Colors.grey.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Icon(
                  isPremium ? Icons.verified : Icons.lock_outline,
                  color: isPremium ? Colors.amber.shade700 : Colors.grey,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActionsCard(AuthProvider authProvider, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isDark ? Colors.grey.shade800 : Colors.white,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        children: [
          _buildActionButton(
            'Abbonamenti',
            'Gestisci il tuo piano',
            Icons.diamond_outlined,
            Colors.purple,
            () => Navigator.pushNamed(context, '/subscription'),
          ),
          const SizedBox(height: 12),
          _buildActionButton(
            'Impostazioni',
            'Lingua, notifiche, tema',
            Icons.settings_outlined,
            Colors.blue,
            () => Navigator.pushNamed(context, '/settings'),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () async {
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Logout'),
                    content: const Text('Sei sicuro di voler uscire?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context, false),
                        child: const Text('Annulla'),
                      ),
                      TextButton(
                        onPressed: () => Navigator.pop(context, true),
                        child: const Text(
                          'Esci',
                          style: TextStyle(color: Colors.red),
                        ),
                      ),
                    ],
                  ),
                );

                if (confirm == true) {
                  await authProvider.signOut();
                  if (mounted) {
                    Navigator.of(
                      context,
                    ).pushNamedAndRemoveUntil('/', (route) => false);
                  }
                }
              },
              icon: const Icon(Icons.logout, color: Colors.red),
              label: const Text(
                'Esci dall\'account',
                style: TextStyle(color: Colors.red),
              ),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Colors.red),
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
    String title,
    String subtitle,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color),
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
                    style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios,
              size: 16,
              color: Colors.grey.shade400,
            ),
          ],
        ),
      ),
    );
  }
}
