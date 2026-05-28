import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Download, Sun, Moon, Clock, Calendar, Shield, User, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('in');
  const [qrImageLoaded, setQrImageLoaded] = useState(false);
  const qrCardRef = useRef(null);
  const qrImageRef = useRef(null);

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  useEffect(() => {
    // Reset image loaded state when tab changes
    setQrImageLoaded(false);
  }, [activeTab]);

  const handleImageLoad = () => {
    setQrImageLoaded(true);
  };

  const downloadQRCode = async () => {
    if (!qrCardRef.current) return;
    
    // Wait a bit for any pending renders
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const canvas = await html2canvas(qrCardRef.current, {
        scale: 2.5,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: false,
      });
      
      const link = document.createElement('a');
      link.download = `attendance-${activeTab === 'in' ? 'timein' : 'timeout'}-${user?.employeeId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const qrValue = activeTab === 'in' 
    ? user?.qrCodeInUrl || `timein-${user?.employeeId}-${new Date().toDateString()}`
    : user?.qrCodeOutUrl || `timeout-${user?.employeeId}-${new Date().toDateString()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center">
              <img 
                src="/sunstarlogo.jpg" 
                alt="SunStar Davao" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">SunStar Davao</h1>
              <p className="text-xs text-gray-500">Employee Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500">{user?.employeeId}</p>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            </div>
            <div className="w-8 h-8 bg-gray-100 border border-gray-200 flex items-center justify-center">
              {user?.image_url ? (
                <img src={user.image_url} className="w-full h-full object-cover" alt={user.name} />
              ) : (
                <User size="14" className="text-gray-500" />
              )}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Date Card */}
            <div className="bg-white border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar size="14" className="text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Date</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-gray-700">{formatDate()}</p>
              </div>
            </div>

            {/* Time Card */}
            <div className="bg-white border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Clock size="14" className="text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Live Time</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-2xl font-semibold text-gray-900 tracking-tight">{formatTime()}</p>
              </div>
            </div>

            {/* Employee Card */}
            <div className="bg-white border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <User size="14" className="text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Employee Details</span>
                </div>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Full Name</p>
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Employee ID</p>
                  <p className="text-sm font-mono text-gray-700">{user?.employeeId}</p>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status</span>
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white border border-gray-200 mb-6">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('in')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'in' 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Sun size="15" />
                  <span>Time In</span>
                </button>
                <button
                  onClick={() => setActiveTab('out')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'out' 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Moon size="15" />
                  <span>Time Out</span>
                </button>
              </div>
            </div>

            {/* QR Card - This entire card will be captured for download */}
            <div ref={qrCardRef} className="bg-white border border-gray-200">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activeTab === 'in' ? (
                      <Sun size="14" className="text-amber-500" />
                    ) : (
                      <Moon size="14" className="text-indigo-500" />
                    )}
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {activeTab === 'in' ? 'Morning Attendance' : 'Evening Attendance'}
                    </span>
                  </div>
                  <div className="bg-gray-100 px-2 py-0.5 text-xs font-mono font-medium text-gray-700">
                    {activeTab === 'in' ? 'IN' : 'OUT'}
                  </div>
                </div>
              </div>

              {/* QR Image */}
              <div className="py-10 px-6 flex justify-center">
                <img 
                  ref={qrImageRef}
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrValue)}`}
                  alt="QR Code"
                  className="w-56 h-56 border border-gray-100"
                  crossOrigin="anonymous"
                  onLoad={handleImageLoad}
                />
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 text-center">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{user?.employeeId}</p>
                <div className="mt-3 inline-flex items-center gap-2 bg-green-50 px-3 py-1">
                  <CheckCircle size="12" className="text-green-500" />
                  <p className="text-xs text-green-600">
                    Ready for {activeTab === 'in' ? 'check-in' : 'check-out'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={downloadQRCode}
              disabled={!qrImageLoaded}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size="15" />
              <span>Download QR Code</span>
            </button>

            {/* Note */}
            <div className="mt-6 p-4 bg-gray-50 border-l-2 border-gray-700">
              <p className="text-xs text-gray-600 leading-relaxed">
                <span className="font-medium text-gray-800">Security note:</span> Present this QR code to the security guard for scanning to record your attendance timestamp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;