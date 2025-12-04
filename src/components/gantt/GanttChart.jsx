
import React from 'react';

const GanttChart = ({ project, tasks }) => {
  const projectTasks = tasks.filter(t => t.project_id === project.id);
  
  const getTaskPosition = (startDate, dueDate) => {
    const projectStart = new Date(project.start_date);
    const projectEnd = new Date(project.due_date);
    const taskStart = new Date(startDate);
    const taskEnd = new Date(dueDate);
    
    const totalDays = (projectEnd - projectStart) / (1000 * 60 * 60 * 24);
    const startOffset = (taskStart - projectStart) / (1000 * 60 * 60 * 24);
    const duration = (taskEnd - taskStart) / (1000 * 60 * 60 * 24);
    
    return {
      left: (startOffset / totalDays) * 100,
      width: (duration / totalDays) * 100
    };
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Gantt Chart - {project.name}</h2>
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="flex   pb-2 mb-4">
            <div className="w-48 font-semibold">Task Name</div>
            <div className="flex-1 relative">
              <div className="flex justify-between text-xs text-gray-600">
                <span>{project.start_date}</span>
                <span>{project.due_date}</span>
              </div>
            </div>
          </div>

          {projectTasks.map(task => {
            const pos = getTaskPosition(task.start_date, task.due_date);
            return (
              <div key={task.id} className="flex items-center mb-3">
                <div className="w-48 text-sm font-medium truncate">{task.name}</div>
                <div className="flex-1 relative h-8">
                  <div className="absolute inset-0 bg-gray-100 rounded" />
                  <div 
                    className={`absolute h-full rounded ${
                      task.status === 'done' ? 'bg-green-500' : 
                      task.status === 'inprogress' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ 
                      left: `${pos.left}%`, 
                      width: `${pos.width}%` 
                    }}
                  >
                    <span className="text-xs text-white px-2 leading-8">{task.bobot}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default GanttChart;