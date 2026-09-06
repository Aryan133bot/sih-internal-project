const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  nfcUuid: { type: String, unique: true, index: true },
  personalInfo: {
    name: { type: String, required: true },
    age: Number,
    gender: String,
    bloodGroup: String,
    phone: String,
    emergencyContact: String,
    address: String,
    aadhaarLast4: String,
    abhaId: String,
    photoUrl: String
  },
  medicalInfo: {
    allergies: [String],
    chronicConditions: [String],
    currentMedications: [{
      name: String,
      dosage: String,
      frequency: String
    }],
    insuranceProvider: String,
    insurancePolicyNo: String
  },
  visitHistory: [{
    date: { type: Date, default: Date.now },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    department: String,
    diagnosis: String,
    prescription: [String],
    notes: String
  }],
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  cardIssuedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
