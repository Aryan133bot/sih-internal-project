import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'providers/auth_provider.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/patient_detail_screen.dart';
import 'screens/visit_history_screen.dart';
import 'screens/add_visit_screen.dart';
import 'screens/search_screen.dart';
import 'screens/issue_card_screen.dart';
import 'screens/qr_scanner_screen.dart';
import 'utils/constants.dart';
import 'models/patient.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()..checkAuth()),
      ],
      child: const NfcMedCardApp(),
    ),
  );
}

class NfcMedCardApp extends StatelessWidget {
  const NfcMedCardApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, _) {
        Widget homeWidget;
        if (auth.isLoading) {
          homeWidget = const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        } else if (auth.isAuthenticated) {
          homeWidget = const HomeScreen();
        } else {
          homeWidget = const LoginScreen();
        }

        return MaterialApp(
          title: 'NFC MedCard',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(
              seedColor: AppConstants.primaryColor,
              primary: AppConstants.primaryColor,
              secondary: AppConstants.secondaryColor,
            ),
            appBarTheme: const AppBarTheme(
              backgroundColor: AppConstants.primaryColor,
              foregroundColor: Colors.white,
            ),
          ),
          home: homeWidget,
          routes: {
            '/login': (_) => const LoginScreen(),
            '/home': (_) => const HomeScreen(),
            '/search': (_) => const SearchScreen(),
            '/issue_card': (_) => const IssueCardScreen(),
            '/qr_scan': (_) => const QRScannerScreen(),
          },
          onGenerateRoute: (settings) {
            switch (settings.name) {
              case '/patient_detail':
                final patient = settings.arguments as Patient;
                return MaterialPageRoute(
                    builder: (_) =>
                        PatientDetailScreen(patient: patient));
              case '/visit_history':
                final patientId = settings.arguments as String;
                return MaterialPageRoute(
                    builder: (_) =>
                        VisitHistoryScreen(patientId: patientId));
              case '/add_visit':
                final patient = settings.arguments as Patient;
                return MaterialPageRoute(
                    builder: (_) => AddVisitScreen(patient: patient));
              default:
                return null;
            }
          },
        );
      },
    );
  }
}
