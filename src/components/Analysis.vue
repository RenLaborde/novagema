<template>
  <div class="analysis">
    <h2 class="section-title">Current Financial Status</h2>

    <!-- Table with crypto holdings -->
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

    <!-- Table with investment results -->
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
    };
  },
  setup() {
    const router = useRouter();
    const goBack = () => router.push("/principal");
    return { goBack };
  },
  methods: {
    formatCurrency(value) {
      if (isNaN(value)) return "$ 0.00";
      return `$ ${Number(value).toFixed(2)}`;
    },

    async fetchTransactions() {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) throw new Error("user_id is not set in localStorage");

        const response = await axios.get(
          `https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id": "${user_id}"}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-apikey": "60eb09146661365596af552f",
            },
          }
        );

        this.transactions = response.data;
        await this.processData();
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    },

    async fetchCryptoPrice(code) {
      try {
        const res = await axios.get(`https://criptoya.com/api/satoshitango/${code.toLowerCase()}/ars`);
        return Number(res.data.totalBid || 0);
      } catch (error) {
        console.error(`Error fetching price for ${code}:`, error);
        return 0;
      }
    },

    async processData() {
      try {
        const cryptoCodes = ["BTC", "ETH", "USDT", "DAI", "SOL"];
        const prices = {};

        for (const code of cryptoCodes) {
          prices[code] = await this.fetchCryptoPrice(code);
        }

        const data = {};
        const results = {};
        let total = 0;

        this.transactions.forEach(({ crypto_code, crypto_amount, money, action }) => {
          const code = crypto_code;
          const amount = parseFloat(crypto_amount) || 0;
          const moneySpent = parseFloat(money) || 0;

          if (!data[code]) {
            data[code] = { amount: 0, totalValue: 0 };
          }

          data[code].amount += action === "purchase" ? amount : -amount;
          data[code].totalValue = data[code].amount * prices[code];
        });

        Object.entries(data).forEach(([code, { totalValue }]) => {
          total += totalValue;
          const spent = this.transactions
            .filter((t) => t.crypto_code === code)
            .reduce((acc, t) => acc + (t.action === "purchase" ? parseFloat(t.money) : -parseFloat(t.money)), 0);
          results[code] = totalValue - spent;
        });

        this.cryptoData = data;
        this.totalMoney = total;
        this.investmentResults = results;
      } catch (error) {
        console.error("Error processing financial data:", error);
      }
    },
  },
  mounted() {
    this.fetchTransactions();
  },
};
</script>

<style scoped>
.financial-analysis {
  max-width: 700px;
  margin: auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
  text-align: center;
  color: #1a1a1a;
  margin: 20px 0;
}

.section-title.dark {
  color: #000;
}

.analysis-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 25px;
}

.analysis-table th,
.analysis-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

.positive {
  color: green;
}

.negative {
  color: red;
}

.btnGoBack {
  background-color: #444;
  color: white;
  border: none;
  padding: 8px 14px;
  margin: 10px;
  cursor: pointer;
  border-radius: 5px;
}

.transactions-logo {
  width: 80px;
  margin: 10px auto;
  display: block;
}
</style>
