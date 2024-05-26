import axios from 'axios';

const api = axios.create({
  baseURL: "https://localhost:7050",
});

export default api;
