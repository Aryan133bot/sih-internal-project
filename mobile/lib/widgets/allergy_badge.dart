import 'package:flutter/material.dart';
import '../utils/constants.dart';

class AllergyBadge extends StatelessWidget {
  final String allergy;

  const AllergyBadge({super.key, required this.allergy});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(right: 8, bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppConstants.warningColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppConstants.warningColor),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.warning_amber_rounded, size: 16, color: AppConstants.warningColor),
          const SizedBox(width: 4),
          Text(
            allergy,
            style: const TextStyle(
              color: AppConstants.warningColor,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
