import axios from 'axios';

const baseURL = 'https://criptoya.com/api/satoshitango/';

function createCryptoApiClient() {
  const instance = axios.create({
    baseURL,
  });

  return {
    getDetails: async (cryptoCode) => {
      const response = await instance.get(`${cryptoCode}/ars`);
      return response.data;
    },
  };
}

export default createCryptoApiClient();