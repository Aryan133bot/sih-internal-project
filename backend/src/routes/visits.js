const express = require('express');
const Patient = require('../models/Patient');
const { protect } = require('../middleware/auth');

// Merge parameters to access the patient :id from the parent router
const router = express.Router({ mergeParams: true });

// Add a visit record
router.post('/:id/visits', protect, async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const newVisit = {
      doctor: req.user._id,
      department: req.user.department || req.body.department,
      diagnosis: req.body.diagnosis,
      prescription: req.body.prescription,
      notes: req.body.notes
    };

    patient.visitHistory.push(newVisit);
    await patient.save();

    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
});

// Get all visits for a patient
router.get('/:id/visits', protect, async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('visitHistory.doctor', 'name department');
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.status(200).json({ success: true, count: patient.visitHistory.length, data: patient.visitHistory });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
