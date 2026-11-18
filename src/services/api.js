import axios from "axios";

// main backend address
const api = axios.create({
  baseURL: "https://thinkboard.codewithmmd.ir/api",
});

export default api;
