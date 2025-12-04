import axios from 'axios'
const API = import.meta.env.VITE_API_URL

export const getTasksByProject = (pid) => axios.get(`${API}/projects/${pid}/tasks`)
export const createTask = (pid,data) => axios.post(`${API}/projects/${pid}/tasks`,data)
export const updateTaskStatus = (taskId, payload) => {
  // backend earlier had: POST /projects/:projectId/tasks/:id/status OR POST /projects/:projectId/tasks/:id/status
  // I will call generic PUT /projects/:projectId/tasks/:id if available; otherwise use /tasks/:id
  return axios.patch(`${API}/tasks/${taskId}/status`, payload)
}