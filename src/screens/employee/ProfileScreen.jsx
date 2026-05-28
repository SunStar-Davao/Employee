import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, ChevronRight, AlertCircle, Briefcase, Award, Mail, Phone, MapPin, User } from 'lucide-react';
import axiosInstance from '../../api/axios';
import moment from 'moment';

const ProfileScreen = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/attendance/summary/${user?.employeeId}?limit=5`);
      
      if (response.data?.success) {
        setRecentActivity(response.data.attendance || []);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatJoinDate = () => {
    return moment(user?.createdAt || new Date()).format('MMMM D, YYYY');
  };

  const formatLateTime = (minutes) => {
    if (!minutes || minutes <= 0) return null;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0 && remainingMinutes > 0) return `${hours}h ${remainingMinutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${remainingMinutes}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-50 text-green-700 border-green-200';
      case 'late': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'absent': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const presentCount = recentActivity.filter(a => a.status === 'present').length;
  const lateCount = recentActivity.filter(a => a.status === 'late').length;
  const absentCount = recentActivity.filter(a => a.status === 'absent').length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Employee Profile</h1>
        <p className="text-xs text-gray-500 mt-1">View your personal information and attendance summary</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gray-900 px-6 pt-8 pb-10 text-center">
              <div className="w-25 h-25 bg-gray-700 flex items-center justify-center mx-auto border-2 border-white/20">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-medium text-white">
                    {user?.name?.charAt(0) || 'E'}
                  </span>
                )}
              </div>
              {/* <div className="mt-3">
                <div className="inline-flex items-center gap-1.5 bg-green-500 px-2 py-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  <span className="text-xs text-white">Active</span>
                </div>
              </div> */}
            </div>

            {/* Profile Info */}
            <div className="px-5 py-5">
              {/* <h2 className="text-lg font-semibold text-gray-900 text-center">{user?.name || 'Employee Name'}</h2>
              <p className="text-xs text-gray-500 text-center mt-1 font-mono">{user?.employeeId || 'EMP-001'}</p> */}
              
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 text-sm py-2 border-b border-gray-100">
                  <Briefcase size="14" className="text-gray-400" />
                  <span className="text-xs text-gray-500">Name</span>
                  <span className="text-xs text-gray-900 font-medium ml-auto">{user?.name || 'Not assigned'}</span>
                </div>
                 <div className="flex items-center gap-3 text-sm py-2 border-b border-gray-100">
                  <Mail size="14" className="text-gray-400" />
                  <span className="text-xs text-gray-500">Employee ID</span>
                  <span className="text-xs text-gray-900 font-medium ml-auto truncate">{user?.employeeId || '—'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm py-2 border-b border-gray-100">
                  <Briefcase size="14" className="text-gray-400" />
                  <span className="text-xs text-gray-500">Department</span>
                  <span className="text-xs text-gray-900 font-medium ml-auto">{user?.department || 'Not assigned'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm py-2 border-b border-gray-100">
                  <Award size="14" className="text-gray-400" />
                  <span className="text-xs text-gray-500">Position</span>
                  <span className="text-xs text-gray-900 font-medium ml-auto">Employee</span>
                </div>
                <div className="flex items-center gap-3 text-sm py-2">
                  <Calendar size="14" className="text-gray-400" />
                  <span className="text-xs text-gray-500">Member since</span>
                  <span className="text-xs text-gray-900 font-medium ml-auto">{formatJoinDate()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 p-4 text-center">
              <p className="text-2xl font-semibold text-green-600">{presentCount}</p>
              <p className="text-xs text-gray-500 mt-1">Present</p>
            </div>
            <div className="bg-white border border-gray-200 p-4 text-center">
              <p className="text-2xl font-semibold text-amber-600">{lateCount}</p>
              <p className="text-xs text-gray-500 mt-1">Late</p>
            </div>
            <div className="bg-white border border-gray-200 p-4 text-center">
              <p className="text-2xl font-semibold text-red-600">{absentCount}</p>
              <p className="text-xs text-gray-500 mt-1">Absent</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size="14" className="text-gray-400" />
                <h3 className="text-sm font-medium text-gray-900">Recent Attendance</h3>
              </div>
              <button
                onClick={() => navigate('/attendance')}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                <span>View all</span>
                <ChevronRight size="12" />
              </button>
            </div>
            
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentActivity.map((item, index) => (
                  <div key={item.id || index} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar size="13" className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {moment(item.date).format('MMMM D, YYYY')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.late_minutes > 0 && (
                          <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5">
                            <AlertCircle size="10" />
                            <span>{formatLateTime(item.late_minutes)} late</span>
                          </span>
                        )}
                        <span className={`px-2 py-0.5 border text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Time In</p>
                        <p className="text-sm font-medium text-gray-800">
                          {item.time_in ? moment.utc(item.time_in).local().format('h:mm A') : '—'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Time Out</p>
                        <p className="text-sm font-medium text-gray-800">
                          {item.time_out ? moment.utc(item.time_out).local().format('h:mm A') : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-10 h-10 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Calendar size="16" className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-400">No attendance records yet</p>
              </div>
            )}
          </div>

          {/* Note */}
          <div className="mt-5 p-3 bg-gray-50 border-l-2 border-gray-700">
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">Note:</span> For any discrepancies in your attendance record, please contact HR.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;