import axios from 'axios';

// Crear una instancia de axios para RestDB API
const apiClient = axios.create({
  baseURL: 'https://laboratorio3-f36a.restdb.io/rest/', 
  headers: {
    'Content-Type': 'application/json',
    'x-apikey': "60eb09146661365596af552f", 
  },
});

export default apiClient;
