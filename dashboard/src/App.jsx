import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import RegisterPatient from './pages/RegisterPatient';
import PatientDetail from './pages/PatientDetail';
import ScanLogs from './pages/ScanLogs';
import ManageDoctors from './pages/ManageDoctors';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="patients/new" element={<RegisterPatient />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="scan-logs" element={<ScanLogs />} />
        <Route path="doctors" element={<ManageDoctors />} />
      </Route>
    </Routes>
  );
}

export default App;
