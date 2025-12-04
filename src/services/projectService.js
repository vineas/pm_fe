import api from "./api";

// LIST
export const getProjects = () => api.get("/projects");

// DETAIL
export const getProjectById = (id) => api.get(`/projects/${id}`);

// CREATE
export const createProject = (payload) => api.post("/projects", payload);

// UPDATE
export const updateProject = (id, payload) =>
    api.put(`/projects/${id}`, payload);

// DELETE
export const deleteProject = (id) =>
    api.delete(`/projects/${id}`);

// ASSIGN USERS
export const assignUsers = (id, userIds) =>
    api.post(`/projects/${id}/assign-users`, { userIds });

// PROGRESS
export const getProjectProgress = (id) =>
    api.get(`/projects/${id}/progress`);

// GANTT
export const getGantt = (id, mode = "daily") =>
    api.get(`/projects/${id}/gantt?mode=${mode}`);

// CURVA S
export const getCurvaS = (id, from = "", to = "") =>
    api.get(`/projects/${id}/curvas?from=${from}&to=${to}`);