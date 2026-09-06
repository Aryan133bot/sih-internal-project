import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  final AuthService _authService = AuthService();

  bool _isAuthenticated = false;
  bool _isLoading = true;
  Map<String, dynamic>? _user;

  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  Map<String, dynamic>? get user => _user;
  bool get isAdmin => _user?['role'] == 'admin';

  Future<void> checkAuth() async {
    final token = await _authService.getToken();
    if (token != null) {
      _user = await _authService.getUser();
      _isAuthenticated = true;
    } else {
      _isAuthenticated = false;
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    try {
      _isLoading = true;
      notifyListeners();

      final response = await _apiService.login(email, password);
      
      await _authService.saveToken(response['token']);
      await _authService.saveUser(response['user']);
      
      _user = response['user'];
      _isAuthenticated = true;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      throw Exception(e.toString());
    }
  }

  Future<void> logout() async {
    await _authService.deleteToken();
    _isAuthenticated = false;
    _user = null;
    notifyListeners();
  }
}
