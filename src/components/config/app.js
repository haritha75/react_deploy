import axios from "axios";

const api = axios.create({
  baseURL:
    "https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api",
});
// https://revtask-hfenhja8emeyddbs.southindia-01.azurewebsites.net/api/
export default api;
// "http://localhost:8080/api",
