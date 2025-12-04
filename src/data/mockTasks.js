export const  mockTasks = [
  {
    id: 1,
    project_id: 1,
    name: "Design Homepage",
    description: "Create mockups for homepage",
    priority: "high",
    bobot: 30,
    start_date: "2025-01-01",
    due_date: "2025-01-15",
    status: "done",
    users: [2]
  },
  {
    id: 2,
    project_id: 1,
    name: "Develop Frontend",
    description: "Implement React components",
    priority: "high",
    bobot: 40,
    start_date: "2025-01-16",
    due_date: "2025-02-28",
    status: "inprogress",
    users: [1, 2]
  },
  {
    id: 3,
    project_id: 1,
    name: "Testing & QA",
    description: "Test all functionalities",
    priority: "medium",
    bobot: 30,
    start_date: "2025-03-01",
    due_date: "2025-03-31",
    status: "todo",
    users: [1]
  }
];