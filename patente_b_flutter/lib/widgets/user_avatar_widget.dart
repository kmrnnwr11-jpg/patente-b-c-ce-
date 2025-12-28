import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../screens/profile/profile_screen.dart';

/// Widget avatar cliccabile da inserire nell'AppBar o Header
class UserAvatarWidget extends StatelessWidget {
  final double size;
  final bool showBorder;

  const UserAvatarWidget({super.key, this.size = 40, this.showBorder = true});

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, _) {
        final user = authProvider.appUser;
        final firebaseUser = authProvider.firebaseUser;
        final photoUrl = user?.photoUrl ?? firebaseUser?.photoURL;
        final displayName =
            user?.displayName ?? firebaseUser?.displayName ?? 'U';

        return GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const ProfileScreen()),
            );
          },
          child: Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: showBorder
                  ? LinearGradient(
                      colors: [Colors.blue.shade400, Colors.purple.shade600],
                    )
                  : null,
              boxShadow: [
                BoxShadow(
                  color: Colors.purple.withOpacity(0.2),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Padding(
              padding: EdgeInsets.all(showBorder ? 2 : 0),
              child: CircleAvatar(
                radius: size / 2 - 2,
                backgroundColor: Colors.grey.shade200,
                backgroundImage: photoUrl != null && photoUrl.isNotEmpty
                    ? NetworkImage(photoUrl)
                    : null,
                child: photoUrl == null || photoUrl.isEmpty
                    ? Text(
                        displayName.isNotEmpty
                            ? displayName[0].toUpperCase()
                            : 'U',
                        style: TextStyle(
                          fontSize: size * 0.4,
                          fontWeight: FontWeight.bold,
                          color: Colors.purple.shade700,
                        ),
                      )
                    : null,
              ),
            ),
          ),
        );
      },
    );
  }
}

/// Widget avatar più grande per la dashboard con nome
class UserProfileHeader extends StatelessWidget {
  const UserProfileHeader({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Consumer<AuthProvider>(
      builder: (context, authProvider, _) {
        final user = authProvider.appUser;
        final firebaseUser = authProvider.firebaseUser;
        final displayName =
            user?.displayName ?? firebaseUser?.displayName ?? 'Utente';
        final isPremium = user?.isPremium ?? false;

        return GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const ProfileScreen()),
            );
          },
          child: Row(
            children: [
              const UserAvatarWidget(size: 48),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          'Ciao, $displayName',
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                        if (isPremium) ...[
                          const SizedBox(width: 6),
                          Icon(
                            Icons.verified,
                            color: Colors.amber.shade700,
                            size: 18,
                          ),
                        ],
                      ],
                    ),
                    Text(
                      isPremium ? 'Account Premium' : 'Account Free',
                      style: TextStyle(
                        fontSize: 12,
                        color: isPremium
                            ? Colors.amber.shade700
                            : Colors.grey.shade600,
                      ),
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
        );
      },
    );
  }
}
