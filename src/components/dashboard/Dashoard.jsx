
import React from 'react';
import { BarChart3, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import StatCard from './StatCard.jsx';
import { calculateProjectProgress } from '../../utils/calculateProjectProgress.js';



const Dashboard = ({ projects, tasks, currentUser }) => {
  const userProjects = currentUser.role === 'super_admin' 
    ? projects 
    : projects.filter(p => p.users.includes(currentUser.id));

  const stats = {
    totalProjects: userProjects.length,
    totalTasks: tasks.filter(t => userProjects.some(p => p.id === t.project_id)).length,
    completedTasks: tasks.filter(t => t.status === 'done' && userProjects.some(p => p.id === t.project_id)).length,
    inProgressProjects: userProjects.filter(p => p.status === 'inprogress').length
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<BarChart3 />} label="Total Projects" value={stats.totalProjects} color="blue" />
        <StatCard icon={<CheckCircle />} label="Total Tasks" value={stats.totalTasks} color="green" />
        <StatCard icon={<Clock />} label="Completed Tasks" value={stats.completedTasks} color="purple" />
        <StatCard icon={<TrendingUp />} label="In Progress" value={stats.inProgressProjects} color="orange" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Project Progress</h2>
        <div className="space-y-4">
          {userProjects.map(project => (
            <div key={project.id} className="  pb-4 last:border-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{project.name}</span>
                <span className="text-sm text-gray-600">{calculateProjectProgress(project.id, tasks)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${calculateProjectProgress(project.id, tasks)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;