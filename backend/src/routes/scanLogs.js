const express = require('express');
const ScanLog = require('../models/ScanLog');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all scan logs (admin only)
router.get('/', protect, requireRole('admin'), async (req, res, next) => {
  try {
    let query = {};
    
    if (req.query.startDate && req.query.endDate) {
      query.scannedAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const logs = await ScanLog.find(query)
      .populate('patientId', 'personalInfo.name nfcUuid')
      .populate('doctorId', 'name department')
      .sort({ scannedAt: -1 });

    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
