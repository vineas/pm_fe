import axios from 'axios'
const API = import.meta.env.VITE_API_URL

export const getProjects = () => axios.get(`${API}/projects`)
export const getProjectById = (id) => axios.get(`${API}/projects/${id}`)
export const createProject = (data) => axios.post(`${API}/projects`, data)
export const deleteProject = (id) => axios.delete(`${API}/projects/${id}`)
export const updateProject = (id, data) => axios.put(`${API}/projects/${id}`, data)

// Progress dihitung backend dari bobot Task
export const getProjectProgress = (id) => axios.get(`${API}/projects/${id}/progress`)