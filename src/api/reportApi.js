import axios from 'axios'
const API = import.meta.env.VITE_API_URL

export const getGantt = (pid,type) => axios.get(`${API}/projects/${pid}/gantt?type=${type}`)
export const getCurvaS = (pid,from,to) => axios.get(`${API}/projects/${pid}/curva-s?from=${from}&to=${to}`)