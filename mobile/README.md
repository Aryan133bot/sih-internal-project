# NFC MedCard Mobile App

## Setup

1. Make sure you have Flutter installed.
2. Run `flutter pub get` to install dependencies.
3. Configure the `baseUrl` in `lib/utils/constants.dart` if needed (default points to Android emulator `http://10.0.2.2:5000/api`).
4. Run the app on an Android device with NFC capabilities (or an emulator for UI testing) using `flutter run`.

## Notes
- To test NFC, a real device is required.
- The app uses Provider for state management.
