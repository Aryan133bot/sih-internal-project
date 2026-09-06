const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Patient = require('../models/Patient');
const ScanLog = require('../models/ScanLog');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get patient by NFC UUID
router.get('/nfc/:uuid', protect, async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ nfcUuid: req.params.uuid }).populate('visitHistory.doctor', 'name department');
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Create scan log
    await ScanLog.create({
      patientId: patient._id,
      doctorId: req.user._id,
      nfcUuid: req.params.uuid,
      hospitalId: req.user.hospitalId
    });

    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
});

// List all patients (with optional search)
router.get('/', protect, async (req, res, next) => {
  try {
    let query = {};
    if (req.query.search) {
      query = { 'personalInfo.name': { $regex: req.query.search, $options: 'i' } };
    }
    const patients = await Patient.find(query);
    res.status(200).json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    next(error);
  }
});

// Get single patient by ID
router.get('/:id', protect, async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('visitHistory.doctor', 'name department');
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
});

// Create patient (admin only)
router.post('/', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const patientData = { ...req.body, nfcUuid: uuidv4() };
    const patient = await Patient.create(patientData);
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
});

// Update patient
router.put('/:id', protect, async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
});

// Delete patient (admin only)
router.delete('/:id', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
