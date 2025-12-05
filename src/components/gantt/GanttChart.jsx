import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// =========================================================
// Gantt & S-Curve Component Based on Your Data Structure
// project: { id, name, start_date, due_date }
// task: { id, project_id, name, start_date, due_date, bobot, status }
// =========================================================

export default function GanttChart({ project = null, tasks = [] }) {
  if (!project || !tasks.length) {
    return <div className="p-4 text-gray-500">Loading Gantt & S-Curve...</div>;
  }

  const projectTasks = tasks.filter((t) => t.project_id === project.id);

  // ==============================
  // DATE HELPERS
  // ==============================
  const toDate = (d) => new Date(d);
  const dayMs = 1000 * 60 * 60 * 24;

  const projectStart = toDate(project.start_date);
  const projectEnd = toDate(project.due_date);
  const totalDays = Math.round((projectEnd - projectStart) / dayMs) + 1;

  // ==============================
  // GANTT BAR POSITION
  // ==============================
  const getTaskPosition = (startDate, dueDate) => {
    const taskStart = toDate(startDate);
    const taskEnd = toDate(dueDate);

    const startOffset = (taskStart - projectStart) / dayMs;
    const duration = (taskEnd - taskStart) / dayMs;

    return {
      left: (startOffset / totalDays) * 100,
      width: (duration / totalDays) * 100,
    };
  };

  // ==============================
  // S-CURVE CALCULATION
  // ==============================
  const sCurveData = useMemo(() => {
    const result = [];

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(projectStart.getTime() + i * dayMs);

      let cumulative = 0;

      projectTasks.forEach((task) => {
        const taskStart = toDate(task.start_date);
        const taskEnd = toDate(task.due_date);
        const taskDuration = (taskEnd - taskStart) / dayMs;

        if (currentDate >= taskEnd) {
          cumulative += task.bobot;
        } else if (currentDate >= taskStart) {
          const passed = (currentDate - taskStart) / dayMs;
          cumulative += (passed / taskDuration) * task.bobot;
        }
      });

      result.push({
        day: i + 1,
        progress: Math.min(Math.round(cumulative), 100),
      });
    }

    return result;
  }, [projectTasks, projectStart, totalDays]);

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">{project.name}</h1>

      {/* ======================= */}
      {/* GANTT CHART */}
      {/* ======================= */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Gantt Chart</h2>

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* HEADER */}
            <div className="flex pb-2 mb-4">
              <div className="w-56 font-semibold">Task</div>
              <div className="flex-1 text-xs text-gray-600 flex justify-between">
                <span>{project.start_date}</span>
                <span>{project.due_date}</span>
              </div>
            </div>

            {/* TASK ROWS */}
            {projectTasks.map((task) => {
              const pos = getTaskPosition(task.start_date, task.due_date);

              return (
                <div key={task.id} className="flex items-center mb-3">
                  <div className="w-56 text-sm font-medium truncate">{task.name}</div>
                  <div className="flex-1 relative h-8">
                    <div className="absolute inset-0 bg-gray-100 rounded" />
                    <div
                      className={`absolute h-full rounded ${
                        task.status === "done"
                          ? "bg-green-500"
                          : task.status === "inprogress"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                      }`}
                      style={{ left: `${pos.left}%`, width: `${pos.width}%` }}
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

      {/* ======================= */}
      {/* S-CURVE */}
      {/* ======================= */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">S-Curve Progress</h2>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={sCurveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="progress" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="text-sm text-gray-600 mt-2">
          Kurva-S menunjukkan akumulasi bobot pekerjaan terhadap waktu.
        </div>
      </div>
    </div>
  );
}
