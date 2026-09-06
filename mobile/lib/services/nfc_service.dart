import 'package:nfc_manager/nfc_manager.dart';

class NfcService {
  Future<bool> isNfcAvailable() async {
    return await NfcManager.instance.isAvailable();
  }

  Future<String?> readNfc() async {
    try {
      bool isAvailable = await isNfcAvailable();
      if (!isAvailable) {
        throw Exception('NFC is not available on this device');
      }

      String? uuid;
      await NfcManager.instance.startSession(onDiscovered: (NfcTag tag) async {
        final ndef = Ndef.from(tag);
        if (ndef != null && ndef.cachedMessage != null) {
          for (var record in ndef.cachedMessage!.records) {
            if (record.typeNameFormat == NdefTypeNameFormat.nfcWellknown) {
              final payload = String.fromCharCodes(record.payload);
              // Skip language code prefix in NDEF Text Record (typically 3 bytes)
              if (payload.length > 3) {
                uuid = payload.substring(3);
              }
            }
          }
        }
        NfcManager.instance.stopSession();
      });

      // Wait a reasonable amount of time for a scan, or implement stream/callback
      await Future.delayed(const Duration(seconds: 5));
      return uuid;
    } catch (e) {
      NfcManager.instance.stopSession(errorMessage: e.toString());
      throw Exception(e.toString());
    }
  }

  Future<void> writeNfc(String uuid) async {
    try {
      bool isAvailable = await isNfcAvailable();
      if (!isAvailable) {
        throw Exception('NFC is not available');
      }

      await NfcManager.instance.startSession(onDiscovered: (NfcTag tag) async {
        final ndef = Ndef.from(tag);
        if (ndef == null || !ndef.isWritable) {
          NfcManager.instance.stopSession(errorMessage: 'Tag is not ndef writable');
          return;
        }

        NdefMessage message = NdefMessage([
          NdefRecord.createText(uuid),
        ]);

        try {
          await ndef.write(message);
          NfcManager.instance.stopSession();
        } catch (e) {
          NfcManager.instance.stopSession(errorMessage: 'Failed to write tag');
        }
      });
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  void stopSession() {
    NfcManager.instance.stopSession();
  }
}
