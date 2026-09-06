class Visit {
  final String id;
  final String doctorId;
  final String doctorName;
  final String department;
  final DateTime date;
  final String diagnosis;
  final List<String> prescription;
  final String notes;

  Visit({
    required this.id,
    required this.doctorId,
    required this.doctorName,
    required this.department,
    required this.date,
    required this.diagnosis,
    required this.prescription,
    required this.notes,
  });

  factory Visit.fromJson(Map<String, dynamic> json) {
    // Handle 'doctor' field: can be a populated object or a plain string ID
    String docId = '';
    String docName = 'Unknown Doctor';

    final doctor = json['doctor'];
    if (doctor is Map<String, dynamic>) {
      docId = doctor['_id']?.toString() ?? '';
      docName = doctor['name']?.toString() ?? 'Unknown Doctor';
    } else if (doctor is String) {
      docId = doctor;
    }

    return Visit(
      id: json['_id']?.toString() ?? '',
      doctorId: docId,
      doctorName: docName,
      department: json['department']?.toString() ?? '',
      date: json['date'] != null ? DateTime.tryParse(json['date'].toString()) ?? DateTime.now() : DateTime.now(),
      diagnosis: json['diagnosis']?.toString() ?? '',
      prescription: List<String>.from(json['prescription'] ?? []),
      notes: json['notes']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'department': department,
      'diagnosis': diagnosis,
      'prescription': prescription,
      'notes': notes,
    };
  }
}
