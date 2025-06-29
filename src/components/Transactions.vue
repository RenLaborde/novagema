<template>
  <div class="container py-4">
    <div class="card shadow-lg p-4">
      <h2 class="text-primary mb-3 text-center">Crypto Transactions</h2>
      <p class="text-muted text-center">Buy and sell cryptocurrencies with ease.</p>

      <form @submit.prevent="confirmTransaction">
        <div class="mb-3">
          <label for="transactionType" class="form-label">Transaction Type:</label>
          <select id="transactionType" v-model="action" class="form-select">
            <option value="purchase">Buy</option>
            <option value="sale">Sell</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="cryptoType" class="form-label">Cryptocurrency:</label>
          <select id="cryptoType" v-model="cryptoCode" class="form-select">
            <option value="btc">Bitcoin</option>
            <option value="usdc">USDC</option>
            <option value="eth">Ethereum</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="cryptoAmount" class="form-label">Amount:</label>
          <input
            type="number"
            id="cryptoAmount"
            v-model="cryptoAmount"
            step="0.0001"
            class="form-control"
            required
          />
        </div>

        <div v-if="cryptoPrice !== null" class="mb-3">
          <p class="alert alert-info p-2">
            Current price of {{ cryptoCode.toUpperCase() }}: <strong>{{ cryptoPrice }} ARS</strong>
          </p>
        </div>

        <div class="mb-3">
          <label for="money" class="form-label">
            {{ action === 'purchase' ? 'Amount to Pay (ARS):' : 'Amount to Receive (ARS):' }}
          </label>
          <input
            type="number"
            id="money"
            :value="calculatedMoney"
            class="form-control"
            disabled
          />
        </div>

        <div class="mb-3">
          <label for="datetime" class="form-label">Date and Time:</label>
          <input
            type="datetime-local"
            id="datetime"
            v-model="datetime"
            class="form-control"
            required
          />
        </div>

        <button
          type="submit"
          class="btn w-100"
          :class="action === 'purchase' ? 'btn-success' : 'btn-danger'"
        >
          Confirm {{ action === 'purchase' ? 'Purchase' : 'Sale' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { getCryptoPrices, createTransaction } from '@/services/apiClient';
import { useUserStore } from '@/store/user';

export default {
  data() {
    return {
      cryptoCode: 'btc',
      cryptoAmount: '',
      cryptoPrice: null,
      datetime: '',
      action: 'purchase',
    };
  },
  computed: {
    calculatedMoney() {
      if (!this.cryptoAmount || !this.cryptoPrice) return '';
      return (this.cryptoAmount * this.cryptoPrice).toFixed(2);
    }
  },
  watch: {
    cryptoCode: "fetchCryptoPrice"
  },
  methods: {
    async fetchCryptoPrice() {
      try {
        this.cryptoPrice = await getCryptoPrices(this.cryptoCode);
      } catch (error) {
        console.error("Error fetching crypto price:", error.message);
        this.cryptoPrice = null;
      }
    },

    async confirmTransaction() {
      const userStore = useUserStore();
      const userId = userStore.userId;

      const transactionData = {
        user_id: userId,
        action: this.action,
        crypto_code: this.cryptoCode,
        crypto_amount: parseFloat(this.cryptoAmount),
        money: parseFloat(this.calculatedMoney),
        datetime: this.datetime,
      };

      try {
        await createTransaction(transactionData);
        alert('Transaction successfully confirmed!');
        this.resetForm();
      } catch (err) {
        alert('Error submitting transaction');
        console.error(err);
      }
    },

    resetForm() {
      this.cryptoCode = 'btc';
      this.cryptoAmount = '';
      this.datetime = '';
      this.action = 'purchase';
      this.cryptoPrice = null;
    }
  },
  created() {
    this.fetchCryptoPrice();
  }
};
</script>

<style scoped>
.transactions {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #007bff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: #f5f8f9;
  font-family: Arial, sans-serif;
}

label {
  font-weight: bold;
  display: block;
  margin-top: 10px;
  
}

input, select {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
}

.buy-button {
  background-color: #28a745;
}

.sell-button {
  background-color: #dc3545;
}
</style>