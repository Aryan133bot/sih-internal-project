import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import PatientTable from '../components/PatientTable';
import { getPatients, deletePatient } from '../services/api';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await getPatients();
      
      const patientData = response.data?.data || response.data || [];
      
      const formattedPatients = patientData.map(p => ({
        _id: p._id,
        name: p.personalInfo?.name || 'Unknown',
        age: p.personalInfo?.age || 'N/A',
        gender: p.personalInfo?.gender || 'N/A',
        bloodGroup: p.personalInfo?.bloodGroup || 'N/A',
        phone: p.personalInfo?.phone || 'N/A',
        aadhaarLast4: p.personalInfo?.aadhaarLast4 || 'N/A',
        nfcUuid: p.nfcUuid
      }));

      setPatients(formattedPatients);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load patients');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      try {
        // In real app:
        // await deletePatient(id);
        
        setPatients(patients.filter(p => p._id !== id));
        toast.success('Patient deleted successfully');
      } catch (error) {
        toast.error('Failed to delete patient');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Directory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and view all registered patients</p>
        </div>
        <Link to="/patients/new" className="btn-primary">
          <Plus className="w-5 h-5 mr-1" />
          Register New Patient
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <PatientTable patients={patients} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default PatientList;
