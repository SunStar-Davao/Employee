import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, Clock, AlertCircle, RefreshCw, Search, ChevronRight } from 'lucide-react';
import axiosInstance from '../../api/axios';
import moment from 'moment';

const AttendanceList = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [summary, setSummary] = useState({
    present: 0,
    late: 0,
    absent: 0,
    total: 0,
  });

  useEffect(() => {
    fetchAttendance();
    
    const interval = setInterval(() => {
      fetchAttendance(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchAttendance = async (silent = false) => {
    if (!silent) setLoading(true);
    
    try {
      const response = await axiosInstance.get('/attendance/today');
      const attendanceData = response.data?.data || [];
      
      setAttendance(attendanceData);
      
      const present = attendanceData.filter(item => item?.status === 'present').length || 0;
      const late = attendanceData.filter(item => item?.status === 'late').length || 0;
      const absent = attendanceData.filter(item => item?.status === 'absent').length || 0;
      
      setSummary({
        present,
        late,
        absent,
        total: attendanceData.length || 0,
      });
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-700';
      case 'late': return 'bg-amber-100 text-amber-700';
      case 'absent': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatLateTime = (minutes) => {
    if (!minutes || minutes <= 0) return null;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0 && remainingMinutes > 0) return `${hours}h ${remainingMinutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${remainingMinutes}m`;
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredAttendance = attendance.filter(item => 
    item?.employees?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item?.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header - Different layout on mobile vs desktop */}
      <div className="mb-5 md:mb-6">
        <h1 className="text-lg md:text-xl font-semibold text-gray-900">Today's Attendance</h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">{formatDate()}</p>
      </div>

      {/* Stats Cards - Grid changes from 2x2 to 4 columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-5 md:mb-6">
        <div className="bg-white border border-gray-200 p-3 md:p-4 text-center">
          <p className="text-base md:text-2xl font-semibold text-green-600">{summary.present}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Present</p>
        </div>
        <div className="bg-white border border-gray-200 p-3 md:p-4 text-center">
          <p className="text-base md:text-2xl font-semibold text-amber-600">{summary.late}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Late</p>
        </div>
        <div className="bg-white border border-gray-200 p-3 md:p-4 text-center">
          <p className="text-base md:text-2xl font-semibold text-red-600">{summary.absent}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Absent</p>
        </div>
        <div className="bg-white border border-gray-200 p-3 md:p-4 text-center">
          <p className="text-base md:text-2xl font-semibold text-gray-900">{summary.total}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Total</p>
        </div>
      </div>

      {/* Search and Refresh - Row on mobile, inline on desktop */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4 md:mb-5">
        <div className="relative flex-1">
          <Search size="14" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 md:py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-300"
          />
        </div>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center justify-center gap-1 px-3 py-1.5 md:px-4 md:py-1.5 text-xs text-gray-500 border border-gray-200 hover:bg-gray-50 md:w-auto"
        >
          <RefreshCw size="12" className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* List - Different card layout on mobile vs desktop */}
      {filteredAttendance.length > 0 ? (
        <div className="space-y-2 md:space-y-3">
          {filteredAttendance.map((item, index) => (
            <div key={item.id || index} className="bg-white border border-gray-200 p-3 md:p-4">
              {/* Mobile layout (simpler) */}
              <div className="block md:hidden">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item?.employees?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400 font-mono">{item?.employee_id || 'N/A'}</p>
                  </div>
                  <div className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(item?.status)}`}>
                    {item?.status?.toUpperCase() || 'UNKNOWN'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Time In</p>
                    <p className="text-sm font-medium text-gray-800">
                      {item?.time_in ? moment(item.time_in).format('h:mm A') : '—'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Time Out</p>
                    <p className="text-sm font-medium text-gray-800">
                      {item?.time_out ? moment(item.time_out).format('h:mm A') : '—'}
                    </p>
                  </div>
                </div>
                
                {item?.late_minutes > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-amber-600">{formatLateTime(item.late_minutes)} late</span>
                  </div>
                )}
              </div>

              {/* Desktop layout (more detailed) */}
              <div className="hidden md:block">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{item?.employees?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400 font-mono">ID: {item?.employee_id || 'N/A'}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(item?.status)}`}>
                    {item?.status?.toUpperCase() || 'UNKNOWN'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-gray-400">Time In</p>
                      <p className="text-sm font-medium text-gray-800">
                        {item?.time_in ? moment(item.time_in).format('h:mm A') : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Time Out</p>
                      <p className="text-sm font-medium text-gray-800">
                        {item?.time_out ? moment(item.time_out).format('h:mm A') : '—'}
                      </p>
                    </div>
                  </div>
                  {item?.late_minutes > 0 && (
                    <span className="text-xs text-amber-600">{formatLateTime(item.late_minutes)} late</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-8 md:p-12 text-center">
          <Calendar size="20" className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No records</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;