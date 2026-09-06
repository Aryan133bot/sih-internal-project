import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart'; // Add uuid to pubspec if used for generating fake ids, or use a simple string for now.
import '../services/nfc_service.dart';

class IssueCardScreen extends StatefulWidget {
  const IssueCardScreen({super.key});

  @override
  State<IssueCardScreen> createState() => _IssueCardScreenState();
}

class _IssueCardScreenState extends State<IssueCardScreen> {
  final _patientIdController = TextEditingController();
  final NfcService _nfcService = NfcService();
  bool _isWriting = false;
  String _statusMessage = 'Enter Patient ID to link to a new NFC card';

  Future<void> _writeNfc() async {
    if (_patientIdController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid Patient UUID')),
      );
      return;
    }

    setState(() {
      _isWriting = true;
      _statusMessage = 'Hold empty NFC card near device to write...';
    });

    try {
      await _nfcService.writeNfc(_patientIdController.text);
      if (mounted) {
        setState(() {
          _isWriting = false;
          _statusMessage = 'Successfully written Patient ID to card!';
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('NFC Card configured successfully')),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isWriting = false;
          _statusMessage = 'Failed to write: ${e.toString()}';
        });
      }
    }
  }

  @override
  void dispose() {
    _nfcService.stopSession();
    _patientIdController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Issue NFC Card'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.nfc, size: 100, color: Colors.grey),
            const SizedBox(height: 24),
            TextFormField(
              controller: _patientIdController,
              decoration: const InputDecoration(
                labelText: 'Patient UUID (from database)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 32),
            Text(
              _statusMessage,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                color: _statusMessage.contains('Success') ? Colors.green : Colors.black,
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton.icon(
                onPressed: _isWriting ? null : _writeNfc,
                icon: _isWriting 
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Icon(Icons.save_alt),
                label: Text(_isWriting ? 'Writing...' : 'Write to NFC Card'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
