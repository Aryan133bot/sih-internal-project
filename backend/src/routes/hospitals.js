const express = require('express');
const Hospital = require('../models/Hospital');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({ success: true, data: hospital });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json({ success: true, count: hospitals.length, data: hospitals });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
