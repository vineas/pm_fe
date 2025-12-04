import React from 'react';
const CurvaSChart = ({ project, tasks }) => {
  const projectTasks = tasks.filter(t => t.project_id === project.id);
  
  // Calculate cumulative progress over time
  const projectStart = new Date(project.start_date);
  const projectEnd = new Date(project.due_date);
  const totalDays = Math.ceil((projectEnd - projectStart) / (1000 * 60 * 60 * 24));
  
  const points = [];
  let cumulativeWeight = 0;
  
  // Sort tasks by due date
  const sortedTasks = [...projectTasks].sort((a, b) => 
    new Date(a.due_date) - new Date(b.due_date)
  );
  
  sortedTasks.forEach(task => {
    const taskDays = Math.ceil((new Date(task.due_date) - projectStart) / (1000 * 60 * 60 * 24));
    if (task.status === 'done') {
      cumulativeWeight += task.bobot;
    }
    points.push({ day: taskDays, progress: cumulativeWeight });
  });

  // Create SVG path
  const width = 600;
  const height = 300;
  const padding = 40;
  
  const totalWeight = projectTasks.reduce((sum, t) => sum + t.bobot, 0);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Curva S - {project.name}</h2>
      
      <svg width="100%" height="300" viewBox={`0 0 ${width} ${height}`} className="border rounded">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(pct => (
          <g key={pct}>
            <line 
              x1={padding} 
              y1={height - padding - (pct / 100) * (height - 2 * padding)} 
              x2={width - padding} 
              y2={height - padding - (pct / 100) * (height - 2 * padding)}
              stroke="#e5e7eb" 
              strokeWidth="1"
            />
            <text 
              x={padding - 10} 
              y={height - padding - (pct / 100) * (height - 2 * padding) + 4}
              fontSize="10" 
              textAnchor="end"
              fill="#6b7280"
            >
              {pct}%
            </text>
          </g>
        ))}
        
        {/* Planned curve (S-curve) */}
        <path
          d={`M ${padding} ${height - padding} 
              Q ${width / 2} ${padding} ${width - padding} ${padding + 20}`}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Actual progress */}
        {points.length > 0 && (
          <polyline
            points={points.map(p => {
              const x = padding + (p.day / totalDays) * (width - 2 * padding);
              const y = height - padding - (p.progress / totalWeight) * (height - 2 * padding);
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
          />
        )}
        
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#374151" strokeWidth="2" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#374151" strokeWidth="2" />
        
        {/* Labels */}
        <text x={width / 2} y={height - 10} fontSize="12" textAnchor="middle" fill="#374151">Days</text>
        <text x={10} y={height / 2} fontSize="12" textAnchor="middle" fill="#374151" transform={`rotate(-90, 10, ${height / 2})`}>Progress (%)</text>
      </svg>
      
      <div className="mt-4 flex gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-blue-500 border-dashed border-2" />
          <span className="text-sm text-gray-600">Planned</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-green-500" />
          <span className="text-sm text-gray-600">Actual</span>
        </div>
      </div>
    </div>
  );
};

export default CurvaSChart;