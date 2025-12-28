import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'main_navigation_screen.dart';
import 'admin/admin_dashboard_screen.dart';

/// Schermata che instrada automaticamente l'utente:
/// - Admin → AdminDashboardScreen
/// - Utenti normali → MainNavigationScreen (Quiz, Teoria, etc.)
class RoleBasedHomeScreen extends StatelessWidget {
  const RoleBasedHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    // Se ancora in caricamento, mostra loading
    if (authProvider.isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    // Se admin, mostra Admin Dashboard
    if (authProvider.isAdmin) {
      return const AdminDashboardScreen();
    }

    // Per tutti gli altri utenti (inclusi creator), mostra app normale
    return const MainNavigationScreen();
  }
}

/// Widget per permettere all'admin di passare tra Dashboard e App Quiz
class AdminModeSwitch extends StatefulWidget {
  const AdminModeSwitch({super.key});

  @override
  State<AdminModeSwitch> createState() => _AdminModeSwitchState();
}

class _AdminModeSwitchState extends State<AdminModeSwitch> {
  bool _showAdminDashboard = true;

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    // Solo per admin
    if (!authProvider.isAdmin) {
      return const MainNavigationScreen();
    }

    return Scaffold(
      body: _showAdminDashboard
          ? const AdminDashboardScreen()
          : const MainNavigationScreen(),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          setState(() {
            _showAdminDashboard = !_showAdminDashboard;
          });
        },
        backgroundColor: _showAdminDashboard ? Colors.blue : Colors.deepPurple,
        icon: Icon(
          _showAdminDashboard
              ? Icons.phone_android
              : Icons.admin_panel_settings,
        ),
        label: Text(_showAdminDashboard ? 'App Quiz' : 'Admin Panel'),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}
