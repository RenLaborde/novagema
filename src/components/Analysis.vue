<template>
  <div class="analysis">
    <h2 class="section-title">Current Financial Status</h2>

    <table class="analysis-table">
      <thead>
        <tr>
          <th>Cryptocurrency</th>
          <th>Amount</th>
          <th>Value (ARS)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(crypto, code) in cryptoData" :key="code">
          <td>{{ code }}</td>
          <td>{{ Number(crypto.amount).toFixed(4) }}</td>
          <td>{{ formatCurrency(crypto.totalValue) }}</td>
        </tr>
        <tr>
          <td><strong>Total</strong></td>
          <td></td>
          <td><strong>{{ formatCurrency(totalMoney) }}</strong></td>
        </tr>
      </tbody>
    </table>

    <h2 class="section-title dark">Investment Performance</h2>
    <table class="analysis-table">
      <thead>
        <tr>
          <th>Cryptocurrency</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, code) in investmentResults" :key="code">
          <td>{{ code }}</td>
          <td :class="Number(result) >= 0 ? 'positive' : 'negative'">
            {{ Number(result) >= 0 ? '+' : '-' }} {{ formatCurrency(Math.abs(result)) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      transactions: [],
      cryptoData: {},
      totalMoney: 0,
      investmentResults: {},
      apiKey: "60eb09146661365596af552f",
    };
  },

  setup() {
    const router = useRouter();
    const goBack = () => router.push("/dashboard/");
    return { goBack };
  },

  methods: {
    formatCurrency(value) {
      if (isNaN(value)) return "$ 0.00";
      return `$ ${Number(value).toFixed(2)}`;
    },

    async fetchCryptoPrice(code) {
      try {
        const response = await axios.get(`https://criptoya.com/api/satoshitango/${code.toLowerCase()}/ars`);
        return Number(response.data.totalBid || 0);
      } catch (err) {
        console.error(`Error fetching price for ${code}:`, err.message);
        return 0;
      }
    },

    async fetchTransactions() {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) throw new Error("user_id not found in localStorage");

        const response = await axios.get(
          `https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id": "${user_id}"}`,
          {
            headers: {
              "x-apikey": this.apiKey,
              "Content-Type": "application/json",
            },
          }
        );

        this.transactions = response.data;
        await this.processData();
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
      }
    },

    async processData() {
      const cryptos = ["BTC", "ETH", "USDT", "DAI", "SOL"];
      const prices = {};

      for (const code of cryptos) {
        prices[code] = await this.fetchCryptoPrice(code);
      }

      const data = {};
      const investments = {};
      let totalMoney = 0;

      this.transactions.forEach((tx) => {
        const code = tx.crypto_code;
        const amount = parseFloat(tx.crypto_amount) || 0;
        const money = parseFloat(tx.money) || 0;

        if (!data[code]) {
          data[code] = { amount: 0, invested: 0, totalValue: 0 };
        }

        if (tx.action === "purchase") {
          data[code].amount += amount;
          data[code].invested += money;
        } else if (tx.action === "sale") {
          data[code].amount -= amount;
          data[code].invested -= money;
        }
      });

      for (const code in data) {
        const currentValue = data[code].amount * (prices[code] || 0);
        data[code].totalValue = Number(currentValue.toFixed(2));
        totalMoney += currentValue;

        const profit = currentValue - data[code].invested;
        investments[code] = Number(profit.toFixed(2));
      }

      this.cryptoData = data;
      this.totalMoney = Number(totalMoney.toFixed(2));
      this.investmentResults = investments;
    },
  },

  mounted() {
    this.fetchTransactions();
  },
};
</script>

<style scoped>
.analysis-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.analysis-table th,
.analysis-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

.section-title {
  text-align: center;
  color: #333;
  margin: 2rem 0 1rem;
}

.section-title.dark {
  color: #000;
}

.positive {
  color: green;
}

.negative {
  color: red;
}
</style>
