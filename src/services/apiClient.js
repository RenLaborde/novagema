import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://laboratorio3-f36a.restdb.io/rest/',
  headers: {
    'x-apikey': '60eb09146661365596af552f',
    'Content-Type': 'application/json',
  },
});

export const createTransaction = async (transaction) => {
  if (
    !transaction ||
    typeof transaction !== 'object' ||
    !transaction.crypto_code ||
    !transaction.crypto_amount ||
    !transaction.money ||
    !transaction.datetime ||
    !transaction.user_id
  ) {
    throw new Error('Incomplete or invalid transaction data.');
  }

  try {
    const response = await apiClient.post('/transactions', transaction);
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error.response?.data || error.message);
    throw new Error('Error while registering the transaction.');
  }
};

export const getUserTransactions = async (userId) => {
  if (!userId) throw new Error('User ID is required.');

  try {
    const response = await apiClient.get(`/transactions?q={"user_id":"${userId}"}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error.response?.data || error.message);
    throw new Error('Error fetching transaction history.');
  }
};

export const patchTransactionById = async (id, data) => {
  if (!id || !data) throw new Error('ID and data are required for patch.');

  try {
    const response = await apiClient.patch(`/transactions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error patching transaction:', error.response?.data || error.message);
    throw new Error('Error updating the transaction.');
  }
};

export const deleteTransactionById = async (id) => {
  if (!id) throw new Error('Transaction ID is required.');

  try {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting transaction:', error.response?.data || error.message);
    throw new Error('Error deleting the transaction.');
  }
};

export const getCryptoPrice = async (cryptoCode) => {
  if (!cryptoCode) throw new Error('Invalid cryptocurrency code.');

  try {
    const url = `https://criptoya.com/api/satoshitango/${cryptoCode}/ars`;
    const response = await axios.get(url);

    if (response.data?.ask) {
      return response.data.ask;
    } else {
      throw new Error('Price could not be fetched.');
    }
  } catch (error) {
    console.error('Error fetching crypto price:', error.response?.data || error.message);
    throw new Error('Error fetching the purchase price.');
  }
};