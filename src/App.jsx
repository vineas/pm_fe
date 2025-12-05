import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Dashboard from "./components/dashboard/Dashoard";
import ProjectList from "./components/projects/ProjectList";
import ProjectDetail from "./components/projects/ProjectDetail";
import Navbar from "./components/layout/Navbar";
import GanttChart from "./components/gantt/GanttChart";


const App = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/users/1`);
      setCurrentUser(userRes.data);

      const projectRes = await axios.get(`${import.meta.env.VITE_API_URL}/projects`);
      setProjects(projectRes.data);
      console.log("PROJECT API:", projectRes.data);


      const allTasks = [];
      for (const project of projectRes.data) {
        const taskRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/projects/${project.id}/tasks`
        );
        allTasks.push(...taskRes.data);
      }
      setTasks(allTasks);

    } catch (error) {
      console.error("Gagal fetch data:", error);
    }
  };

  if (!currentUser) return <div className="p-6">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="md:ml-64 p-6 min-h-screen">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  projects={projects}
                  tasks={tasks}
                  currentUser={currentUser}
                />
              }
            />

            <Route
              path="/projects"
              element={
                <ProjectList
                  projects={projects}
                  tasks={tasks}
                  currentUser={currentUser}
                />
              }
            />

            {/* ✅ INI YANG TADI ERROR */}
            <Route
              path="/projects/:id"
              element={
                <ProjectDetail
                  projects={projects}
                  tasks={tasks}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
