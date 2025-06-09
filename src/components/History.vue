<template>
  <div class="history">
    <h2>Transaction History</h2>

    <div v-if="paginatedTransactions.length">
      <div
        v-for="transaction in paginatedTransactions"
        :key="transaction._id"
        class="transaction-item"
      >
        <template v-if="editMode && editData._id === transaction._id">
          <h3>Edit Transaction</h3>
          <label>Type:
            <select v-model="editData.action">
              <option value="purchase">Buy</option>
              <option value="sale">Sell</option>
            </select>
          </label>
          <label>Crypto:
            <input v-model="editData.crypto_code" />
          </label>
          <label>Amount:
            <input v-model.number="editData.crypto_amount" type="number" />
          </label>
          <label>ARS:
            <input v-model.number="editData.money" type="number" />
          </label>
          <label>Date:
            <input v-model="editData.datetime" type="datetime-local" />
          </label>
          <button @click="saveEdit">Save</button>
          <button @click="cancelEdit">Cancel</button>
        </template>

        <template v-else>
          <p><strong>Type:</strong> {{ transaction.action === 'purchase' ? 'Buy' : 'Sell' }}</p>
          <p><strong>Crypto:</strong> {{ transaction.crypto_code?.toUpperCase() }}</p>
          <p><strong>Amount:</strong> {{ transaction.crypto_amount }}</p>
          <p><strong>ARS:</strong> {{ transaction.money }}</p>
          <p><strong>Date:</strong> {{ formatDate(transaction.datetime) }}</p>

          <button @click="editTransaction(transaction)">Edit</button>
          <button @click="deleteTransaction(transaction._id)">Delete</button>
        </template>
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
import { getUserTransactions, deleteTransactionById, patchTransactionById } from '@/services/apiClient';
import { useUserStore } from '@/store/user';

export default {
  data() {
    return {
      transactions: [],
      currentPage: 1,
      transactionsPerPage: 5,
      editMode: false,
      editData: {},
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
    async deleteTransaction(id) {
      if (!confirm('Are you sure you want to delete this transaction?')) return;
      try {
        await deleteTransactionById(id);
        this.fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    },
    editTransaction(transaction) {
      this.editData = {
        ...transaction,
        datetime: new Date(transaction.datetime).toISOString().slice(0, 16), // para input datetime-local
      };
      this.editMode = true;
    },
    async saveEdit() {
      try {
        const updated = {
          ...this.editData,
          datetime: new Date(this.editData.datetime).toISOString(),
        };
        await patchTransactionById(this.editData._id, updated);
        this.editMode = false;
        this.editData = {};
        this.fetchTransactions();
      } catch (error) {
        console.error('Error saving transaction:', error);
      }
    },
    cancelEdit() {
      this.editMode = false;
      this.editData = {};
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
button {
  margin-right: 10px;
}
.edit-form label {
  display: block;
  margin-bottom: 10px;
}
.edit-form input,
.edit-form select {
  width: 100%;
  padding: 5px;
}
</style>
