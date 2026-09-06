import 'package:flutter/material.dart';
import '../models/patient.dart';
import '../services/api_service.dart';
import '../widgets/loading_overlay.dart';

class AddVisitScreen extends StatefulWidget {
  final Patient patient;

  const AddVisitScreen({super.key, required this.patient});

  @override
  State<AddVisitScreen> createState() => _AddVisitScreenState();
}

class _AddVisitScreenState extends State<AddVisitScreen> {
  final _formKey = GlobalKey<FormState>();
  final ApiService _apiService = ApiService();
  bool _isLoading = false;

  final _departmentController = TextEditingController();
  final _diagnosisController = TextEditingController();
  final _notesController = TextEditingController();
  final List<TextEditingController> _prescriptionControllers = [TextEditingController()];

  void _addPrescriptionField() {
    setState(() {
      _prescriptionControllers.add(TextEditingController());
    });
  }

  void _removePrescriptionField(int index) {
    setState(() {
      _prescriptionControllers.removeAt(index);
    });
  }

  Future<void> _submit() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);

      List<String> prescriptions = _prescriptionControllers
          .map((c) => c.text.trim())
          .where((t) => t.isNotEmpty)
          .toList();

      final visitData = {
        'department': _departmentController.text,
        'diagnosis': _diagnosisController.text,
        'notes': _notesController.text,
        'prescription': prescriptions,
      };

      try {
        await _apiService.addVisit(widget.patient.id, visitData);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Visit added successfully')),
          );
          Navigator.pop(context);
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(e.toString())),
          );
          setState(() => _isLoading = false);
        }
      }
    }
  }

  @override
  void dispose() {
    _departmentController.dispose();
    _diagnosisController.dispose();
    _notesController.dispose();
    for (var c in _prescriptionControllers) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Visit'),
      ),
      body: LoadingOverlay(
        isLoading: _isLoading,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Patient: ${widget.patient.name}',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 24),
                
                TextFormField(
                  controller: _departmentController,
                  decoration: const InputDecoration(
                    labelText: 'Department',
                    border: OutlineInputBorder(),
                  ),
                  validator: (v) => v!.isEmpty ? 'Required' : null,
                ),
                const SizedBox(height: 16),
                
                TextFormField(
                  controller: _diagnosisController,
                  decoration: const InputDecoration(
                    labelText: 'Diagnosis',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 2,
                  validator: (v) => v!.isEmpty ? 'Required' : null,
                ),
                const SizedBox(height: 24),
                
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Prescription', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    IconButton(
                      icon: const Icon(Icons.add_circle),
                      color: Theme.of(context).primaryColor,
                      onPressed: _addPrescriptionField,
                    ),
                  ],
                ),
                ...List.generate(_prescriptionControllers.length, (index) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _prescriptionControllers[index],
                            decoration: InputDecoration(
                              labelText: 'Medication ${index + 1}',
                              border: const OutlineInputBorder(),
                            ),
                          ),
                        ),
                        if (_prescriptionControllers.length > 1)
                          IconButton(
                            icon: const Icon(Icons.remove_circle, color: Colors.red),
                            onPressed: () => _removePrescriptionField(index),
                          ),
                      ],
                    ),
                  );
                }),
                const SizedBox(height: 16),
                
                TextFormField(
                  controller: _notesController,
                  decoration: const InputDecoration(
                    labelText: 'Doctor\'s Notes (Optional)',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 32),
                
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: _submit,
                    child: const Text('SAVE VISIT', style: TextStyle(fontSize: 16)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
