<template>
  <div>
    <h2>Transaction History</h2>
    <ul>
      <li v-for="transaction in transactions" :key="transaction._id">
        {{ transaction.datetime }} - {{ transaction.crypto_code }} - {{ transaction.crypto_amount }}
      </li>
    </ul>
    <button @click="loadHistory">Refresh</button>
  </div>
</template>
// conectar con user id, console log
<script>
import apiClient from '@/services/apiClient';
import { useUserStore } from '@/store/user';

// hacer crud get, post, put, delete

export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      transactions: []
    };
  },
  created() {
    this.loadHistory();
  },
  methods: {
    async loadHistory() {
      try {
      console.log(this.userStore.userId);
        const response = await apiClient.get(`/transactions?q={"user_id": "${this.userStore.userId}"}`);
        this.transactions = response.data;
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    }
  }
};
</script>

<style scoped>
button {
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
}
button:hover {
  background-color: #0056b3;
}
</style>
