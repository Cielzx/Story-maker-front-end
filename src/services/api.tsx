import axios from "axios";

const api = axios.create({
  baseURL: "https://story-marker-backend.onrender.com/",
});

export default api;
