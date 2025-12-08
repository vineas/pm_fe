import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjectById } from "../../services/projectService";
import axios from "axios";

import KanbanBoard from "../kanban/KanbanBoard";
import GanttChart from "../gantt/GanttChart";
import CurvaSChart from "../curva-s/CurvaSChart";

const ProjectDetail = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]); 

  useEffect(() => {
    const fetchProject = async () => {
      const res = await getProjectById(id);
      setProject(res.data);
      setTasks(res.data.tasks || []); 
    };

    fetchProject();
  }, [id]);

  if (!project) return <div>Loading...</div>;

  // ✅ CREATE TASK
  const handleCreateTask = async (payload) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/projects/${id}/tasks`,
        payload
      );

      setTasks((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Gagal create task:", err);
    }
  };

  // ✅ UPDATE TASK (STATUS, USER, DLL)
  const handleUpdateTask = (updatedTask) => {
  setTasks((prev) =>
    prev.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    )
  );
};

  return (
    <div className="space-y-6">
      <KanbanBoard
        project={project}
        tasks={tasks.filter((t) => t.project_id === project.id)}
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
      />

      {/* <GanttChart /> */}
      {/* <CurvaSChart project={project} /> */}
    </div>
  );
};

export default ProjectDetail;
