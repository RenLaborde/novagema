import axios from "axios";

// Instancia base de Axios
const apiClient = axios.create({
  baseURL: "https://labor3-d60e.restdb.io/rest/",
  headers: {
    "x-apikey": "64a2e9bc86d8c525a3ed8f63",
    "Content-Type": "application/json",
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

// Obtiene las transacciones de un usuario
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

// Edita (parcialmente) una transacción por ID
export const patchTransactionById = async (id, data) => {
  if (!id || !data) {
    throw new Error("ID and data are required for patch.");
  }

  try {
    const response = await apiClient.patch(`/transactions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error patching transaction:", error.response?.data || error.message);
    throw new Error("Error updating the transaction.");
  }
};

// Elimina una transacción por ID
export const deleteTransactionById = async (id) => {
  if (!id) {
    throw new Error("Transaction ID is required.");
  }

  try {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting transaction:", error.response?.data || error.message);
    throw new Error("Error deleting the transaction.");
  }
};

// Obtiene el precio actual de una criptomoneda desde CriptoYa
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

// Exportación por defecto para uso genérico si lo necesitás
export default apiClient;
