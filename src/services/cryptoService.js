import axios from "axios";

const exchanges = [
  "buenbit", "satoshitango", "lemoncash", "binance", "ripio"
];
const cryptos = [
  "BTC", "ETH", "USDT", "USDC", "DAI", "BNB", "SOL", "XRP", "ADA", "DOGE"
];
const fiat = "ARS";
const volumen = 1;

export async function fetchCryptoPrices() {
  let data = [];
  for (const exchange of exchanges) {
    for (const coin of cryptos) {
      const url = `https://criptoya.com/api/${exchange}/${coin}/${fiat}/${volumen}`;
      try {
        const response = await axios.get(url);
        data.push({
          exchange,
          coin,
          ask: response.data.ask,
          bid: response.data.bid
        });
      } catch (error) {
        console.error(`Error con ${exchange} - ${coin}:`, error);
      }
    }
  }
  return data;
}
