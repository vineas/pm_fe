import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Calendar, User } from 'lucide-react';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



const GanttChart = ({ projects = [], tasks = [] }) => {
  const [expandedProjects, setExpandedProjects] = useState({});
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

    // Auto-expand all projects
    const expanded = {};
    projects.forEach(project => {
      expanded[project.id] = true;
    });
    setExpandedProjects(expanded);
  }, [projects, tasks]);

  const toggleProject = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'bg-green-500';
      case 'inprogress': return 'bg-blue-500';
      case 'todo': return 'bg-gray-400';
      default: return 'bg-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Calculate date range for timeline
  const getDateRange = () => {
    if (projects.length === 0) return { minDate: new Date(), maxDate: new Date() };

    let minDate = new Date(projects[0].start_date);
    let maxDate = new Date(projects[0].due_date);

    projects.forEach(project => {
      const start = new Date(project.start_date);
      const end = new Date(project.due_date);
      if (start < minDate) minDate = start;
      if (end > maxDate) maxDate = end;
    });

    return { minDate, maxDate };
  };

  const calculatePosition = (startDate, endDate, minDate, maxDate) => {
  const totalDays = Math.max(
    (maxDate - minDate) / (1000 * 60 * 60 * 24),
    1
  );

  const startDays = (new Date(startDate) - minDate) / (1000 * 60 * 60 * 24);
  const duration = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

  const left = (startDays / totalDays) * 100;
  const width = (duration / totalDays) * 100;

  return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
};


  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Gantt Chart - Project Timeline</h2>
        <p className="text-gray-500 text-center py-8">Belum ada project untuk ditampilkan</p>
      </div>
    );
  }

  const { minDate, maxDate } = getDateRange();
  const monthHeaders = [];

  // Generate month headers
  let currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    monthHeaders.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  const exportToExcel = () => {
    const exportData = [];

    projects.forEach(project => {
      // Baris Project
      exportData.push({
        Type: "Project",
        Name: project.name,
        Start_Date: project.start_date,
        Due_Date: project.due_date,
        Status: project.status,
        Priority: project.priority,
        User: "",
        Bobot: ""
      });

      // Baris Task
      const projectTasks = groupedTasks[project.id] || [];
      projectTasks.forEach(task => {
        exportData.push({
          Type: "Task",
          Name: task.name,
          Start_Date: task.start_date,
          Due_Date: task.due_date,
          Status: task.status,
          Priority: "",
          User: task.user_name || "Unassigned",
          Bobot: task.bobot
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gantt Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(fileData, "gantt-chart.xlsx");
  };


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gantt Chart - Project Timeline</h2>
          <p className="text-gray-500 mt-1 text-sm">Kelola dan pantau progress proyek Anda</p>
        </div>

        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg shadow transition"
        >
          Export Excel
        </button>
      </div>


      <div className="overflow-auto" style={{ maxHeight: '600px' }}>
        <div className="flex">
          {/* Left Panel - Task List */}
          <div className="w-96 border-r border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50/30 flex-shrink-0">
            <div className="p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm font-semibold text-gray-700 sticky top-0 z-20">
              Task Name
            </div>
            {projects.map(project => (
              <div key={project.id}>
                <div
                  className="p-4 border-b border-gray-100 bg-white/60 hover:bg-white transition-colors cursor-pointer flex items-center justify-between"
                  onClick={() => toggleProject(project.id)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {expandedProjects[project.id] ?
                      <ChevronDown className="w-4 h-4 text-gray-600" /> :
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    }
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{project.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                        <span className={`${getPriorityColor(project.priority)} font-medium`}>
                          {project.priority?.toUpperCase() || 'MEDIUM'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(project.start_date)} - {formatDate(project.due_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedProjects[project.id] && groupedTasks[project.id]?.map(task => (
                  <div key={task.id} className="p-4 pl-12 border-b border-gray-100 bg-white/40 hover:bg-white/70 transition-colors">
                    <div className="font-medium text-gray-700 text-sm">{task.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {task.user_name || 'Unassigned'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full ${getStatusColor(task.status)} text-white text-xs`}>
                        {task.status}
                      </span>
                      <span>Bobot: {task.bobot}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Right Panel - Timeline */}
          <div className="flex-1 overflow-x-auto bg-gradient-to-br from-white to-blue-50/20">
            <div className="min-w-max">
              {/* Month Headers */}
              <div className="flex border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
                {monthHeaders.map((date, idx) => (
                  <div key={idx} className="px-4 py-4 text-center font-semibold text-gray-700 border-r border-gray-100" style={{ minWidth: '120px' }}>
                    {date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                  </div>
                ))}
              </div>

              {/* Timeline Grid */}
              <div className="relative">
                {projects.map(project => (
                  <div key={project.id}>
                    <div className="relative h-16 border-b border-gray-100" style={{ minWidth: `${monthHeaders.length * 120}px` }}>
                      <div
                        className={`absolute top-3 h-10 ${getStatusColor(project.status)} rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer`}
                        style={calculatePosition(project.start_date, project.due_date, minDate, maxDate)}
                        title={`${project.name}: ${formatDate(project.start_date)} - ${formatDate(project.due_date)}`}
                      >
                        <div className="px-3 py-2 text-white text-xs font-medium truncate">
                          {project.name}
                        </div>
                      </div>
                    </div>

                    {expandedProjects[project.id] && groupedTasks[project.id]?.map(task => (
                      <div key={task.id} className="relative h-16 border-b border-gray-50 bg-white/30" style={{ minWidth: `${monthHeaders.length * 120}px` }}>
                        <div
                          className={`absolute top-3 h-10 ${getStatusColor(task.status)} rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer opacity-90 hover:opacity-100`}
                          style={calculatePosition(task.start_date, task.due_date, minDate, maxDate)}
                          title={`${task.name}: ${formatDate(task.start_date)} - ${formatDate(task.due_date)}`}
                        >
                          <div className="px-3 py-2 text-white text-xs truncate">
                            {task.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded shadow-sm"></div>
          <span className="text-sm text-gray-600">Done</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded shadow-sm"></div>
          <span className="text-sm text-gray-600">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded shadow-sm"></div>
          <span className="text-sm text-gray-600">To Do</span>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;