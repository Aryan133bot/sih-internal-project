class Doctor {
  final String id;
  final String name;
  final String email;
  final String role;
  final String department;

  Doctor({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.department,
  });

  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'Doctor',
      department: json['department'] ?? '',
    );
  }
}
