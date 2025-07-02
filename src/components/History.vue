<template>
  <div class="history">
    <h2>Transaction History</h2>
    <p class="subtitle">Manage, view, and edit your crypto transactions with ease.</p>

    <div v-if="paginatedTransactions.length" class="transaction-list">
      <div
        v-for="transaction in paginatedTransactions"
        :key="transaction._id"
        class="transaction-card"
      >
        <!-- Edit mode -->
        <template v-if="editMode && editData._id === transaction._id">
          <h3>Edit Transaction</h3>
          <div class="edit-form">
            <label>
              Type:
              <select v-model="editData.action" @change="recalculateMoney">
                <option value="purchase">Buy</option>
                <option value="sale">Sell</option>
              </select>
            </label>

            <label>
              Crypto:
              <select v-model="editData.crypto_code" @change="recalculateMoney">
                <option v-for="coin in availableCryptos" :key="coin.code" :value="coin.code">
                  {{ coin.name }}
                </option>
              </select>
            </label>

            <label>
              Amount:
              <input
                v-model.number="editData.crypto_amount"
                type="number"
                step="any"
                @input="recalculateMoney"
              />
            </label>

            <label>
              ARS:
              <input :value="formatCurrencyARS(editData.money)" type="text" readonly />
            </label>

            <label>
              Date:
              <input v-model="editData.datetime" type="datetime-local" />
            </label>

            <div class="buttons">
              <button @click="saveEdit">💾 Save</button>
              <button class="cancel" @click="cancelEdit">✖ Cancel</button>
            </div>
          </div>
        </template>

        <!-- View mode -->
        <template v-else>
          <p><strong>Type:</strong> {{ transaction.action === 'purchase' ? 'Buy' : 'Sell' }}</p>
          <p><strong>Crypto:</strong> {{ transaction.crypto_code?.toUpperCase() }}</p>
          <p><strong>Amount:</strong> {{ transaction.crypto_amount }}</p>
          <p><strong>ARS:</strong> {{ formatCurrencyARS(transaction.money) }}</p>
          <p><strong>Date:</strong> {{ formatDate(transaction.datetime) }}</p>

          <div class="buttons">
            <button @click="editTransaction(transaction)">✏ Edit</button>
            <button class="delete" @click="deleteTransaction(transaction._id)">🗑 Delete</button>
          </div>
        </template>
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">← Prev</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages">Next →</button>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>No transactions found...</p>
    </div>
  </div>
</template>

<script>
import {
  getUserTransactions,
  deleteTransactionById,
  patchTransactionById,
  getCryptoPrice,
} from '@/services/apiClient';
import { useUserStore } from '@/store/user';

export default {
  data() {
    return {
      userId: null,
      transactions: [],
      currentPage: 1,
      transactionsPerPage: 5,
      editMode: false,
      editData: {},
      availableCryptos: [
        { code: 'btc', name: 'Bitcoin' },
        { code: 'eth', name: 'Ethereum' },
        { code: 'usdc', name: 'USDC' }
      ]
    };
  },
  computed: {
    paginatedTransactions() {
      const start = (this.currentPage - 1) * this.transactionsPerPage;
      return this.transactions.slice(start, start + this.transactionsPerPage);
    },
    totalPages() {
      return Math.ceil(this.transactions.length / this.transactionsPerPage);
    }
  },
  methods: {
    async fetchTransactions() {
      if (!this.userId) return;
      try {
        const data = await getUserTransactions(this.userId);
        this.transactions = data;
        this.currentPage = 1;
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
      }
    },
    async recalculateMoney() {
      if (!this.editData.crypto_code || !this.editData.crypto_amount) return;
      try {
        const price = await getCryptoPrice(this.editData.crypto_code);
        this.editData.money = parseFloat(
          (price * this.editData.crypto_amount).toFixed(2)
        );
      } catch (error) {
        console.error('Error calculating ARS:', error.message);
      }
    },
    formatCurrencyARS(value) {
      const number = Number(value);
      if (isNaN(number)) return '$ 0,00';
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(number);
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString('es-AR', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    editTransaction(transaction) {
      this.editData = {
        ...transaction,
        datetime: new Date(transaction.datetime).toISOString().slice(0, 16)
      };
      this.editMode = true;
    },
    cancelEdit() {
      this.editMode = false;
      this.editData = {};
    },
    async saveEdit() {
      const { crypto_code, crypto_amount, money, datetime, _id } = this.editData;
      if (!crypto_code || !crypto_amount || !money || !datetime) {
        alert('Please fill in all required fields.');
        return;
      }

      try {
        const updated = {
          action: this.editData.action,
          crypto_code,
          crypto_amount: parseFloat(crypto_amount),
          money: parseFloat(money),
          datetime: new Date(datetime).toISOString(),
          user_id: this.userId
        };

        await patchTransactionById(_id, updated);
        this.cancelEdit();
        await this.fetchTransactions();
      } catch (error) {
        console.error('Error saving transaction:', error.message);
        alert('An error occurred while saving the transaction.');
      }
    },
    async deleteTransaction(id) {
      try {
        await deleteTransactionById(id);
        await this.fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error.message);
        alert('An error occurred while deleting the transaction.');
      }
    }
  },
  async mounted() {
    const store = useUserStore();
    this.userId = store.userId;
    await this.fetchTransactions();
  }
};
</script>

<style scoped>
.history {
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
h2 {
  color: #333;
  margin-bottom: 10px;
}
.subtitle {
  color: #666;
  margin-bottom: 20px;
}
.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.transaction-card {
  background: #f9fafa;
  border-left: 5px solid #007bff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.06);
}
.edit-form label {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
input,
select {
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 100%;
}
.buttons {
  margin-top: 10px;
}
button {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}
button:hover {
  background-color: #0056b3;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.cancel {
  background-color: #6c757d;
}
.delete {
  background-color: #dc3545;
}
.delete:hover {
  background-color: #b52b37;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 15px;
}
.empty-state {
  text-align: center;
  padding: 20px;
  color: #999;
}

@media (max-width: 600px) {
  .transaction-card {
    padding: 12px;
  }
  .pagination {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
