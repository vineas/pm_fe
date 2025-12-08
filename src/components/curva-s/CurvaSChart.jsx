import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Calendar, TrendingUp, Award, AlertCircle } from 'lucide-react';

const CurvaSChart = ({ projects = [], tasks = [] }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [curvaData, setCurvaData] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});

  useEffect(() => {
    // Group tasks by project_id
    const grouped = tasks.reduce((acc, task) => {
      if (!acc[task.project_id]) {
        acc[task.project_id] = [];
      }
      acc[task.project_id].push(task);
      return acc;
    }, {});
    setGroupedTasks(grouped);

    // Set first project as default
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id);
    }
  }, [projects, tasks]);

  useEffect(() => {
    if (selectedProject && groupedTasks[selectedProject]) {
      generateCurvaData(selectedProject);
    }
  }, [selectedProject, groupedTasks]);

  const generateCurvaData = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    const projectTasks = groupedTasks[projectId];
    
    if (!project || !projectTasks || projectTasks.length === 0) {
      setCurvaData([]);
      return;
    }

    const startDate = new Date(project.start_date);
    const endDate = new Date(project.due_date);
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    const data = [];
    
    // Calculate total weight
    const totalBobot = projectTasks.reduce((sum, task) => sum + (task.bobot || 0), 0);
    
    if (totalBobot === 0) {
      setCurvaData([]);
      return;
    }
    
    // Generate daily data points
    for (let i = 0; i <= totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Planned progress (S-curve: slow start, fast middle, slow end)
      const progress = i / totalDays;
      const plannedProgress = 100 * (3 * Math.pow(progress, 2) - 2 * Math.pow(progress, 3));
      
      // Actual progress based on completed tasks
      let actualProgress = 0;
      projectTasks.forEach(task => {
        if (task.status === 'done' && task.done_date) {
          const taskDoneDate = new Date(task.done_date);
          if (taskDoneDate <= currentDate) {
            actualProgress += (task.bobot / totalBobot) * 100;
          }
        }
      });
      
      // For in-progress tasks, add partial completion
      projectTasks.forEach(task => {
        if (task.status === 'inprogress') {
          const taskStart = new Date(task.start_date);
          const taskEnd = new Date(task.due_date);
          if (currentDate >= taskStart && currentDate <= taskEnd) {
            const taskDuration = (taskEnd - taskStart) / (1000 * 60 * 60 * 24);
            const taskProgress = (currentDate - taskStart) / (1000 * 60 * 60 * 24);
            const taskCompletion = Math.min(taskProgress / taskDuration, 1);
            actualProgress += (task.bobot / totalBobot) * 100 * taskCompletion * 0.5; // 50% estimate for in-progress
          }
        }
      });
      
      data.push({
        date: currentDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        planned: Math.round(plannedProgress * 10) / 10,
        actual: Math.round(actualProgress * 10) / 10,
        deviation: Math.round((actualProgress - plannedProgress) * 10) / 10
      });
    }
    
    setCurvaData(data);
  };

  const calculateProjectStats = () => {
    if (!selectedProject || !groupedTasks[selectedProject]) return null;
    
    const projectTasks = groupedTasks[selectedProject];
    const totalBobot = projectTasks.reduce((sum, task) => sum + (task.bobot || 0), 0);
    
    if (totalBobot === 0) return null;
    
    const completedBobot = projectTasks
      .filter(task => task.status === 'done')
      .reduce((sum, task) => sum + (task.bobot || 0), 0);
    const inProgressBobot = projectTasks
      .filter(task => task.status === 'inprogress')
      .reduce((sum, task) => sum + (task.bobot || 0), 0);
    
    const completionPercentage = (completedBobot / totalBobot) * 100;
    const project = projects.find(p => p.id === selectedProject);
    
    // Calculate days progress
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.due_date);
    const today = new Date();
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const elapsedDays = (today - startDate) / (1000 * 60 * 60 * 24);
    const timeProgress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
    
    return {
      completionPercentage: Math.round(completionPercentage * 10) / 10,
      timeProgress: Math.round(timeProgress * 10) / 10,
      totalTasks: projectTasks.length,
      completedTasks: projectTasks.filter(t => t.status === 'done').length,
      inProgressTasks: projectTasks.filter(t => t.status === 'inprogress').length,
      status: completionPercentage >= timeProgress ? 'ahead' : 'behind',
      deviation: Math.round((completionPercentage - timeProgress) * 10) / 10
    };
  };

  const stats = calculateProjectStats();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-semibold text-gray-800 mb-2">{payload[0].payload.date}</p>
          <p className="text-sm text-blue-600">
            Rencana: <span className="font-semibold">{payload[0].value}%</span>
          </p>
          <p className="text-sm text-green-600">
            Aktual: <span className="font-semibold">{payload[1].value}%</span>
          </p>
          <p className={`text-sm ${payload[1].value >= payload[0].value ? 'text-green-600' : 'text-red-600'}`}>
            Deviasi: <span className="font-semibold">{payload[1].payload.deviation}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Curva S - Project Progress</h2>
        <p className="text-gray-500 text-center py-8">Belum ada project untuk ditampilkan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Curva S - Project Progress</h2>
        <p className="text-gray-600 text-sm">Analisis kemajuan proyek dengan metode Curva S</p>
      </div>

      {/* Project Selector */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Pilih Proyek</label>
        <select 
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          value={selectedProject || ''}
          onChange={(e) => setSelectedProject(Number(e.target.value))}
        >
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name} - {project.status?.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {stats && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Progress Aktual</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completionPercentage}%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Progress Waktu</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.timeProgress}%</p>
                </div>
                <Calendar className="w-10 h-10 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tasks Selesai</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.completedTasks}/{stats.totalTasks}
                  </p>
                </div>
                <Award className="w-10 h-10 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className={`text-2xl font-bold ${stats.status === 'ahead' ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.status === 'ahead' ? 'On Track' : 'Behind'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stats.deviation > 0 ? '+' : ''}{stats.deviation}%</p>
                </div>
                <AlertCircle className={`w-10 h-10 ${stats.status === 'ahead' ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </div>
          </div>

          {/* Curva S Chart */}
          {curvaData.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Grafik Curva S</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={curvaData}>
                  <defs>
                    <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="#6B7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6B7280"
                    domain={[0, 100]}
                    label={{ value: 'Progress (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                  />
                  <Area
                    type="monotone"
                    dataKey="planned"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fill="url(#colorPlanned)"
                    name="Rencana"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#10B981"
                    strokeWidth={3}
                    fill="url(#colorActual)"
                    name="Aktual"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Task Progress Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Detail Progress Task</h3>
            <div className="space-y-3">
              {groupedTasks[selectedProject]?.map(task => (
                <div key={task.id} className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{task.name}</h4>
                      <p className="text-sm text-gray-600">Bobot: {task.bobot}%</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        task.status === 'done' ? 'bg-green-100 text-green-700' :
                        task.status === 'inprogress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.status === 'done' ? 'Selesai' : 
                         task.status === 'inprogress' ? 'Dikerjakan' : 'Belum'}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        task.status === 'done' ? 'bg-green-500' :
                        task.status === 'inprogress' ? 'bg-blue-500' :
                        'bg-gray-400'
                      }`}
                      style={{ width: `${task.status === 'done' ? 100 : task.status === 'inprogress' ? 50 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurvaSChart;