<template>
  <div class="dashboard">
    <Logo />
    <h2>Welcome</h2>
    <p>Your user ID: {{ userId }}</p>
    
    <nav>
      <ul>
        <li><button @click="goToLogin">Back to Login</button></li>
        <li><router-link to="/dashboard/transactions">Transactions</router-link></li>
        <li><router-link to="/dashboard/marketprices">Market Prices</router-link></li>
        <li><router-link to="/dashboard/history">History</router-link></li>
        <li><router-link to="/dashboard/investments">Investments</router-link></li>
      </ul>
    </nav>

    <router-view />  
  </div>
</template>

<script>
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
  setup() {
    const userStore = useUserStore();
    const userId = computed(() => userStore.userId);
    const router = useRouter();

    const goToLogin = () => {
      router.push('/');
    };

    return { userId, goToLogin };
  },
};
</script>

<style scoped>
.dashboard {
  text-align: center;
  padding: 20px;
}

nav ul {
  display: flex;
  justify-content: center;
  padding: 0;
  gap: 15px;
}

nav ul li {
  list-style: none;
}

nav ul li a, button {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
}

nav ul li a:hover, button:hover {
  text-decoration: underline;
}
</style>
