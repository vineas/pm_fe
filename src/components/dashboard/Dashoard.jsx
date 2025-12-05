import React from "react";
import { BarChart3, CheckCircle, Clock, TrendingUp } from "lucide-react";
import StatCard from "./StatCard.jsx";
import { calculateProjectProgress } from "../../utils/calculateProjectProgress.js";

const Dashboard = ({ projects = [], tasks = [], currentUser }) => {
  const userProjects = projects;

  // ✅ FIX STAT SESUAI API
  const stats = {
    totalProjects: userProjects.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === "done").length,
    inProgressProjects: userProjects.filter(p => p.status === "inprogress").length
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* ✅ STAT CARD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<BarChart3 />} label="Total Projects" value={stats.totalProjects} color="blue" />
        <StatCard icon={<CheckCircle />} label="Total Tasks" value={stats.totalTasks} color="green" />
        <StatCard icon={<Clock />} label="Completed Tasks" value={stats.completedTasks} color="purple" />
        <StatCard icon={<TrendingUp />} label="In Progress" value={stats.inProgressProjects} color="orange" />
      </div>

      {/* ✅ PROJECT PROGRESS */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Project Progress</h2>

        {userProjects.length === 0 ? (
          <p className="text-gray-500">Belum ada project</p>
        ) : (
          <div className="space-y-4">
            {userProjects.map((project) => (
              <div key={project.id} className="pb-4 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{project.name}</span>
                  <span className="text-sm text-gray-600">
                    {calculateProjectProgress(project.id, tasks)}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${calculateProjectProgress(project.id, tasks)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}


      </div>
    </div>
  );
};

export default Dashboard;
