import 'package:flutter/material.dart';
import '../models/visit.dart';
import '../services/api_service.dart';
import '../utils/helpers.dart';
import '../widgets/loading_overlay.dart';

class VisitHistoryScreen extends StatefulWidget {
  final String patientId;

  const VisitHistoryScreen({super.key, required this.patientId});

  @override
  State<VisitHistoryScreen> createState() => _VisitHistoryScreenState();
}

class _VisitHistoryScreenState extends State<VisitHistoryScreen> {
  final ApiService _apiService = ApiService();
  bool _isLoading = true;
  List<Visit> _visits = [];
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchVisits();
  }

  Future<void> _fetchVisits() async {
    try {
      final visits = await _apiService.getVisitHistory(widget.patientId);
      if (mounted) {
        setState(() {
          _visits = visits;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Visit History'),
      ),
      body: LoadingOverlay(
        isLoading: _isLoading,
        child: _error != null
            ? Center(child: Text('Error: $_error'))
            : _visits.isEmpty && !_isLoading
                ? const Center(child: Text('No previous visits found.'))
                : ListView.builder(
                    padding: const EdgeInsets.all(16.0),
                    itemCount: _visits.length,
                    itemBuilder: (context, index) {
                      final visit = _visits[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 16.0),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    Helpers.formatDate(visit.date),
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                  Chip(
                                    label: Text(visit.department),
                                    backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
                                  ),
                                ],
                              ),
                              const Divider(),
                              const SizedBox(height: 8),
                              _buildDetailRow('Doctor', 'Dr. ${visit.doctorName}'),
                              const SizedBox(height: 8),
                              _buildDetailRow('Diagnosis', visit.diagnosis),
                              const SizedBox(height: 8),
                              const Text('Prescription:', style: TextStyle(fontWeight: FontWeight.bold)),
                              ...visit.prescription.map((p) => Padding(
                                padding: const EdgeInsets.only(left: 8.0, top: 4.0),
                                child: Text('• $p'),
                              )),
                              if (visit.notes.isNotEmpty) ...[
                                const SizedBox(height: 8),
                                _buildDetailRow('Notes', visit.notes),
                              ]
                            ],
                          ),
                        ),
                      );
                    },
                  ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 80,
          child: Text(
            '$label:',
            style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
          ),
        ),
        Expanded(
          child: Text(value),
        ),
      ],
    );
  }
}
