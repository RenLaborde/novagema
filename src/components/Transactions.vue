<template>
  <div class="transactions">
    <form @submit.prevent="confirmTransaction">
      <label for="transactionType">Transaction Type:</label>
      <select id="transactionType" v-model="action">
        <option value="purchase">Buy</option>
        <option value="sale">Sell</option>
      </select>

      <label for="cryptoType">Cryptocurrency:</label>
      <select id="cryptoType" v-model="cryptoCode">
        <option value="btc">Bitcoin</option>
        <option value="usdc">USDC</option>
        <option value="eth">Ethereum</option>
      </select>

      <label for="cryptoAmount">Amount:</label>
      <input type="number" id="cryptoAmount" v-model="cryptoAmount" step="0.0001" required>

      <div v-if="cryptoPrice !== null">
        <p>Current Price of {{ cryptoCode.toUpperCase() }}: {{ cryptoPrice }} ARS</p>
      </div>

      <label for="money">{{ action === 'purchase' ? 'Amount to Pay (ARS):' : 'Amount to Receive (ARS):' }}</label>
      <input type="number" id="money" :value="calculatedMoney" step="0.01" disabled>

      <label for="datetime">Date and Time:</label>
      <input type="datetime-local" id="datetime" v-model="datetime" required>

      <button
        type="submit"
        :class="{
          'buy-button': action === 'purchase',
          'sell-button': action === 'sale'
        }"
      >
        Confirm {{ action === 'purchase' ? 'Purchase' : 'Sale' }}
      </button>
    </form>
  </div>
</template>

<script>
import { createTransaction, getCryptoPrice } from '@/services/apiClient';

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
        this.cryptoPrice = await getCryptoPrice(this.cryptoCode);
      } catch (error) {
        console.error("Error fetching crypto price:", error.message);
        this.cryptoPrice = null;
      }
    },
    async confirmTransaction() {
      if (this.cryptoAmount <= 0) {
        alert('Enter a valid amount of cryptocurrency.');
        return;
      }

      if (!this.datetime) {
        alert('Please select a date and time for the transaction.');
        return;
      }

      const transactionData = {
        action: this.action,
        crypto_code: this.cryptoCode,
        crypto_amount: parseFloat(this.cryptoAmount),
        money: parseFloat(this.calculatedMoney),
        datetime: this.datetime,
      };

      try {
        const response = await createTransaction(transactionData);
        console.log('Transaction confirmed:', response);
        alert('Transaction successfully confirmed!');
      } catch (error) {
        console.error('Error confirming transaction:', error);
        alert('Failed to confirm transaction.');
      }
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
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: #fff;
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