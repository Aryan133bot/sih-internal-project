require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();
    
    const hospitalCount = await Hospital.countDocuments();
    if (hospitalCount > 0) {
      console.log('Data already exists, skipping seed...');
      mongoose.disconnect();
      return;
    }

    console.log('Seeding data...');

    // Create Hospital
    const hospital = await Hospital.create({
      name: 'City Central Hospital',
      address: '123 Medical Drive, Health City',
      adminEmail: 'admin@hospital.com',
      phone: '123-456-7890'
    });

    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);
    const doctorPasswordHash = await bcrypt.hash('doctor123', salt);

    // Create Admin
    const admin = await Doctor.create({
      name: 'Admin User',
      email: 'admin@hospital.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      hospitalId: hospital._id
    });

    // Create Doctor
    const doctor = await Doctor.create({
      name: 'Dr. Jane Smith',
      email: 'doctor@hospital.com',
      passwordHash: doctorPasswordHash,
      role: 'doctor',
      department: 'Cardiology',
      hospitalId: hospital._id,
      licenseNo: 'MED123456'
    });

    // Create Patients
    const patient1 = await Patient.create({
      nfcUuid: uuidv4(),
      personalInfo: {
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        bloodGroup: 'O+',
        phone: '555-0101',
        emergencyContact: '555-0102',
        address: '456 Patient Lane',
        aadhaarLast4: '1234',
        abhaId: '14-1234-5678-9012',
        photoUrl: 'https://i.pravatar.cc/150?u=johndoe'
      },
      medicalInfo: {
        allergies: ['Penicillin'],
        chronicConditions: ['Hypertension'],
        currentMedications: [{ name: 'Amlodipine', dosage: '5mg', frequency: 'Daily' }]
      },
      hospitalId: hospital._id,
      visitHistory: [{
        doctor: doctor._id,
        department: 'Cardiology',
        diagnosis: 'Routine Checkup, BP elevated',
        prescription: ['Amlodipine 5mg'],
        notes: 'Advised low sodium diet'
      }]
    });

    const patient2 = await Patient.create({
      nfcUuid: uuidv4(),
      personalInfo: {
        name: 'Alice Johnson',
        age: 32,
        gender: 'Female',
        bloodGroup: 'A-',
        phone: '555-0201',
        abhaId: '14-9876-5432-1098',
        photoUrl: 'https://i.pravatar.cc/150?u=alice'
      },
      medicalInfo: {
        allergies: [],
        chronicConditions: []
      },
      hospitalId: hospital._id,
      visitHistory: []
    });

    console.log('\n=== Seed completed successfully! ===');
    console.log('\n--- NFC UUIDs (write these to your NFC cards) ---');
    console.log(`Patient 1 (John Doe):     ${patient1.nfcUuid}`);
    console.log(`Patient 2 (Alice Johnson): ${patient2.nfcUuid}`);
    console.log('\n--- Login Credentials ---');
    console.log('Admin: admin@hospital.com / admin123');
    console.log('Doctor: doctor@hospital.com / doctor123\n');
    mongoose.disconnect();

  } catch (error) {
    console.error('Seeding error:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
