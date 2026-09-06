import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/constants.dart';
import 'auth_service.dart';
import '../models/patient.dart';
import '../models/visit.dart';

class ApiService {
  final AuthService _authService = AuthService();

  Future<Map<String, String>> _getHeaders() async {
    final token = await _authService.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 && body['success'] == true) {
        return body;
      } else {
        throw Exception(body['message'] ?? 'Login failed');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<Patient> getPatientByNfc(String uuid) async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/patients/nfc/$uuid'),
        headers: headers,
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 && body['success'] == true) {
        return Patient.fromJson(body['data']);
      } else {
        throw Exception(body['message'] ?? 'Patient not found');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<Patient> getPatientById(String id) async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/patients/$id'),
        headers: headers,
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 && body['success'] == true) {
        return Patient.fromJson(body['data']);
      } else {
        throw Exception(body['message'] ?? 'Patient not found');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<List<Patient>> getPatients({String? search}) async {
    try {
      final headers = await _getHeaders();
      String url = '${AppConstants.baseUrl}/patients';
      if (search != null && search.isNotEmpty) {
        url += '?search=${Uri.encodeComponent(search)}';
      }
      final response = await http.get(
        Uri.parse(url),
        headers: headers,
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 && body['success'] == true) {
        final List<dynamic> data = body['data'] ?? [];
        return data.map((item) => Patient.fromJson(item)).toList();
      } else {
        throw Exception(body['message'] ?? 'Failed to load patients');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<Patient> createPatient(Map<String, dynamic> data) async {
    try {
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/patients'),
        headers: headers,
        body: jsonEncode(data),
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 201 && body['success'] == true) {
        return Patient.fromJson(body['data']);
      } else {
        throw Exception(body['message'] ?? 'Failed to create patient');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  /// Add a visit to a patient. Returns the updated Patient.
  Future<Patient> addVisit(String patientId, Map<String, dynamic> visitData) async {
    try {
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/patients/$patientId/visits'),
        headers: headers,
        body: jsonEncode(visitData),
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 201 && body['success'] == true) {
        // Backend returns the full updated patient
        return Patient.fromJson(body['data']);
      } else {
        throw Exception(body['message'] ?? 'Failed to add visit');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<List<Visit>> getVisitHistory(String patientId) async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/patients/$patientId/visits'),
        headers: headers,
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 && body['success'] == true) {
        final List<dynamic> data = body['data'] ?? [];
        return data.map((item) => Visit.fromJson(item)).toList();
      } else {
        throw Exception(body['message'] ?? 'Failed to load visit history');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }
}
