import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Activity, Clock, CreditCard, Edit, Trash2, User, Droplet, Phone, MapPin, AlertCircle, ShieldCheck } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import { getPatient } from '../services/api';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const response = await getPatient(id);
        const p = response.data?.data || response.data;
        
        // Map backend mongoose model to frontend expected UI shape
        setPatient({
          _id: p._id,
          name: p.personalInfo?.name || 'Unknown',
          age: p.personalInfo?.age,
          gender: p.personalInfo?.gender,
          bloodGroup: p.personalInfo?.bloodGroup,
          phone: p.personalInfo?.phone || 'N/A',
          emergencyContact: p.personalInfo?.emergencyContact || 'N/A',
          address: p.personalInfo?.address,
          aadhaarLast4: p.personalInfo?.aadhaarLast4,
          abhaId: p.personalInfo?.abhaId,
          nfcUuid: p.nfcUuid || 'Not Assigned',
          personalInfo: p.personalInfo || {},
          allergies: p.medicalInfo?.allergies || [],
          chronicConditions: p.medicalInfo?.chronicConditions || [],
          medications: p.medicalInfo?.currentMedications || [],
          insuranceProvider: p.medicalInfo?.insuranceProvider,
          insurancePolicyNo: p.medicalInfo?.insurancePolicyNo,
          visits: p.visitHistory?.map(v => ({
            date: new Date(v.date).toLocaleDateString(),
            doctor: v.doctor?.name || 'Unknown Doctor',
            department: v.department || 'General',
            reason: v.diagnosis || 'Checkup'
          })) || []
        });
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load patient details');
        setLoading(false);
      }
    };
    
    fetchPatientData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!patient) return <div>Patient not found</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 bg-teal-700 relative">
          <div className="absolute -bottom-12 left-6">
            <div className="h-24 w-24 bg-white rounded-full p-2 shadow-md">
              <div className="h-full w-full bg-teal-100 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-teal-600" />
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded backdrop-blur-sm transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button className="bg-red-500/80 hover:bg-red-600/80 text-white p-2 rounded backdrop-blur-sm transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="pt-16 pb-6 px-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center"><User className="w-4 h-4 mr-1" /> {patient.age} yrs, {patient.gender}</span>
                <span className="flex items-center"><Droplet className="w-4 h-4 mr-1 text-red-500" /> Blood: {patient.bloodGroup}</span>
              </div>
            </div>
            
            <div className="bg-teal-50 border border-teal-100 rounded-lg p-3 flex items-center gap-3">
              <div className="bg-teal-100 p-2 rounded-full">
                <CreditCard className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-teal-800 font-medium uppercase">NFC MedCard ID</p>
                <p className="font-mono text-sm font-bold text-teal-900">{patient.nfcUuid || 'Not Assigned'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-t border-gray-200 flex overflow-x-auto">
          {['overview', 'medical', 'visits'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === tab 
                  ? 'border-b-2 border-teal-600 text-teal-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column - Always visible on desktop */}
        <div className="space-y-6 md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Phone className="w-4 h-4 text-gray-400 mt-1 mr-3 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{patient.phone}</p>
                  <p className="text-xs text-gray-500">Primary</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-4 h-4 text-red-400 mt-1 mr-3 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{patient.emergencyContact}</p>
                  <p className="text-xs text-gray-500">Emergency</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                  <span className="text-xs text-gray-500 block">NFC UUID</span>
                  <span className="font-mono text-sm font-medium text-gray-800">{patient.nfcUuid}</span>
                </div>
                {patient.personalInfo?.abhaId && (
                  <div className="bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
                    <span className="text-xs text-blue-500 block flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> ABHA ID
                    </span>
                    <span className="font-mono text-sm font-medium text-blue-800">{patient.personalInfo.abhaId}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200 mt-4">
              <span className="text-xs font-semibold text-gray-500 mb-2">CARD BACKUP QR</span>
              <div className="bg-white p-2 rounded shadow-sm">
                <QRCodeCanvas value={patient.nfcUuid} size={96} level={"H"} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Insurance Details</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Provider</p>
                <p className="text-sm font-medium text-gray-900">{patient.insuranceProvider || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Policy Number</p>
                <p className="text-sm font-medium text-gray-900">{patient.insurancePolicyNo || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tab Content */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === 'overview' && (
             <div className="space-y-6">
              {/* Critical Alerts */}
              {(patient.allergies?.length > 0 || patient.chronicConditions?.length > 0) && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <div className="flex items-center mb-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <h3 className="text-lg font-medium text-red-900">Medical Alerts</h3>
                  </div>
                  
                  {patient.allergies?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-red-800 mb-1">Allergies:</p>
                      <div className="flex flex-wrap gap-2">
                        {patient.allergies.map((a, i) => (
                          <span key={i} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-md">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {patient.chronicConditions?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-800 mb-1">Chronic Conditions:</p>
                      <div className="flex flex-wrap gap-2">
                        {patient.chronicConditions.map((c, i) => (
                          <span key={i} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-md">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Current Medications</h3>
                {patient.medications?.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {patient.medications.map((med, i) => (
                      <div key={i} className="py-3 first:pt-0 last:pb-0">
                        <p className="font-medium text-gray-900">{med.name}</p>
                        <p className="text-sm text-gray-500">{med.dosage} • {med.frequency}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No current medications listed.</p>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'visits' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Visit History</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {patient.visits?.map((visit, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-teal-100 text-teal-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-gray-900">{visit.date}</div>
                        <div className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded">{visit.department}</div>
                      </div>
                      <div className="text-sm text-gray-700 font-medium">{visit.doctor}</div>
                      <div className="text-sm text-gray-500 mt-1">{visit.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'medical' && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
               <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>Detailed medical records view would go here.</p>
                  <p className="text-sm">Including lab results, imaging, and detailed doctor notes.</p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
