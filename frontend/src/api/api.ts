import axios from "axios";

const baseUrl = axios.create({
  baseURL: "https://localhost:7050",
});

export default baseUrl;
