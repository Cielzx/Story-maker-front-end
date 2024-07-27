import axios from "axios";

const api = axios.create({
  baseURL: "https://story-marker-backend.onrender.com/",
  timeout: 6000,
});

export default api;
