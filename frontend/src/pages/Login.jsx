import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#121215]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="w-full max-w-md p-8 bg-[#1a1a24] border border-gray-800 shadow-xl rounded-2xl animate-fade-in mx-4 z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">TeamTasker</h1>
          <p className="text-gray-400 text-sm">Sign in to your workspace</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 p-3 rounded-lg mb-6 text-sm text-center font-medium animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Email Address</label>
            <input 
              type="email" required
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-gray-500"
              placeholder="name@company.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Password</label>
            <input 
              type="password" required
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-gray-500"
              placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 mt-4"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-gray-400 font-medium">
          New to TeamTasker?{' '}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
