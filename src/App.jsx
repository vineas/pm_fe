import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { mockProjects } from "./data/mockProjects";
import { mockTasks } from "./data/mockTasks";
import { mockUsers } from "./data/mockUsers";

import Dashboard from "./components/dashboard/Dashoard";
import ProjectList from "./components/projects/ProjectList";
import ProjectDetail from "./components/projects/ProjectDetail";

import Header from "./components/layout/Header";
import Navbar from "./components/layout/Navbar";

const App = () => {
  const currentUser = mockUsers[0];

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header currentUser={currentUser} />
        <Navbar />

        <main className="max-w-7xl mx-auto p-6">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  projects={mockProjects}
                  tasks={mockTasks}
                  currentUser={currentUser}
                />
              }
            />

            <Route
              path="/projects"
              element={
                <ProjectList
                  projects={mockProjects}
                  tasks={mockTasks}
                  currentUser={currentUser}
                />
              }
            />

            <Route
              path="/projects/:id"
              element={
                <ProjectDetail
                  projects={mockProjects}
                  tasks={mockTasks}
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
