import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#121215]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="w-full max-w-md p-8 bg-[#1a1a24] border border-gray-800 shadow-xl rounded-2xl animate-fade-in mx-4 z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Join TeamTasker</h1>
          <p className="text-gray-400 text-sm">Start organizing your team today</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 p-3 rounded-lg mb-6 text-sm text-center font-medium animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Full Name</label>
            <input 
              type="text" required
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder-gray-500"
              placeholder="John Doe"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Email Address</label>
            <input 
              type="email" required
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder-gray-500"
              placeholder="john@company.com"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Password</label>
            <input 
              type="password" required
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder-gray-500"
              placeholder="••••••••"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Role</label>
            <select 
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="Member" className="bg-gray-800">Member</option>
              <option value="Admin" className="bg-gray-800">Admin</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 mt-2"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-gray-400 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
