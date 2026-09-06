const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  adminEmail: String,
  phone: String
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
