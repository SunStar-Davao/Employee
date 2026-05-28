import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, User, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const GuardLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { guardLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');
    const result = await guardLogin(username, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message || 'Login failed');
    } else {
      navigate('/scanner');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/70 z-10"></div>
        <img 
          src="/bg.png" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 flex flex-col justify-between p-12 h-full">
          <div>
           <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
                <img 
                src="/sunstarlogo.jpg" 
                alt="SunStar Davao" 
                className="w-full h-full object-contain"
                />
            </div>
            <span className="text-white text-lg font-medium">SunStar Davao</span>
            </div>
          </div>
          
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <Shield size={32} className="text-amber-400" />
              <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">Security Console</span>
            </div>
            <h1 className="text-4xl font-serif text-white mb-4">Guard Access</h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Authorized personnel only. Scan employee QR codes to record attendance and manage security logs.
            </p>
           
          </div>
          
          <div className="text-gray-300 text-sm">
            © 2024 SunStar Davao. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-semibold text-gray-900">Security Guard Login</h2>
            <p className="mt-2 text-sm text-gray-600">
              Authorized access only
            </p>
          </div>

          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <form className="space-y-5" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 text-sm rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 pr-9 py-2 border border-gray-300 rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Security Note */}
              <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-start space-x-2">
                <Shield size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  This area is restricted to authorized security personnel only. Unauthorized access is prohibited.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center space-x-2 py-2.5 px-4 border border-transparent rounded text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Authorizing...</span>
                  </div>
                ) : (
                  <>
                    <Shield size={14} />
                    <span>Authorize Access</span>
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-400">Employee access</span>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-sm text-gray-500 hover:text-gray-900 flex items-center justify-center space-x-1 mx-auto"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Employee Login</span>
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Secure access for authorized security personnel only
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuardLogin;