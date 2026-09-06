import { useState, useEffect } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';

const ScanLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, success, failed

  useEffect(() => {
    // Mock API
    setTimeout(() => {
      setLogs([
        { id: 'L1', timestamp: '2023-10-25T10:45:30', patientName: 'John Doe', nfcUuid: '04:8E:22:9A:F4:65:80', doctorName: 'Dr. Smith', department: 'Cardiology', status: 'Success' },
        { id: 'L2', timestamp: '2023-10-25T10:30:15', patientName: 'Jane Smith', nfcUuid: '04:7B:11:8C:E3:54:77', doctorName: 'Dr. Johnson', department: 'General', status: 'Success' },
        { id: 'L3', timestamp: '2023-10-25T09:15:42', patientName: 'Unknown', nfcUuid: '04:99:AA:BB:CC:DD:EE', doctorName: 'Dr. Williams', department: 'Emergency', status: 'Failed', reason: 'Unregistered Card' },
        { id: 'L4', timestamp: '2023-10-24T16:20:05', patientName: 'Robert Johnson', nfcUuid: '04:1A:2B:3C:4D:5E:6F', doctorName: 'Dr. Smith', department: 'Cardiology', status: 'Success' },
        { id: 'L5', timestamp: '2023-10-24T14:10:22', patientName: 'Emily Davis', nfcUuid: '04:F1:E2:D3:C4:B5:A6', doctorName: 'Dr. Brown', department: 'Orthopedics', status: 'Success' },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.status.toLowerCase() === filter;
  });

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">NFC Scan Logs</h1>
        <p className="text-gray-500 text-sm mt-1">Audit trail of all MedCard access events</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 rounded-t-lg">
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input type="text" className="input-field pl-10 py-1.5" placeholder="Search by name or UUID..." />
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field py-1.5 text-sm"
            >
              <option value="all">All Status</option>
              <option value="success">Successful</option>
              <option value="failed">Failed</option>
            </select>
            <button className="btn-secondary py-1.5 px-3">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient / UUID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scanned By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => {
                  const { date, time } = formatDate(log.timestamp);
                  return (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{date}</div>
                        <div className="text-xs text-gray-500">{time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{log.patientName}</div>
                        <div className="text-xs font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-600 mt-1 inline-block">{log.nfcUuid}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.doctorName}</div>
                        <div className="text-xs text-gray-500">{log.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {log.status}
                        </span>
                        {log.reason && (
                          <div className="text-xs text-red-500 mt-1">{log.reason}</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanLogs;
