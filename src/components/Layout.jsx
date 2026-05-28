import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, QrCode, Calendar, Home, Shield, ChevronRight, AlertCircle } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = userType === 'employee' ? [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/attendance', icon: Calendar, label: 'Attendance' },
  ] : [
    { path: '/scanner', icon: QrCode, label: 'Scanner' },
    { path: '/attendance-list', icon: Calendar, label: 'Attendance' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 py-3 md:px-6 md:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center">
                  <img 
                    src="/sunstarlogo.jpg" 
                    alt="SunStar Davao" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-sm md:text-base font-semibold text-gray-900">SunStar Davao</h1>
                  <p className="text-[10px] text-gray-400 hidden sm:block">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Desktop logout button - visible on desktop only */}
            {user && (
              <div className="hidden lg:flex items-center gap-4">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                >
                  <LogOut size="16" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar - visible on desktop, hidden on mobile */}
        {user && (
          <>
            <aside className="hidden lg:block w-56 bg-white border-r border-gray-200 min-h-[calc(100vh-57px)] sticky top-[57px]">
              <nav className="py-4 px-3">
                <p className="px-3 mb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Menu
                </p>
                <div className="space-y-0.5">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-between px-3 py-2 transition-colors ${
                          isActive
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon size="15" className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight size="12" className="text-gray-400" />}
                      </Link>
                    );
                  })}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="px-3 py-1.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Signed in as</p>
                    <p className="text-sm font-medium text-gray-700 truncate mt-0.5">{user?.name || 'User'}</p>
                    <p className="text-[11px] text-gray-400 capitalize mt-0.5">{userType || 'Employee'}</p>
                  </div>
                </div>
              </nav>
            </aside>

            {/* Mobile Bottom Navigation - only visible on mobile/tablet */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-20">
              <div className="flex justify-around py-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex flex-col items-center gap-1 px-4 py-1 rounded transition-colors ${
                        isActive ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      <item.icon size="20" className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex flex-col items-center gap-1 px-4 py-1 text-gray-500"
                >
                  <LogOut size="20" className="text-gray-400" />
                  <span className="text-[10px] font-medium">Logout</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1">
          <div className="px-4 py-4 pb-20 md:px-6 md:py-6 md:pb-6">
            {children}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-50 flex items-center justify-center">
                  <AlertCircle size="18" className="text-red-600" />
                </div>
                <h3 className="text-base font-medium text-gray-900">Confirm Sign Out</h3>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to sign out?
              </p>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;