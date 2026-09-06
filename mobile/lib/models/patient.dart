class Patient {
  final String id;
  final String nfcUuid;
  final String name;
  final int age;
  final String gender;
  final String bloodGroup;
  final List<String> allergies;
  final List<String> chronicConditions;
  final List<String> currentMedications;
  final String phone;
  final String emergencyContact;
  final String address;
  final String insuranceProvider;
  final String insurancePolicyNo;
  final String photoUrl;
  final String abhaId;

  Patient({
    required this.id,
    required this.nfcUuid,
    required this.name,
    required this.age,
    required this.gender,
    required this.bloodGroup,
    required this.allergies,
    required this.chronicConditions,
    required this.currentMedications,
    required this.phone,
    required this.emergencyContact,
    required this.address,
    required this.insuranceProvider,
    required this.insurancePolicyNo,
    required this.photoUrl,
    required this.abhaId,
  });

  factory Patient.fromJson(Map<String, dynamic> json) {
    final pInfo = json['personalInfo'] ?? {};
    final medInfo = json['medicalInfo'] ?? {};

    // Parse currentMedications — backend sends list of objects {name, dosage, frequency}
    // Convert to readable strings for display
    List<String> meds = [];
    if (medInfo['currentMedications'] != null) {
      for (var med in medInfo['currentMedications']) {
        if (med is Map) {
          String medStr = med['name'] ?? '';
          if (med['dosage'] != null && med['dosage'].toString().isNotEmpty) {
            medStr += ' ${med['dosage']}';
          }
          if (med['frequency'] != null && med['frequency'].toString().isNotEmpty) {
            medStr += ' (${med['frequency']})';
          }
          meds.add(medStr);
        } else if (med is String) {
          meds.add(med);
        }
      }
    }

    return Patient(
      id: json['_id']?.toString() ?? '',
      nfcUuid: json['nfcUuid']?.toString() ?? '',
      name: pInfo['name']?.toString() ?? '',
      age: (pInfo['age'] is int) ? pInfo['age'] : int.tryParse(pInfo['age']?.toString() ?? '0') ?? 0,
      gender: pInfo['gender']?.toString() ?? '',
      bloodGroup: pInfo['bloodGroup']?.toString() ?? '',
      allergies: List<String>.from(medInfo['allergies'] ?? []),
      chronicConditions: List<String>.from(medInfo['chronicConditions'] ?? []),
      currentMedications: meds,
      phone: pInfo['phone']?.toString() ?? '',
      emergencyContact: pInfo['emergencyContact']?.toString() ?? '',
      address: pInfo['address']?.toString() ?? '',
      insuranceProvider: medInfo['insuranceProvider']?.toString() ?? '',
      insurancePolicyNo: medInfo['insurancePolicyNo']?.toString() ?? '',
      photoUrl: pInfo['photoUrl']?.toString() ?? '',
      abhaId: pInfo['abhaId']?.toString() ?? '',
    );
  }

  /// Human-readable insurance info for display
  String get insuranceInfo {
    if (insuranceProvider.isEmpty && insurancePolicyNo.isEmpty) return 'None';
    return '$insuranceProvider${insurancePolicyNo.isNotEmpty ? ' ($insurancePolicyNo)' : ''}';
  }

  Map<String, dynamic> toJson() {
    return {
      'personalInfo': {
        'name': name,
        'age': age,
        'gender': gender,
        'bloodGroup': bloodGroup,
        'phone': phone,
        'emergencyContact': emergencyContact,
        'address': address,
      },
      'medicalInfo': {
        'allergies': allergies,
        'chronicConditions': chronicConditions,
        'currentMedications': currentMedications,
        'insuranceProvider': insuranceProvider,
        'insurancePolicyNo': insurancePolicyNo,
      },
    };
  }
}
