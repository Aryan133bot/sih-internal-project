const mongoose = require('mongoose');

const scanLogSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  nfcUuid: { type: String, required: true },
  scannedAt: { type: Date, default: Date.now },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }
});

module.exports = mongoose.model('ScanLog', scanLogSchema);
