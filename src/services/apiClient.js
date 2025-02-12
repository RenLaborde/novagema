import axios from 'axios';

//apiClient is an axios instance with the baseURL and headers set
const apiClient = axios.create({
    baseURL: "https://laboratorio3-f36a.restdb.io/rest/",
    headers: {
      "x-apikey": "60eb09146661365596af552f", 
    },
  });


// Function to create a new transaction
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
  
  // Function to get cryptocurrency price from CriptoYa
  export const getCryptoPrice = async (cryptoCode) => {
    if (!cryptoCode) {
      throw new Error("Invalid cryptocurrency code.");
    }
    try {
      const url = `https://criptoya.com/api/satoshitango/${cryptoCode}/ars`;
      const response = await axios.get(url);
  
      if (response.data && response.data.ask) {
        return response.data.ask; // Price of the cryptocurrency
      } else {
        throw new Error("Price could not be fetched.");
      }
    } catch (error) {
      console.error("Error fetching crypto price:", error.response?.data || error.message);
      throw new Error("Error fetching the purchase price.");
    }
  };
  
 
export default {
    createTransaction,
    getCryptoPrice,
    apiClient,
}