import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:nfc_manager/nfc_manager.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../services/nfc_service.dart';
import '../widgets/nfc_scan_animation.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService _apiService = ApiService();
  final NfcService _nfcService = NfcService();
  
  bool _isScanning = false;
  String _statusMessage = 'Tap patient\'s NFC card to scan';

  @override
  void initState() {
    super.initState();
    _checkNfc();
  }

  Future<void> _checkNfc() async {
    try {
      bool available = await _nfcService.isNfcAvailable();
      if (!available && mounted) {
        setState(() {
          _statusMessage = 'NFC is not available on this device.\nPlease use Search.';
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _statusMessage = 'NFC is not available on this device.\nPlease use Search.';
        });
      }
    }
  }

  Future<void> _startNfcScan() async {
    setState(() {
      _isScanning = true;
      _statusMessage = 'Scanning... Please hold card near device';
    });

    try {
      String? uuid;
      await NfcManager.instance.startSession(onDiscovered: (NfcTag tag) async {
        final ndef = Ndef.from(tag);
        if (ndef != null && ndef.cachedMessage != null) {
          for (var record in ndef.cachedMessage!.records) {
            if (record.typeNameFormat == NdefTypeNameFormat.nfcWellknown) {
              final payload = String.fromCharCodes(record.payload);
              if (payload.length > 3) {
                 uuid = payload.substring(3);
              }
            }
          }
        }
        NfcManager.instance.stopSession();
        
        if (uuid != null && mounted) {
          _fetchPatientData(uuid!);
        } else {
          setState(() {
            _isScanning = false;
            _statusMessage = 'Invalid or empty NFC card. Try again.';
          });
        }
      });
    } catch (e) {
      if (mounted) {
        setState(() {
          _isScanning = false;
          _statusMessage = 'Scan error: ${e.toString()}';
        });
      }
    }
  }

  Future<void> _fetchPatientData(String uuid) async {
    setState(() {
      _statusMessage = 'Loading patient data...';
    });

    try {
      final patient = await _apiService.getPatientByNfc(uuid);
      if (mounted) {
        setState(() {
          _isScanning = false;
          _statusMessage = 'Tap patient\'s NFC card to scan';
        });
        Navigator.pushNamed(context, '/patient_detail', arguments: patient);
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isScanning = false;
          _statusMessage = 'Patient not found or error loading data.';
        });
      }
    }
  }

  @override
  void dispose() {
    _nfcService.stopSession();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('NFC MedCard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              authProvider.logout();
              Navigator.pushReplacementNamed(context, '/login');
            },
          )
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            UserAccountsDrawerHeader(
              accountName: Text(user?['name'] ?? 'Doctor'),
              accountEmail: Text(user?['email'] ?? ''),
              currentAccountPicture: const CircleAvatar(
                backgroundColor: Colors.white,
                child: Icon(Icons.medical_services, size: 30),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.search),
              title: const Text('Search Patient'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/search');
              },
            ),
            if (authProvider.isAdmin)
              ListTile(
                leading: const Icon(Icons.credit_card),
                title: const Text('Issue NFC Card'),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, '/issue_card');
                },
              ),
          ],
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Welcome, Dr. ${user?['name']?.split(' ')[0] ?? ''}',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 48),
            GestureDetector(
              onTap: _isScanning ? null : _startNfcScan,
              child: _isScanning
                  ? const NfcScanAnimation()
                  : Icon(
                      Icons.nfc,
                      size: 150,
                      color: Theme.of(context).primaryColor,
                    ),
            ),
            const SizedBox(height: 32),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32.0),
              child: Text(
                _statusMessage,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 16),
              ),
            ),
            const SizedBox(height: 32),
            if (!_isScanning)
              Column(
                children: [
                  ElevatedButton.icon(
                    onPressed: _startNfcScan,
                    icon: const Icon(Icons.contactless),
                    label: const Text('Scan NFC Card'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      minimumSize: const Size(200, 50),
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () async {
                      final uuid = await Navigator.pushNamed(context, '/qr_scan');
                      if (uuid != null && uuid is String) {
                        _fetchPatientData(uuid);
                      }
                    },
                    icon: const Icon(Icons.qr_code_scanner),
                    label: const Text('Scan QR Code'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      backgroundColor: Theme.of(context).secondaryHeaderColor,
                      minimumSize: const Size(200, 50),
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}
