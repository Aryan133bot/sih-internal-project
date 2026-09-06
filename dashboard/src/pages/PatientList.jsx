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
      // In real app, uncomment this:
      // const response = await getPatients();
      // setPatients(response.data);
      
      // Mock data for UI development
      setTimeout(() => {
        setPatients([
          { _id: '1', name: 'John Doe', age: 45, gender: 'Male', bloodGroup: 'O+', phone: '+1 234 567 8900', aadhaarLast4: '4521', nfcUuid: '04:8E:22:9A:F4:65:80' },
          { _id: '2', name: 'Jane Smith', age: 32, gender: 'Female', bloodGroup: 'A-', phone: '+1 987 654 3210', aadhaarLast4: '8832', nfcUuid: '04:7B:11:8C:E3:54:77' },
          { _id: '3', name: 'Robert Johnson', age: 58, gender: 'Male', bloodGroup: 'B+', phone: '+1 555 123 4567', aadhaarLast4: '1190', nfcUuid: null },
        ]);
        setLoading(false);
      }, 800);
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
