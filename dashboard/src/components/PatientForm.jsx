import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const PatientForm = ({ initialData = {}, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    age: initialData.age || '',
    gender: initialData.gender || 'Male',
    bloodGroup: initialData.bloodGroup || 'A+',
    phone: initialData.phone || '',
    emergencyContact: initialData.emergencyContact || '',
    address: initialData.address || '',
    aadhaarLast4: initialData.aadhaarLast4 || '',
    insuranceProvider: initialData.insuranceProvider || '',
    insurancePolicyNo: initialData.insurancePolicyNo || '',
  });

  const [allergies, setAllergies] = useState(initialData.allergies?.join(', ') || '');
  const [chronicConditions, setChronicConditions] = useState(initialData.chronicConditions?.join(', ') || '');
  
  const [medications, setMedications] = useState(initialData.medications || []);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addMedication = () => {
    if (newMed.name) {
      setMedications([...medications, newMed]);
      setNewMed({ name: '', dosage: '', frequency: '' });
    }
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      age: parseInt(formData.age, 10),
      allergies: allergies.split(',').map(a => a.trim()).filter(a => a),
      chronicConditions: chronicConditions.split(',').map(c => c.trim()).filter(c => c),
      medications
    };
    
    onSubmit(submitData);
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
              <input required type="number" name="age" value={formData.age} onChange={handleChange} className="input-field" min="0" max="150" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact *</label>
            <input required type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="input-field"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar (Last 4 digits)</label>
            <input type="text" name="aadhaarLast4" value={formData.aadhaarLast4} onChange={handleChange} className="input-field" maxLength="4" pattern="\d{4}" />
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Medical Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="input-field">
              {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div></div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Allergies (comma separated)</label>
            <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} className="input-field" placeholder="e.g. Penicillin, Peanuts" />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Chronic Conditions (comma separated)</label>
            <input type="text" value={chronicConditions} onChange={(e) => setChronicConditions(e.target.value)} className="input-field" placeholder="e.g. Diabetes, Hypertension" />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
          
          {medications.length > 0 && (
            <div className="mb-4 space-y-2">
              {medications.map((med, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                  <div>
                    <span className="font-medium text-gray-800">{med.name}</span>
                    <span className="text-gray-500 text-sm ml-2">- {med.dosage}, {med.frequency}</span>
                  </div>
                  <button type="button" onClick={() => removeMedication(index)} className="text-red-500 hover:text-red-700 p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="text" placeholder="Medication Name" value={newMed.name} onChange={(e) => setNewMed({...newMed, name: e.target.value})} className="input-field flex-1" />
            <input type="text" placeholder="Dosage (e.g. 50mg)" value={newMed.dosage} onChange={(e) => setNewMed({...newMed, dosage: e.target.value})} className="input-field w-full sm:w-32" />
            <input type="text" placeholder="Freq (e.g. 1x daily)" value={newMed.frequency} onChange={(e) => setNewMed({...newMed, frequency: e.target.value})} className="input-field w-full sm:w-32" />
            <button type="button" onClick={addMedication} className="btn-secondary whitespace-nowrap">
              <Plus className="w-4 h-4 mr-1" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Insurance Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Insurance Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
            <input type="text" name="insuranceProvider" value={formData.insuranceProvider} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
            <input type="text" name="insurancePolicyNo" value={formData.insurancePolicyNo} onChange={handleChange} className="input-field" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Patient Record'}
        </button>
      </div>
    </form>
  );
};

export default PatientForm;
