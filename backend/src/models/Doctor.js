const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['doctor', 'admin'], default: 'doctor' },
  department: String,
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  licenseNo: String
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
