import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Stethoscope, Activity, CreditCard } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    scansToday: 0,
    scansThisWeek: 0
  });
  const [chartData, setChartData] = useState([]);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call for dashboard data
    const fetchDashboardData = async () => {
      try {
        // In a real app, this would be a single dashboard endpoint
        // const response = await api.get('/dashboard/summary');
        
        // Mock data for demonstration
        setTimeout(() => {
          setStats({
            totalPatients: 1248,
            totalDoctors: 45,
            scansToday: 156,
            scansThisWeek: 842
          });
          
          setChartData([
            { name: 'Mon', scans: 120 },
            { name: 'Tue', scans: 132 },
            { name: 'Wed', scans: 101 },
            { name: 'Thu', scans: 145 },
            { name: 'Fri', scans: 156 },
            { name: 'Sat', scans: 89 },
            { name: 'Sun', scans: 99 },
          ]);
          
          setRecentScans([
            { id: 1, patientName: 'John Doe', doctorName: 'Dr. Smith', time: '10:45 AM', status: 'Success' },
            { id: 2, patientName: 'Jane Smith', doctorName: 'Dr. Johnson', time: '10:30 AM', status: 'Success' },
            { id: 3, patientName: 'Robert Brown', doctorName: 'Dr. Williams', time: '09:15 AM', status: 'Failed' },
            { id: 4, patientName: 'Emily Davis', doctorName: 'Dr. Smith', time: '08:50 AM', status: 'Success' },
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Patients" 
          value={stats.totalPatients} 
          icon={Users} 
          trend={{ value: 12, isPositive: true }} 
        />
        <StatsCard 
          title="Total Doctors" 
          value={stats.totalDoctors} 
          icon={Stethoscope} 
        />
        <StatsCard 
          title="Scans Today" 
          value={stats.scansToday} 
          icon={Activity} 
          trend={{ value: 5, isPositive: true }} 
        />
        <StatsCard 
          title="Scans This Week" 
          value={stats.scansThisWeek} 
          icon={CreditCard} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">NFC Scans Over Last 7 Days</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="scans" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Scan Activity</h2>
          <div className="space-y-4">
            {recentScans.map((scan) => (
              <div key={scan.id} className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{scan.patientName}</p>
                  <p className="text-xs text-gray-500">Scanned by {scan.doctorName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-900">{scan.time}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium mt-1 ${
                    scan.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {scan.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-teal-600 font-medium hover:text-teal-800 transition-colors">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
