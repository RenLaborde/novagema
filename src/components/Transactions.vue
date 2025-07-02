<template>
  <div class="transactions">
<<<<<<< HEAD
    <h2>Track Transactions</h2>
=======
     <h2>Track Transactions</h2>
>>>>>>> dev
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
        <p>Current Price of {{ cryptoCode.toUpperCase() }}: {{ formatCurrencyARS(cryptoPrice) }}</p>
      </div>

      <label for="money">
        {{ action === 'purchase' ? 'Amount to Pay (ARS):' : 'Amount to Receive (ARS):' }}
      </label>
      <input
        type="text"
        id="money"
        :value="formattedCalculatedMoney"
        disabled
      >

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
<<<<<<< HEAD
import { getCryptoPrice, createTransaction } from '@/services/apiClient';
=======
import { getCryptoPrice, createTransaction} from '@/services/apiClient';
>>>>>>> dev
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
      if (!this.cryptoAmount || !this.cryptoPrice) return 0;
      return this.cryptoAmount * this.cryptoPrice;
    },
    formattedCalculatedMoney() {
      return this.formatCurrencyARS(this.calculatedMoney);
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

    formatCurrencyARS(value) {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
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
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  border: 1px solid #007bff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: #f5f8f9;
  font-family: Arial, sans-serif;
  max-width: 800px;
  text-align: center;
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
