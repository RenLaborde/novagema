import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '@/views/LoginView.vue';
import Dashboard from '@/views/Dashboard.vue';
import Trading from '@/components/Trading.vue';
import History from '@/components/History.vue';
import MarketPrices from '@/components/MarketPrices.vue';
import Investments from '@/components/Investments.vue';
import { useUserStore } from '@/stores/user';

const routes = [
  { path: '/', name: 'Home', component: LoginForm },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard, 
    meta: { requiresAuth: true },
    children: [
      { path: 'trading', name: 'Trading', component: Trading },
      { path: 'history', name: 'History', component: History },
      { path: 'marketprices', name: 'MarketPrices', component: MarketPrices },
      { path: 'investments', name: 'Investments', component: Investments },
    ]
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.matched.some(record => record.meta.requiresAuth) && !userStore.userId) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
