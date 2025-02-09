// src/services/apiClient.js

import axios from 'axios';

// Crear una instancia de axios para RestDB API
const apiClient = axios.create({
  baseURL: 'https://laboratorio3-f36a.restdb.io/rest', // URL de la API RestDB
  headers: {
    'Content-Type': 'application/json',
    'x-apikey': '60eb09146661365596af552f' // La clave para acceder a la API
  },
});

export default apiClient;
