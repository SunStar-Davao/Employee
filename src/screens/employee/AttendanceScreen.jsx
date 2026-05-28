import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, ChevronLeft, ChevronRight, AlertCircle, LogIn, LogOut, BarChart3, TrendingUp, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import axiosInstance from '../../api/axios';
import moment from 'moment';

const AttendanceScreen = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recent');
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
  const [summary, setSummary] = useState({
    totalDays: 0,
    present: 0,
    late: 0,
    absent: 0,
    totalLateMinutes: 0,
  });

  useEffect(() => {
    if (activeTab === 'month') {
      fetchAttendanceByMonth();
    } else {
      fetchAttendance();
    }
  }, [activeTab, selectedMonth]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/attendance/summary/${user?.employeeId}?limit=20`);
      
      if (response.data?.success) {
        setAttendance(response.data.attendance || []);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceByMonth = async () => {
    try {
      setLoading(true);
      const startDate = moment(selectedMonth).startOf('month').format('YYYY-MM-DD');
      const endDate = moment(selectedMonth).endOf('month').format('YYYY-MM-DD');
      
      const response = await axiosInstance.get(
        `/attendance/report?employeeId=${user?.employeeId}&startDate=${startDate}&endDate=${endDate}`
      );
      
      if (response.data?.success) {
        const attendanceData = response.data.data || [];
        setAttendance(attendanceData);
        
        const totalLate = attendanceData.reduce((total, item) => {
          return total + (item.late_minutes || 0);
        }, 0);
        
        setSummary({
          totalDays: attendanceData.length || 0,
          present: attendanceData.filter(item => item.status === 'present').length || 0,
          late: attendanceData.filter(item => item.status === 'late').length || 0,
          absent: attendanceData.filter(item => item.status === 'absent').length || 0,
          totalLateMinutes: totalLate,
        });
      }
    } catch (error) {
      console.error('Error fetching monthly attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-50 text-green-700 border-green-200';
      case 'late': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'absent': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle size={12} />;
      case 'late': return <Clock size={12} />;
      case 'absent': return <XCircle size={12} />;
      default: return null;
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

  const formatTotalLate = () => {
    if (!summary.totalLateMinutes || summary.totalLateMinutes === 0) return null;
    const hours = Math.floor(summary.totalLateMinutes / 60);
    const minutes = summary.totalLateMinutes % 60;
    if (hours > 0 && minutes > 0) return `${hours} hr ${minutes} min`;
    if (hours > 0) return `${hours} hr`;
    return `${minutes} min`;
  };

  const getAttendanceRate = () => {
    if (summary.totalDays === 0) return 0;
    return Math.round((summary.present / summary.totalDays) * 100);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Attendance History</h1>
        <p className="text-xs text-gray-500 mt-1">View and track your attendance records</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 w-64 mb-6">
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium transition-colors ${
            activeTab === 'recent' 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LogIn size={13} />
          <span>Recent</span>
        </button>
        <button
          onClick={() => setActiveTab('month')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium transition-colors ${
            activeTab === 'month' 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BarChart3 size={13} />
          <span>Monthly</span>
        </button>
      </div>

      {/* Monthly View */}
      {activeTab === 'month' && (
        <>
          {/* Month Selector */}
          <div className="bg-white border border-gray-200 mb-6">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => setSelectedMonth(moment(selectedMonth).subtract(1, 'month').format('YYYY-MM'))}
                className="p-1 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size="16" className="text-gray-500" />
              </button>
              <div className="px-3 py-1 bg-gray-100 text-sm font-medium text-gray-900">
                {moment(selectedMonth).format('MMMM YYYY')}
              </div>
              <button
                onClick={() => {
                  const nextMonth = moment(selectedMonth).add(1, 'month').format('YYYY-MM');
                  if (moment(nextMonth).isSameOrBefore(moment(), 'month')) {
                    setSelectedMonth(nextMonth);
                  }
                }}
                className={`p-1 transition-colors ${
                  moment(selectedMonth).isSame(moment(), 'month')
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }`}
                disabled={moment(selectedMonth).isSame(moment(), 'month')}
              >
                <ChevronRight size="16" className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 p-4 text-center">
              <p className="text-2xl font-semibold text-gray-900">{summary.totalDays}</p>
              <p className="text-xs text-gray-500 mt-1">Total Days</p>
            </div>
            <div className="bg-white border border-gray-200 p-4 text-center">
              <p className="text-2xl font-semibold text-green-600">{summary.present}</p>
              <p className="text-xs text-gray-500 mt-1">Present</p>
            </div>
            <div className="bg-white border border-gray-200 p-4 text-center">
              <p className="text-2xl font-semibold text-amber-600">{summary.late}</p>
              <p className="text-xs text-gray-500 mt-1">Late</p>
            </div>
            <div className="bg-white border border-gray-200 p-4 text-center">
              <p className="text-2xl font-semibold text-red-600">{summary.absent}</p>
              <p className="text-xs text-gray-500 mt-1">Absent</p>
            </div>
          </div>

          {/* Attendance Rate */}
          {summary.totalDays > 0 && (
            <div className="bg-white border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size="14" className="text-gray-400" />
                  <span className="text-xs font-medium text-gray-700">Attendance Rate</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{getAttendanceRate()}%</span>
              </div>
              <div className="w-full bg-gray-200 h-1">
                <div 
                  className="bg-green-500 h-1 transition-all duration-300"
                  style={{ width: `${getAttendanceRate()}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Late Summary */}
          {summary.totalLateMinutes > 0 && (
            <div className="bg-amber-50 border-l-2 border-amber-500 p-3 mb-6 flex items-center gap-2">
              <AlertCircle size="14" className="text-amber-600" />
              <span className="text-xs text-amber-700">
                Total late time: <strong>{formatTotalLate()}</strong>
              </span>
            </div>
          )}
        </>
      )}

      {/* Attendance List */}
      {loading ? (
        <div className="bg-white border border-gray-200 p-12 flex justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      ) : attendance.length > 0 ? (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {activeTab === 'month' ? 'Daily Records' : 'Recent Records'}
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {attendance.map((item, index) => {
              const timeInLocal = item.time_in ? moment.utc(item.time_in).local() : null;
              const timeOutLocal = item.time_out ? moment.utc(item.time_out).local() : null;
              
              return (
                <div key={item.id || index} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar size="13" className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {moment(item.date).format('MMMM D, YYYY')}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 border text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span>{item.status?.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 flex items-center justify-center">
                          <LogIn size="11" className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Time In</p>
                          <p className="text-sm font-medium text-gray-800">
                            {timeInLocal ? timeInLocal.format('h:mm A') : '—'}
                          </p>
                        </div>
                      </div>
                      <div className="w-px h-6 bg-gray-200"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 flex items-center justify-center">
                          <LogOut size="11" className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Time Out</p>
                          <p className="text-sm font-medium text-gray-800">
                            {timeOutLocal ? timeOutLocal.format('h:mm A') : '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                    {item.late_minutes > 0 && (
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5">
                        <AlertCircle size="10" className="text-amber-500" />
                        <span className="text-xs text-amber-600">{formatLateTime(item.late_minutes)} late</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Calendar size="20" className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-400">No records found</p>
          <p className="text-xs text-gray-400 mt-1">Your attendance history will appear here</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceScreen;