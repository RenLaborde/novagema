<template>
  <div class="history">
    <h2>Transaction History</h2>
    <div v-if="transactions.length > 0">
      <div v-for="transaction in transactions" :key="transaction._id" class="transaction-item">
        <p><strong>Type:</strong> {{ transaction.action === 'purchase' ? 'Buy' : 'Sell' }}</p>
        <p><strong>Cryptocurrency:</strong> {{ transaction.crypto_code.toUpperCase() }}</p>
        <p><strong>Amount:</strong> {{ transaction.crypto_amount }}</p>
        <p><strong>Amount in ARS:</strong> {{ transaction.money }}</p>
        <p><strong>Date:</strong> {{ new Date(transaction.datetime).toLocaleString() }}</p>
        <button @click="editTransaction(transaction)">Edit</button>
        <button @click="deleteTransaction(transaction._id)">Delete</button>
      </div>
    </div>
    <div v-else>
      <p>No transactions found.</p>
    </div>
  </div>
</template>

<script>
// Importamos apiClient desde el archivo services/apiClient.js
import apiClient from '@/services/apiClient';

export default {
  data() {
    return {
      transactions: [],
    };
  },
  methods: {
    // Fetch transactions desde el servidor
    async fetchTransactions() {
      try {
        const response = await apiClient.get('/transactions');
        this.transactions = response.data;
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
      }
    },
    // Función para eliminar transacción
    async deleteTransaction(id) {
      try {
        await apiClient.delete(`/transactions/${id}`);
        this.fetchTransactions(); // Recargamos la lista de transacciones
        alert('Transaction deleted successfully!');
      } catch (error) {
        console.error('Error deleting transaction:', error.message);
        alert('Failed to delete transaction.');
      }
    },
    // Función para editar transacción
    editTransaction(transaction) {
      console.log('Editing transaction:', transaction);
      // Aquí va la lógica para editar la transacción
    }
  },
  created() {
    this.fetchTransactions(); // Cargar las transacciones cuando el componente se monte
  }
};
</script>

<style scoped>
/* Estilos para el historial de transacciones */
.history {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

.transaction-item {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}

button {
  margin-top: 10px;
  padding: 5px 10px;
  cursor: pointer;
}

button:hover {
  background-color: #ddd;
}
</style>
