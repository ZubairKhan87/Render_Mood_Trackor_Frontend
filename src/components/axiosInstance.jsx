// 


import axios from 'axios';

// Detect if environment is production
const isProduction = import.meta.env.MODE === 'production';

// Set the base URL accordingly
const myBaseUrl = isProduction
  ? import.meta.env.VITE_API_BASE_URL_DEPLOY
  : import.meta.env.VITE_API_BASE_URL_LOCAL;

const axiosInstance = axios.create({
  baseURL: myBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    accept: "application/json"
  }
});

export default axiosInstance;
