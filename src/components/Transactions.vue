<template>
  <div class="transactions">
    <form @submit.prevent="handleTransaction">
  
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

      <label for="money">Money (ARS):</label>
      <label for="money">{{ action === 'purchase' ? 'Amount to pay:' : 'Amount to receive:' }}</label>
      <input type="number" id="money" v-model="money" step="0.01" disabled> <!-- Display ARS amount calculated -->

      <label for="datetime">Date and Time:</label>
      <input type="datetime-local" id="datetime" v-model="datetime" required>

      <button
        type="submit"
        :class="{
          'buy-button': action === 'purchase',
          'sell-button': action === 'sale'
        }"
      >
        {{ action === 'purchase' ? 'Buy Cryptocurrency' : 'Sell Cryptocurrency' }}
      </button>

      <!-- Debugging output for action value -->
      <p>Current action: {{ action }}</p>
    </form>
  </div>
</template>

<script>
import { getCryptoPrice } from '@/services/apiClient';

export default {
  data() {
    return {
      cryptoCode: 'btc',   // Default selected cryptocurrency (Bitcoin)
      cryptoAmount: '',    // Amount of cryptocurrency (user input)
      money: '',           // Amount of money in ARS to be calculated
      datetime: '',        // Date and time of the transaction
      action: 'purchase',  // Transaction type (buy or sell)
    };
  },
  methods: {
    async handleTransaction() {
      if (this.cryptoAmount <= 0) {
        alert('The amount of cryptocurrency must be greater than 0.');
        return;
      }

      try {
        // Fetch current crypto price in ARS using API
        const cryptoPrice = await getCryptoPrice(this.cryptoCode);

        if (this.action === 'purchase') {
          // If the action is "buy", calculate how much money in ARS the user will need to pay
          this.money = (this.cryptoAmount * cryptoPrice).toFixed(2);
        } else if (this.action === 'sale') {
          // If the action is "sell", calculate how much money in ARS the user will receive
          this.money = (this.cryptoAmount * cryptoPrice).toFixed(2);
        }

        // Prepare transaction data for API (you might need to adjust this part for your backend)
        const transactionData = {
          user_id: this.$store.state.userId, // Assume user ID is stored in Vuex
          action: this.action,              // Action type (buy or sell)
          crypto_code: this.cryptoCode,     // Cryptocurrency code (BTC, USDC, ETH)
          crypto_amount: this.cryptoAmount, // Amount of cryptocurrency
          money: this.money,                // Calculated amount in ARS
          datetime: this.datetime,         // Transaction date and time
        };

        // Send transaction data to backend (adjust API endpoint as needed)
        await this.createTransaction(transactionData);
        console.log('Transaction processed:', transactionData);
        
      } catch (error) {
        console.error("Error processing transaction:", error);
      }
    },

    // Create a transaction using backend API
    async createTransaction(transaction) { // no permita ser nulo, especificar tipo de dato
      if (!transaction || typeof transaction !== "object") {
        throw new Error("Invalid transaction.");
      }
      try {
        const response = await apiClient.post("/transactions", transaction);
        return response.data;
      } catch (error) {
        console.error("Error creating transaction:", error.response?.data || error.message);
        throw new Error("There was an error registering the transaction.");
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here as needed */
.transaction-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

label {
  font-weight: bold;
}

input[type="number"],
select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

button[type="submit"] {
  padding: 10px 15px;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.buy-button {
  background-color: #28a745;
}

.sell-button {
  background-color: #dc3545; 
}
</style>
