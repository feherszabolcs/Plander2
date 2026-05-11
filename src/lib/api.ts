import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5148/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData")!).token
    : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
