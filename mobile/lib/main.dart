import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

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
        if (auth.isLoading) {
          return const MaterialApp(
            home: Scaffold(body: Center(child: CircularProgressIndicator())),
          );
        }

        return MaterialApp(
          title: 'NFC MedCard',
          theme: ThemeData(
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(
              seedColor: AppConstants.primaryColor,
              primary: AppConstants.primaryColor,
              secondary: AppConstants.secondaryColor,
            ),
            textTheme: GoogleFonts.interTextTheme(
              Theme.of(context).textTheme,
            ),
            appBarTheme: const AppBarTheme(
              backgroundColor: AppConstants.primaryColor,
              foregroundColor: Colors.white,
            ),
          ),
          initialRoute: auth.isAuthenticated ? '/home' : '/login',
          onGenerateRoute: (settings) {
            switch (settings.name) {
              case '/login':
                return MaterialPageRoute(builder: (_) => const LoginScreen());
              case '/home':
                return MaterialPageRoute(builder: (_) => const HomeScreen());
              case '/patient_detail':
                final patient = settings.arguments as Patient;
                return MaterialPageRoute(builder: (_) => PatientDetailScreen(patient: patient));
              case '/visit_history':
                final patientId = settings.arguments as String;
                return MaterialPageRoute(builder: (_) => VisitHistoryScreen(patientId: patientId));
              case '/add_visit':
                final patient = settings.arguments as Patient;
                return MaterialPageRoute(builder: (_) => AddVisitScreen(patient: patient));
              case '/search':
                return MaterialPageRoute(builder: (_) => const SearchScreen());
              case '/issue_card':
                return MaterialPageRoute(builder: (_) => const IssueCardScreen());
              case '/qr_scan':
                return MaterialPageRoute(builder: (_) => const QRScannerScreen());
              default:
                return MaterialPageRoute(builder: (_) => const Scaffold(body: Center(child: Text('Route not found'))));
            }
          },
        );
      },
    );
  }
}
