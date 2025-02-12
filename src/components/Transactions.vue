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
        <input type="number" id="money" v-model="money" step="0.01" required>
  
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
  import apiClient from '@/services/apiClient';
  
  export default {
    data() {
      return {
        cryptoCode: 'btc',   // Default value for cryptocurrency
        cryptoAmount: '',    // Amount of cryptocurrency
        money: '',           // Amount of money (ARS)
        datetime: '',        // Date and time of the transaction
        action: 'purchase',  // Default action is buy (purchase)
      };
    },
    methods: {
      async handleTransaction() {
        if (this.cryptoAmount <= 0 || this.money <= 0) {
          alert('The amount of cryptocurrency and the money must be greater than 0.');
          return;
        }
  
        const transactionData = {
          user_id: this.$store.state.userId,
          action: this.action,    // Use 'purchase' or 'sale' based on the selected option
          crypto_code: this.cryptoCode,
          crypto_amount: this.cryptoAmount,
          money: this.money,
          datetime: this.datetime,
        };
  
        try {
          const response = await apiClient.post('/transactions', transactionData);
          console.log(`${this.action.charAt(0).toUpperCase() + this.action.slice(1)} saved:`, response.data);
        } catch (error) {
          console.error(`Error saving the ${this.action}:`, error);
        }
      }
    },
  };
  </script>
  
  <style scoped>
  .transactions-form {
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
  
  /* Styles for buttons */
  button[type="submit"] {
    padding: 10px 15px;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  
  /* Style for buy button */
  .buy-button {
    background-color: #28a745; /* Green for buying */
  }
  
  /* Style for sell button */
  .sell-button {
    background-color: #dc3545; /* Red for selling */
  }
  </style>
  