import axios from "axios";
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization =
      "Bearer " +
      (localStorage.getItem("jwt") ? localStorage.getItem("jwt") : "");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
