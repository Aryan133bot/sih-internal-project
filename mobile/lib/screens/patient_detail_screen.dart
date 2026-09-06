import 'package:flutter/material.dart';
import '../models/patient.dart';
import '../widgets/info_card.dart';
import '../widgets/allergy_badge.dart';

class PatientDetailScreen extends StatelessWidget {
  final Patient patient;

  const PatientDetailScreen({super.key, required this.patient});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Patient Record'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () {
              Navigator.pushNamed(
                context, 
                '/visit_history', 
                arguments: patient.id,
              );
            },
            tooltip: 'Visit History',
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header Card
            Card(
              elevation: 4,
              color: Theme.of(context).primaryColor,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 45,
                      backgroundColor: Colors.white,
                      backgroundImage: patient.photoUrl.isNotEmpty
                          ? NetworkImage(patient.photoUrl)
                          : null,
                      child: patient.photoUrl.isEmpty
                          ? Text(
                              patient.name.isNotEmpty ? patient.name[0].toUpperCase() : '?',
                              style: TextStyle(
                                fontSize: 32,
                                color: Theme.of(context).primaryColor,
                                fontWeight: FontWeight.bold,
                              ),
                            )
                          : null,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      patient.name,
                      style: const TextStyle(
                        fontSize: 24,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    if (patient.abhaId.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 4.0),
                        child: Text(
                          'ABHA: ${patient.abhaId}',
                          style: const TextStyle(color: Colors.white70, fontSize: 14),
                        ),
                      ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildHeaderBadge('${patient.age} Yrs'),
                        const SizedBox(width: 8),
                        _buildHeaderBadge(patient.gender),
                        const SizedBox(width: 8),
                        _buildHeaderBadge(
                          'Blood: ${patient.bloodGroup}',
                          color: Colors.redAccent,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Allergies (CRITICAL)
            if (patient.allergies.isNotEmpty)
              InfoCard(
                title: 'CRITICAL: ALLERGIES',
                icon: Icons.warning_rounded,
                color: Colors.red,
                content: Wrap(
                  children: patient.allergies
                      .map((a) => AllergyBadge(allergy: a))
                      .toList(),
                ),
              ),

            // Medical Conditions
            InfoCard(
              title: 'Chronic Conditions',
              icon: Icons.favorite,
              content: patient.chronicConditions.isEmpty
                  ? const Text('None reported')
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: patient.chronicConditions
                          .map((c) => Padding(
                                padding: const EdgeInsets.only(bottom: 4.0),
                                child: Row(
                                  children: [
                                    const Icon(Icons.circle, size: 8),
                                    const SizedBox(width: 8),
                                    Text(c, style: const TextStyle(fontSize: 16)),
                                  ],
                                ),
                              ))
                          .toList(),
                    ),
            ),

            // Medications
            InfoCard(
              title: 'Current Medications',
              icon: Icons.medication,
              content: patient.currentMedications.isEmpty
                  ? const Text('None reported')
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: patient.currentMedications
                          .map((m) => Padding(
                                padding: const EdgeInsets.only(bottom: 4.0),
                                child: Row(
                                  children: [
                                    const Icon(Icons.medication_liquid, size: 16),
                                    const SizedBox(width: 8),
                                    Text(m, style: const TextStyle(fontSize: 16)),
                                  ],
                                ),
                              ))
                          .toList(),
                    ),
            ),

            // Contact Info
            InfoCard(
              title: 'Contact Information',
              icon: Icons.contact_phone,
              content: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.phone),
                    title: Text(patient.phone),
                    dense: true,
                    contentPadding: EdgeInsets.zero,
                  ),
                  ListTile(
                    leading: const Icon(Icons.emergency),
                    title: const Text('Emergency Contact'),
                    subtitle: Text(patient.emergencyContact),
                    dense: true,
                    contentPadding: EdgeInsets.zero,
                  ),
                  ListTile(
                    leading: const Icon(Icons.health_and_safety),
                    title: const Text('Insurance'),
                    subtitle: Text(patient.insuranceInfo),
                    dense: true,
                    contentPadding: EdgeInsets.zero,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 80), // Padding for FAB
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.pushNamed(context, '/add_visit', arguments: patient);
        },
        icon: const Icon(Icons.add),
        label: const Text('Add Visit'),
      ),
    );
  }

  Widget _buildHeaderBadge(String text, {Color color = Colors.white24}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        text,
        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
      ),
    );
  }
}
