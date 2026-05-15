import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, CheckSquare, Calendar, Flag, User, Trash2 } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'Admin';

  const fetchData = async () => {
    try {
      const [tasksRes, projRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        isAdmin ? api.get('/projects') : Promise.resolve({ data: [] }),
        isAdmin ? api.get('/users') : Promise.resolve({ data: [] })
      ]);
      setTasks(tasksRes.data);
      if (isAdmin) {
        setProjects(projRes.data);
        setUsers(usersRes.data);
      }
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
    if (!title || !projectId) return alert('Title and Project are required');
    try {
      await api.post('/tasks', { title, description, projectId, assignedTo, dueDate, priority });
      setTitle(''); setDescription(''); setProjectId(''); setAssignedTo(''); setDueDate(''); setPriority('Medium');
      setIsCreating(false);
      fetchData();
    } catch (err) {
      alert('Error creating task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchData();
    } catch (err) {
      alert('Error deleting task');
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
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tasks</h2>
          <p className="text-gray-500 mt-1 text-sm">Track your to-dos, assignments, and deadlines.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 font-medium"
          >
            <Plus size={20} />
            {isCreating ? 'Cancel' : 'New Task'}
          </button>
        )}
      </div>

      {isCreating && isAdmin && (
        <div className="glass-card p-6 sm:p-8 animate-fade-in border-l-4 border-l-indigo-500">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CheckSquare className="text-indigo-500" /> Create Task
          </h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Task Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                className="input-field" placeholder="What needs to be done?" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                className="input-field" rows="2" placeholder="Add more details..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Project</label>
              <select required value={projectId} onChange={e => setProjectId(e.target.value)}
                className="input-field bg-white">
                <option value="" disabled>Select a project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Assign To</label>
              <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
                className="input-field bg-white">
                <option value="">Unassigned</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}
                className="input-field bg-white">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="md:col-span-2 mt-4 flex justify-end">
              <button type="submit" className="btn-primary w-full sm:w-auto px-8">
                Save Task
              </button>
            </div>
          </form>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="glass-card p-16 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4 border border-indigo-100">
            <CheckSquare className="text-indigo-400" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No Tasks Found</h3>
          <p className="text-gray-500 mt-2 max-w-sm">You don't have any tasks right now. Time to take a coffee break!</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Task Info</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  {isAdmin && <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-transparent">
                {tasks.map((task, i) => (
                  <tr key={task._id} className="hover:bg-white/60 transition-colors duration-200 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{task.title}</span>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1">
                            {task.projectId?.title || 'No Project'}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                              <Calendar size={12}/> {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {task.assignedTo ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                              {task.assignedTo.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{task.assignedTo.name}</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400 italic flex items-center gap-1"><User size={14}/> Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md border
                        ${task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 
                          task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        <Flag size={12} className={task.priority === 'High' ? 'fill-red-700' : ''} /> {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="relative group">
                        <select 
                          value={task.status} 
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          className={`appearance-none font-bold text-sm pl-3 pr-8 py-1.5 rounded-lg outline-none cursor-pointer border shadow-sm transition-all focus:ring-2
                            ${task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500/20' : 
                              task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500/20' : 
                              'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500/20'}`}
                        >
                          <option value="Todo" className="text-gray-900 font-medium">Todo</option>
                          <option value="In Progress" className="text-gray-900 font-medium">In Progress</option>
                          <option value="Completed" className="text-gray-900 font-medium">Completed</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-5 whitespace-nowrap text-center text-sm font-medium">
                        <button 
                          onClick={() => handleDelete(task._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                          title="Delete Task"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
