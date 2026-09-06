import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PatientForm from '../components/PatientForm';
import { createPatient } from '../services/api';
import { CreditCard, Check } from 'lucide-react';

const RegisterPatient = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [createdPatient, setCreatedPatient] = useState(null);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      // In a real app:
      // const response = await createPatient(data);
      // setCreatedPatient(response.data);
      
      // Mock successful creation with an NFC UUID returned
      setTimeout(() => {
        setCreatedPatient({
          ...data,
          _id: 'new_id_' + Math.random().toString(36).substr(2, 9),
          nfcUuid: '04:' + Array.from({length: 6}, () => Math.floor(Math.random()*256).toString(16).toUpperCase().padStart(2, '0')).join(':')
        });
        toast.success('Patient registered successfully!');
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register patient');
      setIsLoading(false);
    }
  };

  if (createdPatient) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-center p-8 space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Registration Complete</h2>
            <p className="text-gray-500 mt-2">Patient record has been created successfully.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 inline-block w-full max-w-md">
            <div className="flex items-center justify-center mb-4">
              <CreditCard className="w-8 h-8 text-teal-600 mr-2" />
              <h3 className="text-lg font-medium">NFC Card Assignment</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Please assign an NFC card to this patient. You can write the following UUID to a blank card, or use the card reader utility.</p>
            <div className="bg-white px-4 py-3 rounded border border-gray-300 font-mono text-lg font-bold tracking-wider text-gray-800">
              {createdPatient.nfcUuid}
            </div>
          </div>
          
          <div className="flex justify-center gap-4 pt-4">
            <button 
              className="btn-secondary"
              onClick={() => navigate(`/patients/${createdPatient._id}`)}
            >
              View Patient Profile
            </button>
            <button 
              className="btn-primary"
              onClick={() => setCreatedPatient(null)}
            >
              Register Another Patient
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Register New Patient</h1>
        <p className="text-gray-500 text-sm mt-1">Enter patient details to create a new medical record.</p>
      </div>
      
      <PatientForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default RegisterPatient;
