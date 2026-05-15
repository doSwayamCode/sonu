import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Plus, Users, FolderOpen, Trash2, Search } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderDescription = (text) => {
    if (!text) return 'No description provided.';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>{part}</a>;
      }
      return part;
    });
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'Admin';

  const fetchData = async () => {
    try {
      const [projRes, usersRes] = await Promise.all([
        api.get('/projects'),
        isAdmin ? api.get('/users') : Promise.resolve({ data: [] })
      ]);
      setProjects(projRes.data);
      if (isAdmin) setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) return alert('Title is required');
    try {
      await api.post('/projects', { title, description, members: selectedMembers });
      setTitle(''); setDescription(''); setSelectedMembers([]);
      setIsCreating(false);
      fetchData();
    } catch (err) {
      alert('Error creating project');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? All associated tasks will also be deleted.')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchData();
    } catch (err) {
      alert('Error deleting project');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Projects</h2>
          <p className="text-gray-400 mt-1 text-sm">Manage and organize your team's workspaces.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl outline-none text-white focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsCreating(!isCreating)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 font-medium w-full sm:w-auto flex-shrink-0"
            >
              <Plus size={20} />
              {isCreating ? 'Cancel' : 'New Project'}
            </button>
          )}
        </div>
      </div>

      {isCreating && isAdmin && (
        <div className="glass-card p-6 sm:p-8 animate-fade-in border-l-4 border-l-blue-500">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FolderOpen className="text-blue-500" /> Create Workspace
          </h3>
          <form onSubmit={handleCreate} className="space-y-5 max-w-2xl">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Project Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                className="input-field" placeholder="e.g. Q3 Marketing Campaign" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                className="input-field" rows="3" placeholder="What is this project about?" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Assign Members</label>
              <select multiple value={selectedMembers} onChange={e => setSelectedMembers(Array.from(e.target.selectedOptions, option => option.value))}
                className="input-field h-32 bg-gray-800">
                {users.map(u => (
                  <option key={u._id} value={u._id} className="py-1">{u.name} ({u.email})</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><Users size={12}/> Hold Ctrl/Cmd to select multiple members</p>
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto mt-4 px-8">
              Launch Project
            </button>
          </form>
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="glass-card p-16 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700">
            <FolderOpen className="text-gray-500" size={40} />
          </div>
          <h3 className="text-xl font-bold text-white">No Projects Found</h3>
          <p className="text-gray-400 mt-2 max-w-sm">No projects match your search or you haven't created any yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((proj, i) => (
            <div key={proj._id} onClick={() => navigate(`/projects/${proj._id}`)} className="glass-card p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300 group relative cursor-pointer" style={{ animationDelay: `${i * 50}ms` }}>
              {isAdmin && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(proj._id); }}
                  className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/30 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Project"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900/50 to-indigo-900/50 flex items-center justify-center flex-shrink-0 text-blue-400 group-hover:scale-110 transition-transform">
                    <FolderOpen size={24} />
                  </div>
                  <h4 className="font-extrabold text-xl text-white line-clamp-1">{proj.title}</h4>
                </div>
                <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">{renderDescription(proj.description)}</p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Users size={14}/> Team</p>
                  <span className="text-xs font-semibold bg-gray-800 text-gray-300 px-2 py-1 rounded-full">{proj.members.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {proj.members.map((m, idx) => (
                    <div key={m._id} className="relative group/tooltip">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-white shadow-sm z-10 hover:z-20 transform hover:scale-110 transition-all cursor-help" style={{ marginLeft: idx > 0 ? '-10px' : '0' }}>
                        {m.name.charAt(0)}
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                        {m.name}
                      </div>
                    </div>
                  ))}
                  {proj.members.length === 0 && <span className="text-xs font-medium text-gray-500 italic">Unassigned</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
