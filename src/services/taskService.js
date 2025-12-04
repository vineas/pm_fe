import api from "./api";

// ✅ GET TASKS BY PROJECT
export const getTasksByProject = (projectId) =>
  api.get(`/projects/${projectId}/tasks`);

// ✅ CREATE TASK
export const createTask = (projectId, payload) =>
  api.post(`/projects/${projectId}/tasks`, payload);

// ✅ UPDATE TASK
export const updateTask = (id, payload) =>
  api.put(`/tasks/${id}`, payload);

// ✅ DELETE TASK (opsional tapi penting)
export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`);
