import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Folder, CheckSquare, LogOut, Menu, X } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <Folder size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#121215] text-gray-200">
      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-[#1a1a24] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-72 flex flex-col border-r border-gray-800
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TeamTasker</h1>
            <p className="text-xs font-semibold tracking-wider text-gray-500 mt-1 uppercase">{user.role} Portal</p>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-900/40 to-indigo-900/40 text-blue-400 font-semibold shadow-sm border border-blue-800/50' 
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                  }`}
              >
                <div className={`${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'} transition-colors`}>
                  {link.icon}
                </div>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          {/* Moved to header */}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

        <header className="glass sticky top-0 z-10 p-4 lg:px-8 flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-800 text-gray-400"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-100 hidden sm:block">
              {navLinks.find(link => link.path === location.pathname)?.name || 'Welcome'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-200">Welcome, {user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
            <div className="h-8 w-px bg-gray-700 hidden sm:block"></div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors font-medium"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 lg:p-8 relative z-10">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
