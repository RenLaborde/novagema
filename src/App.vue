<template>
  <div id="app">
    <header class="global-header">
      <Logo class="logo" />
    </header>

    <main class="main-content">
      <router-view />
      <transition name="fade">
        <div v-if="showNotification" class="notification">
          {{ notificationMessage }}
        </div>
      </transition>
    </main>

    <footer class="global-footer">
      <p>TP Laborde — © 2025 NovaGema — Laboratorio III</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Logo from '@/components/Logo.vue';

const showNotification = ref(false);
const notificationMessage = ref('Welcome to NovaGema ✨');

onMounted(() => {
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 4000);
});
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at top left, #001f4d, #000c2b);
  position: relative;
}

.global-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100px;
  background-color: white;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo {
  max-height: 50px;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  position: relative;
}

.global-footer {
  text-align: center;
  padding: 20px;
  font-size: 14px;
  background-color: #ffffff;
  color: #999;
  border-top: 1px solid #ddd;
}

.notification {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #6a5acd;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  z-index: 2000;
  animation: fadeInSlide 0.4s ease-out;
}

@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
