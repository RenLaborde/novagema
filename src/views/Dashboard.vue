<template>
  <div class="dashboard-wrapper">
    <div class="orbit-gems">
      <div class="gem gem1"></div>
      <div class="gem gem2"></div>
      <div class="gem gem3"></div>
    </div>

    <div class="dashboard" v-if="userId">
      <h2 class="welcome-message">Welcome back to NovaGema 💎</h2>
      <p class="user-id">User ID: {{ userId }}</p>

      <nav>
        <ul>
          <li><button class="login-button" @click="goToLogin">↩ Back to Login</button></li>
          <li><router-link to="/dashboard/transactions">💰 Transactions</router-link></li>
          <li><router-link to="/dashboard/marketprices">📊 Market Prices</router-link></li>
          <li><router-link to="/dashboard/history">📜 History</router-link></li>
          <li><router-link to="/dashboard/analysis">📈 Analysis</router-link></li>
        </ul>
      </nav>

      <router-view />
    </div>

    <div v-else class="loading">
      <p>Loading NovaGema...</p>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'

const userStore = useUserStore()
const userId = computed(() => userStore.userId)
const router = useRouter()

onMounted(() => {
  if (!userId.value) {
    router.push('/')
  }
})

const goToLogin = () => {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-top: 20px;
}

.orbit-gems {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 80px;
  height: 80px;
}

.gem {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 10px solid #8A2BE2;
  position: absolute;
  animation: orbit 6s infinite linear;
  transform-origin: center;
}

.gem1 { top: 0; right: 0; animation-delay: 0s; }
.gem2 { top: 20px; right: 20px; animation-delay: 0.2s; }
.gem3 { top: 40px; right: 40px; animation-delay: 0.4s; }

@keyframes orbit {
  0% { transform: rotate(0deg) translateX(15px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(15px) rotate(-360deg); }
}

.dashboard {
  text-align: center;
  padding: 40px 20px;
  max-width: 1000px;
  background: linear-gradient(145deg, #e6f0ff, #f9fafe);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.welcome-message {
  font-size: 1.8rem;
  color: #6a5acd;
  margin-bottom: 10px;
}

.user-id {
  font-size: 14px;
  color: #555;
  margin-bottom: 30px;
}

nav ul {
  display: flex;
  justify-content: center;
  padding: 0;
  gap: 20px;
  flex-wrap: wrap;
}

nav ul li {
  list-style: none;
}

nav ul li a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  background-color: #ffffff;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #007bff;
  transition: all 0.3s ease;
}

nav ul li a:hover {
  background-color: #007bff;
  color: white;
  transform: translateY(-2px);
}

.login-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.login-button:hover {
  background-color: #0056b3;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
}
</style>
