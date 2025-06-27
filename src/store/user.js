import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: localStorage.getItem('user_id') || null,
  }),

  actions: {
    login(id) {
      this.userId = id.trim();
      localStorage.setItem('user_id', this.userId, );
    },

    logout() {
      this.userId = null;
      localStorage.removeItem('user_id');
    },
  },
  persist: true,
});
