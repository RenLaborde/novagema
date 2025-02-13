<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Transaction History</h1>
    <div v-if="transactions.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="transaction in transactions" :key="transaction.id" class="p-4 rounded-lg shadow-lg"
        :class="transaction.type === 'buy' ? 'bg-green-100' : 'bg-red-100'">
        <h2 class="text-lg font-semibold">{{ transaction.crypto }} - {{ transaction.amount }} {{ transaction.currency }}</h2>
        <p class="text-gray-600">{{ formatDate(transaction.date) }}</p>
        <p class="text-gray-800">Type: {{ transaction.type }}</p>
        <div class="mt-2 flex gap-2">
          <button class="bg-blue-500 text-white px-3 py-1 rounded" @click="editTransaction(transaction)">Edit</button>
          <button class="bg-red-500 text-white px-3 py-1 rounded" @click="deleteTransaction(transaction.id)">Delete</button>
        </div>
      </div>
    </div>
    <p v-else class="text-gray-500">No transactions found.</p>

    <!-- Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4">Edit Transaction</h2>
        <input v-model="selectedTransaction.crypto" class="border p-2 w-full mb-2" placeholder="Crypto">
        <input v-model="selectedTransaction.amount" class="border p-2 w-full mb-2" type="number" placeholder="Amount">
        <select v-model="selectedTransaction.type" class="border p-2 w-full mb-2">
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <div class="flex gap-2 mt-4">
          <button class="bg-green-500 text-white px-3 py-1 rounded" @click="saveTransaction">Save</button>
          <button class="bg-gray-500 text-white px-3 py-1 rounded" @click="showModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transactions: [
        { id: 1, crypto: 'BTC', amount: 0.5, currency: 'USD', date: '2024-02-10', type: 'buy' },
        { id: 2, crypto: 'ETH', amount: 2, currency: 'USD', date: '2024-02-09', type: 'sell' }
      ],
      showModal: false,
      selectedTransaction: null
    };
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    editTransaction(transaction) {
      this.selectedTransaction = { ...transaction };
      this.showModal = true;
    },
    saveTransaction() {
      const index = this.transactions.findIndex(t => t.id === this.selectedTransaction.id);
      if (index !== -1) this.transactions[index] = { ...this.selectedTransaction };
      this.showModal = false;
    },
    deleteTransaction(id) {
      this.transactions = this.transactions.filter(t => t.id !== id);
    }
  }
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
