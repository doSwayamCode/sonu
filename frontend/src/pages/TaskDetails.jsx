import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, CheckSquare, Save, Trash2 } from 'lucide-react';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Todo');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'Admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, projRes, usersRes] = await Promise.all([
          api.get(`/tasks/${id}`),
          isAdmin ? api.get('/projects') : Promise.resolve({ data: [] }),
          isAdmin ? api.get('/users') : Promise.resolve({ data: [] })
        ]);
        
        const t = taskRes.data;
        setTask(t);
        setTitle(t.title);
        setDescription(t.description);
        setProjectId(t.projectId?._id || '');
        setAssignedTo(t.assignedTo?._id || '');
        setDueDate(t.dueDate ? t.dueDate.substring(0, 10) : '');
        setPriority(t.priority);
        setStatus(t.status);

        if (isAdmin) {
          setProjects(projRes.data);
          setUsers(usersRes.data);
        }
      } catch (err) {
        console.error(err);
        alert('Failed to load task details');
        navigate('/tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isAdmin, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (isAdmin) {
        await api.patch(`/tasks/${id}`, { title, description, projectId, assignedTo, dueDate, priority, status });
      } else {
        await api.patch(`/tasks/${id}`, { status });
      }
      alert('Task updated successfully!');
      navigate('/tasks');
    } catch (err) {
      alert('Error updating task');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      navigate('/tasks');
    } catch (err) {
      alert('Error deleting task');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  if (!task) return <div className="p-8 text-center text-gray-400">Task not found</div>;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/tasks')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium"
      >
        <ArrowLeft size={18} /> Back to Tasks
      </button>

      <div className="glass-card p-6 sm:p-10 border-t-4 border-t-indigo-500">
        <div className="flex justify-between items-center mb-8 border-b border-gray-700/50 pb-6">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <CheckSquare className="text-indigo-400" size={32} />
            Task View / Edit
          </h2>
          {isAdmin && (
            <button 
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 px-4 py-2 rounded-xl transition-colors font-medium"
            >
              <Trash2 size={18} /> Delete
            </button>
          )}
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Task Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                className="input-field text-lg font-semibold" placeholder="Task title" disabled={!isAdmin} />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                className="input-field min-h-[120px]" placeholder="Detailed description..." disabled={!isAdmin} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Project</label>
              {isAdmin ? (
                <select required value={projectId} onChange={e => setProjectId(e.target.value)}
                  className="input-field bg-gray-800 text-white">
                  <option value="" disabled>Select a project</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                </select>
              ) : (
                <div className="input-field bg-gray-800/50 opacity-70">{task.projectId?.title || 'None'}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Assign To</label>
              {isAdmin ? (
                <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
                  className="input-field bg-gray-800 text-white">
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              ) : (
                <div className="input-field bg-gray-800/50 opacity-70">{task.assignedTo?.name || 'Unassigned'}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Due Date</label>
              {isAdmin ? (
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                  className="input-field text-white" />
              ) : (
                <div className="input-field bg-gray-800/50 opacity-70">{dueDate || 'No due date'}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Priority</label>
              {isAdmin ? (
                <select value={priority} onChange={e => setPriority(e.target.value)}
                  className="input-field bg-gray-800 text-white">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              ) : (
                <div className="input-field bg-gray-800/50 opacity-70">{priority}</div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className={`input-field font-bold text-white ${
                  status === 'Completed' ? 'bg-emerald-900/40 border-emerald-800' : 
                  status === 'In Progress' ? 'bg-blue-900/40 border-blue-800' : 'bg-amber-900/40 border-amber-800'
                }`}>
                <option value="Todo" className="bg-gray-800 text-white">Todo</option>
                <option value="In Progress" className="bg-gray-800 text-white">In Progress</option>
                <option value="Completed" className="bg-gray-800 text-white">Completed</option>
              </select>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700/50 flex justify-end">
            <button type="submit" className="btn-primary w-full sm:w-auto px-10 flex items-center justify-center gap-2">
              <Save size={20} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskDetails;
