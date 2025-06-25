<template>
  <div class="history">
    <h2>Transaction History</h2>

    <div v-if="paginatedTransactions.length">
      <div
        v-for="transaction in paginatedTransactions"
        :key="transaction._id"
        class="transaction-item"
      >
        <p><strong>Type:</strong> {{ transaction.action === 'purchase' ? 'Buy' : 'Sell' }}</p>
        <p><strong>Crypto:</strong> {{ transaction.crypto_code?.toUpperCase() }}</p>
        <p><strong>Amount:</strong> {{ transaction.crypto_amount }}</p>
        <p><strong>ARS:</strong> {{ transaction.money }}</p>
        <p><strong>Date:</strong> {{ formatDate(transaction.datetime) }}</p>
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Prev</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
      </div>
    </div>

    <div v-else>
      <p>No transactions found.</p>
    </div>
  </div>
</template>

<script>
import { getUserTransactions } from '@/services/apiClient';
import { useUserStore } from '@/store/user';

export default {
  data() {
    return {
      transactions: [],
      currentPage: 1,
      transactionsPerPage: 5,
    };
  },
  computed: {
    paginatedTransactions() {
      const start = (this.currentPage - 1) * this.transactionsPerPage;
      return this.transactions.slice(start, start + this.transactionsPerPage);
    },
    totalPages() {
      return Math.ceil(this.transactions.length / this.transactionsPerPage);
    },
  },
  methods: {
    async fetchTransactions() {
      const userId = useUserStore().userId;
      if (!userId) return;

      try {
        const data = await getUserTransactions(userId);
        this.transactions = data;
        this.currentPage = 1;
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString();
    },
  },
  created() {
    this.fetchTransactions();
  },
};
</script>

<style scoped>
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
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
</style>
