import axios from "axios";

// Instancia base de Axios
const apiClient = axios.create({
  baseURL: "https://labor3-d60e.restdb.io/rest/",
  headers: {
    "x-apikey": "64a2e9bc86d8c525a3ed8f63",
  },
});

// Crea una nueva transacción
export const createTransaction = async (transaction) => {
  if (!transaction || typeof transaction !== "object") {
    throw new Error("Invalid transaction.");
  }

  try {
    const response = await apiClient.post("/transactions", transaction);
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error.response?.data || error.message);
    throw new Error("Error while registering the transaction.");
  }
};

// 🆕 Obtiene las transacciones de un usuario
export const getUserTransactions = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  try {
    const response = await apiClient.get(`/transactions?q={"user_id":"${userId}"}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error.response?.data || error.message);
    throw new Error("Error fetching transaction history.");
  }
};

// Obtiene el precio actual de la criptomoneda desde CriptoYa
export const getCryptoPrice = async (cryptoCode) => {
  if (!cryptoCode) {
    throw new Error("Invalid cryptocurrency code.");
  }

  try {
    const url = `https://criptoya.com/api/satoshitango/${cryptoCode}/ars`;
    const response = await axios.get(url);

    if (response.data && response.data.ask) {
      return response.data.ask;
    } else {
      throw new Error("Price could not be fetched.");
    }
  } catch (error) {
    console.error("Error fetching crypto price:", error.response?.data || error.message);
    throw new Error("Error fetching the purchase price.");
  }
};

// Exportación por defecto para otros usos (ej. .get, .post genéricos)
export default apiClient;
