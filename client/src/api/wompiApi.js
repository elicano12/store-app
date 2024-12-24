import axios from 'axios';
const apiUrl = import.meta.env.VITE_APP_WOMPI_URL;
const apiPublicKey = import.meta.env.VITE_APP_WOMPI_PUBLIC_KEY

const wompiInstance = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiPublicKey}`,
  },
});

wompiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default wompiInstance;
