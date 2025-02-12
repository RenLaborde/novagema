<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow-lg" style="width: 400px;">
      <h2 class="text-center mb-4">Login</h2>
      <p class="text-muted text-center">Enter your Alphanumeric ID</p>
      
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

        <button type="submit" class="btn btn-primary w-100">Log In</button>
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
import { ref } from 'vue';

export default {
  setup() {
    const userStore = useUserStore();
    const router = useRouter();
    const userId = ref('');
    const errorMessage = ref('');

    const handleLogin = () => {
      if (!/^[a-zA-Z0-9]+$/.test(userId.value)) {
        errorMessage.value = 'Invalid alphanumeric ID';
        return;
      }

      userStore.login(userId.value);
      router.push('/dashboard'); // Redirect to main page
    };

    return { userId, errorMessage, handleLogin };
  }
};
</script>

<style scoped>
.card {
  border-radius: 15px;
}
.form-label {
  font-weight: bold;
}
</style>
