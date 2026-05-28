import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Lock, Eye, EyeOff, Briefcase, Camera, X, ArrowLeft } from 'lucide-react';

const DEPARTMENTS = [
  'Editorial',
  'Sales',
  'Marketing',
  'HR',
  'IT',
  'Finance',
  'Admin'
];

const EmployeeRegister = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          uri: reader.result,
          base64: reader.result.split(',')[1],
          type: file.type,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!name || !password || !confirmPassword || !department) {
      setError('Please fill all fields including department');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    const data = {
      name,
      password,
      department,
      image: image ? `data:${image.type};base64,${image.base64}` : null
    };

    try {
      const result = await register(data);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
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
            <h1 className="text-4xl font-serif text-white mb-4">Join Our Team</h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Create your employee account to access internal resources and collaborate with colleagues.
            </p>
            <div className="mt-8 flex items-center space-x-4">
              <div className="h-1 w-10 bg-amber-500"></div>
              <span className="text-gray-400 text-sm">Since 1982</span>
            </div>
          </div>
          
          <div className="text-gray-300 text-sm">
            © 2024 SunStar Davao. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-lg">
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to login</span>
          </button>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Create account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Register as a new employee
            </p>
          </div>

          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <form className="space-y-5" onSubmit={handleRegister}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 text-sm rounded">
                  {error}
                </div>
              )}

              {/* Profile Image Upload */}
              <div className="flex items-center space-x-4">
                <div>
                  {image ? (
                    <div className="relative">
                      <img
                        src={image.uri}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-gray-200 hover:bg-red-500 text-gray-600 hover:text-white rounded-full p-0.5 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 flex flex-col items-center justify-center hover:border-gray-300 transition-colors">
                        <Camera size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Profile photo</p>
                  <p className="text-xs text-gray-400">Optional, max 2MB</p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., Juan Dela Cruz"
                  />
                </div>
              </div>

              {/* Department Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase size={16} className="text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                    className="w-full pl-9 pr-3 py-2 text-left border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
                  >
                    <span className={department ? 'text-gray-900' : 'text-gray-400'}>
                      {department || 'Select department'}
                    </span>
                  </button>
                  
                  {showDepartmentDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-y-auto">
                      {DEPARTMENTS.map((dept) => (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => {
                            setDepartment(dept);
                            setShowDepartmentDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                            department === dept ? 'text-gray-900 font-medium bg-gray-50' : 'text-gray-600'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
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
                    placeholder="Create a password"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm password <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-9 pr-9 py-2 border border-gray-300 rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 rounded p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={`text-xs ${password.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                    At least 6 characters
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${password === confirmPassword && password ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={`text-xs ${password === confirmPassword && password ? 'text-green-600' : 'text-gray-500'}`}>
                    Passwords match
                  </span>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create account'
                )}
              </button>

              {/* Login Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Already have an account? <span className="underline">Sign in</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegister;