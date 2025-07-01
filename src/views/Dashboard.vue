<template>
  <div class="dashboard" v-if="userId">
    <Logo />

    <h2>Welcome</h2>
    <p>Your User ID: {{ userId }}</p>

    <nav>
      <ul>
        <li><button @click="goToLogin">Back to Login</button></li>
        <li><router-link to="/dashboard/transactions">Transactions</router-link></li>
        <li><router-link to="/dashboard/marketprices">Market Prices</router-link></li>
        <li><router-link to="/dashboard/history">History</router-link></li>
        <li><router-link to="/dashboard/analysis">Analysis</router-link></li>
      </ul>
    </nav>
    <router-view />
  </div>

  <div v-else class="loading">
    <p>Loading...</p>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import Logo from '@/components/Logo.vue';

const userStore = useUserStore();
const userId = computed(() => userStore.userId);
const router = useRouter();

onMounted(() => {
  if (!userId.value) {
    router.push('/');
  }
});

const goToLogin = () => {
  userStore.logout();
  router.push('/');
};
</script>

<style scoped>
.dashboard {
  text-align: center;
  padding: 20px;
  max-width: 800px;
  margin: auto;
}

nav ul {
  display: flex;
  justify-content: center;
  padding: 0;
  gap: 15px;
  flex-wrap: wrap;
}

nav ul li {
  list-style: none;
}

nav ul li a,
button {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
}

nav ul li a:hover,
button:hover {
  text-decoration: underline;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  font-weight: bold;
}
</style>
