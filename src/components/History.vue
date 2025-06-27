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
              <input
                v-model.number="editData.money"
                type="number"
                step="any"
                readonly
              />
            </label>

            <label>
              Date:
              <input v-model="editData.datetime" type="datetime-local" />
            </label>

            <div class="buttons">
              <button @click="saveEdit">Save</button>
              <button class="cancel" @click="cancelEdit">Cancel</button>
            </div>
          </div>
        </template>

        <!-- Vista Normal -->
        <template v-else>
          <p><strong>Type:</strong> {{ transaction.action === 'purchase' ? 'Buy' : 'Sell' }}</p>
          <p><strong>Crypto:</strong> {{ transaction.crypto_code?.toUpperCase() }}</p>
          <p><strong>Amount:</strong> {{ transaction.crypto_amount }}</p>
          <p><strong>ARS:</strong> {{ transaction.money }}</p>
          <p><strong>Date:</strong> {{ formatDate(transaction.datetime) }}</p>

          <div class="buttons">
            <button @click="editTransaction(transaction)">Edit</button>
            <button class="delete" @click="deleteTransaction(transaction._id)">Delete</button>
          </div>
        </template>
      </div>

      <!-- Paginación -->
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
import {
  getUserTransactions,
  deleteTransactionById,
  patchTransactionById,
  getCryptoPrices 
} from '@/services/apiClient';
import { useUserStore } from '@/store/user';

export default {
  data() {
    return {
      user_Id: null,
      transactions: [],
      currentPage: 1,
      transactionsPerPage: 5,
      editMode: false,
      editData: {},
      availableCryptos: [
        { code: 'btc', name: 'Bitcoin' },
        { code: 'eth', name: 'Ethereum' },
        { code: 'usdc', name: 'USDC' },
      ],
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
        const price = await getCryptoPrices(this.editData.crypto_code);
        this.editData.money = parseFloat(
          (price * this.editData.crypto_amount).toFixed(2)
        );
      } catch (error) {
        console.error('Error calculating ARS:', error.message);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    editTransaction(transaction) {
      this.editData = {
        ...transaction,
        datetime: new Date(transaction.datetime).toISOString().slice(0, 16),
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
          user_id: this.userId,
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
    },
  },
  async mounted() {
    const store = useUserStore();
    this.userId = store.userId;
    await this.fetchTransactions();
  },
};
</script>

<style scoped>
.history {
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}
.transaction-item {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
}
.buttons {
  margin-top: 10px;
}
button {
  margin-right: 10px;
}
.cancel {
  background-color: #ccc;
}
.delete {
  color: white;
  background-color: red;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
