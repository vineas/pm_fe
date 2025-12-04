import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjectById } from "../../services/projectService";

import KanbanBoard from "../kanban/KanbanBoard";
import GanttChart from "../gantt/GanttChart";
import CurvaSChart from "../curva-s/CurvaSChart";

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        getProjectById(id).then((res) => setProject(res.data));
    }, [id]);

    if (!project) return <div>Loading...</div>;


    return (
        <div className="space-y-6">
            <KanbanBoard project={project} tasks={project.tasks} />
            {/* <GanttChart project={project} /> */}
            {/* <CurvaSChart project={project} /> */}
        </div>
    );
};

export default ProjectDetail;