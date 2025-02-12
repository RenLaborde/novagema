import axios from 'axios';

//apiClient is an axios instance with the baseURL and headers set
const apiClient = axios.create({
    baseURL: "https://laboratorio3-f36a.restdb.io/rest/",
    headers: {
      "x-apikey": "60eb09146661365596af552f", 
    },
  });

export default apiClient;