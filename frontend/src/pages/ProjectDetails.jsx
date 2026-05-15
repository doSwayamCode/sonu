import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { FolderOpen, Users, ArrowLeft, Calendar, Flag, CheckSquare } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setData(response.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  const renderDescription = (text) => {
    if (!text) return 'No description provided.';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{part}</a>;
      }
      return part;
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  if (!data) return <div className="p-8 text-center text-gray-400">Project not found</div>;

  const { project, tasks } = data;

  return (
    <div className="space-y-8 animate-fade-in">
      <button 
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium"
      >
        <ArrowLeft size={18} /> Back to Projects
      </button>

      <div className="glass-card p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8 pb-8 border-b border-gray-700/50">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-900/50 to-indigo-900/50 flex items-center justify-center text-blue-400 flex-shrink-0">
            <FolderOpen size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">{project.title}</h2>
            <p className="text-sm font-medium text-gray-400 mt-2 flex items-center gap-2">
              <Users size={16}/> {project.members.length} {project.members.length === 1 ? 'Member' : 'Members'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-3">About this Project</h3>
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                  {renderDescription(project.description)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckSquare className="text-indigo-400" /> Project Tasks
                <span className="bg-indigo-900/30 text-indigo-400 border border-indigo-800 text-xs py-1 px-2 rounded-full ml-2">{tasks.length}</span>
              </h3>
              
              {tasks.length === 0 ? (
                <div className="text-center p-8 bg-gray-800/50 rounded-xl border border-gray-700">
                  <p className="text-gray-400 font-medium">No tasks assigned to this project yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task._id} className="p-4 bg-gray-800/80 border border-gray-700 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md transition-shadow">
                      <div>
                        <h4 className="font-bold text-white">{task.title}</h4>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 font-medium">
                          <span className={`px-2 py-1 rounded-md flex items-center gap-1 ${
                            task.status === 'Completed' ? 'bg-emerald-900/30 text-emerald-400' : 
                            task.status === 'In Progress' ? 'bg-blue-900/30 text-blue-400' : 'bg-amber-900/30 text-amber-400'
                          }`}>
                            {task.status}
                          </span>
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <Calendar size={12}/> {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold border flex items-center gap-1 ${
                          task.priority === 'High' ? 'bg-red-900/30 text-red-400 border-red-800' : 
                          task.priority === 'Medium' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' : 'bg-emerald-900/30 text-emerald-400 border-emerald-800'
                        }`}>
                          <Flag size={12} className={task.priority === 'High' ? 'fill-red-400' : ''} /> {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="text-blue-400" /> Team Members
            </h3>
            <div className="space-y-3">
              {project.members.map(m => (
                <div key={m._id} className="flex items-center gap-3 p-3 bg-gray-800/80 border border-gray-700 shadow-sm rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {m.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-white text-sm truncate">{m.name}</p>
                    <p className="text-xs text-gray-400 truncate">{m.email}</p>
                  </div>
                </div>
              ))}
              {project.members.length === 0 && (
                <p className="text-sm text-gray-400 italic p-3">No members assigned.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
