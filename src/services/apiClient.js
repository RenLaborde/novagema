import axios from 'axios';

// apiClient es una instancia de axios con la configuración base
const apiClient = axios.create({
  baseURL: "https://laboratorio3-f36a.restdb.io/rest/",
  headers: {
    "x-apikey": "60eb09146661365596af552f", 
  },
});

// Función para crear una nueva transacción
export const createTransaction = async (transaction) => {
  if (!transaction || typeof transaction !== "object") {
    throw new Error("Invalid transaction.");
  }
  try {
    const response = await apiClient.post("/transactions", transaction);
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error.response?.data ?? error.message);
    throw new Error("Error while registering the transaction.");
  }
};

// Función para obtener el precio de la criptomoneda
export const getCryptoPrice = async (cryptoCode) => {
  if (!cryptoCode) {
    throw new Error("Invalid cryptocurrency code.");
  }
  try {
    const url = `https://criptoya.com/api/satoshitango/${cryptoCode}/ars`;
    const response = await axios.get(url);

    if (response.data && response.data.ask) {
      return response.data.ask; // Precio de la criptomoneda
    } else {
      throw new Error("Price could not be fetched.");
    }
  } catch (error) {
    console.error("Error fetching crypto price:", error.response?.data || error.message);
    throw new Error("Error fetching the purchase price.");
  }
};

// Exportación por defecto de apiClient
export default apiClient;
