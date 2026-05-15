import React, { useState, useEffect } from 'react';
import api from '../api';
import { CheckCircle2, Clock, AlertCircle, FileText, ArrowRight, Folder } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get('/tasks');
        setTasks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const pending = tasks.filter(t => t.status !== 'Completed').length;
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length;

  const stats = [
    { label: 'Total Tasks', value: total, icon: <FileText size={28} className="text-blue-400" />, bg: 'bg-blue-900/30', glow: 'shadow-blue-900/20' },
    { label: 'Completed', value: completed, icon: <CheckCircle2 size={28} className="text-emerald-400" />, bg: 'bg-emerald-900/30', glow: 'shadow-emerald-900/20' },
    { label: 'Pending', value: pending, icon: <Clock size={28} className="text-amber-400" />, bg: 'bg-amber-900/30', glow: 'shadow-amber-900/20' },
    { label: 'Overdue', value: overdue, icon: <AlertCircle size={28} className="text-rose-400" />, bg: 'bg-rose-900/30', glow: 'shadow-rose-900/20' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Overview</h2>
        <p className="text-gray-400 mt-1 text-sm">Track your team's progress and stay on top of your tasks.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`glass-card p-6 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300 shadow-lg ${stat.glow}`}>
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-4xl font-extrabold text-white mt-2">{stat.value}</p>
            </div>
            <div className={`p-4 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-gray-700/50 flex justify-between items-center bg-gray-800/30">
          <h3 className="text-xl font-bold text-gray-100">Recent Tasks</h3>
          {/* <Link to="/tasks" className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group">
            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link> */}
        </div>
        
        {tasks.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="text-gray-600" size={32} />
            </div>
            <p className="text-gray-500 font-medium">No tasks assigned yet. You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/50">
            {tasks.slice(0, 5).map((task, i) => (
              <div key={task._id} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-gray-800/40 transition-colors gap-4" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    task.status === 'Completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' :
                    task.status === 'In Progress' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' :
                    'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                  }`} />
                  <div>
                    <p className="font-semibold text-white">{task.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1 bg-gray-800 px-2 py-0.5 rounded-md">
                        <Folder size={12} /> {task.projectId?.title || 'Unknown Project'}
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <span className={`self-start sm:self-auto px-3 py-1 text-xs font-bold rounded-full border ${
                  task.status === 'Completed' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' :
                  task.status === 'In Progress' ? 'bg-blue-900/30 text-blue-400 border-blue-800' :
                  'bg-amber-900/30 text-amber-400 border-amber-800'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
