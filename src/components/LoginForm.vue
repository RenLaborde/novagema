<template>
  <div class="container d-flex justify-content-center align-items-center vh-100 login-bg">
    <div class="card p-4 shadow-lg nova-card">
      <h2 class="text-center mb-2 login-title">Log in to NovaGema</h2>
      <p class="text-muted text-center login-subtitle">Your crystal access to the crypto galaxy 🔮</p>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="userId" class="form-label">Alphanumeric ID</label>
          <input 
            type="text" 
            id="userId" 
            v-model="userId" 
            class="form-control" 
            required 
          />
        </div>

        <button type="submit" class="btn btn-gema w-100">🔐 Enter</button>
      </form>

      <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const userStore = useUserStore();
    const router = useRouter();
    const userId = ref('');
    const errorMessage = ref('');

    onMounted(() => {   
      userId.value = userStore.userId || '';
      if (userStore.userId) {
        router.push('/dashboard'); 
      }
    });

    const handleLogin = () => {
      if (!/^[a-zA-Z0-9]+$/.test(userId.value)) {
        errorMessage.value = 'Invalid alphanumeric ID';
        return;
      }

      userStore.login(userId.value);
      router.push('/dashboard'); 
    };

    return { userId, errorMessage, handleLogin };
  }
};
</script>

<style scoped>
.login-bg {
  background: radial-gradient(circle at top left, #1f004d, #0c001a);
}

.nova-card {
  background-color: #f4f6ff;
  border-radius: 18px;
  border: 2px solid #6a5acd33;
}

.login-title {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #6a5acd;
  font-weight: bold;
}

.login-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
}

.btn-gema {
  background-color: #007bff;
  color: white;
  border: none;
  font-weight: bold;
  font-size: 1rem;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.btn-gema:hover {
  background-color: #0056b3;
}
</style>
