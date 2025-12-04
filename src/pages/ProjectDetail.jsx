import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getProjectById } from '../api/projectApi';
import KanbanDraggable from '../ui/KanbanDraggable';
import GanttHorizontal from '../ui/GanttHorizontal';
import CurvaForecast from '../ui/CurvaForeCast';
import TaskModal from '../components/TaskModal';
import { exportElementToPdf } from '../utils/exportPdf';

export default function ProjectDetail({ params }) {
  // if using react-router v6 useParams(); sample:
  // const { id } = useParams();
  const id = params?.id || window.location.pathname.split('/').pop();

  const { data: projectRes } = useQuery(['project', id], () => getProjectById(id), { enabled: !!id });
  const project = projectRes?.data;

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{project.name}</h2>
          <p className="text-sm text-gray-500">{project.deskripsi}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTaskModalOpen(true)} className="px-3 py-1 rounded bg-blue-600 text-white">+ Task</button>
          <button onClick={()=> exportElementToPdf('#report', `${project.name}-report.pdf`)} className="px-3 py-1 rounded border">Export PDF</button>
        </div>
      </div>

      <div id="report">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Task Board</h3>
            <KanbanDraggable tasks={project.tasks || []} projectId={project.id} onOpenTask={(t)=>{ setSelectedTask(t); setTaskModalOpen(true); }} />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Gantt</h3>
            <GanttHorizontal tasks={project.tasks || []} mode={project.gantchart_type || 'daily'} />
            <div className="mt-4">
              <CurvaForecast tasks={project.tasks || []} from={project.start_date} to={project.due_date} />
            </div>
          </div>
        </div>
      </div>

      <TaskModal open={taskModalOpen} onClose={()=>{ setTaskModalOpen(false); setSelectedTask(null); }} projectId={project.id} task={selectedTask} />
    </div>
  );
}