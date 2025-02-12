import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
  }),

  actions: {
    loadUser() {
      // Load user from localStorage when the app starts
      this.userId = localStorage.getItem("user_id") || null;
    },

    login(id) {
      this.userId = id.trim();
      localStorage.setItem("user_id", this.userId);
    },

    logout() {
      this.userId = null;
      localStorage.removeItem("user_id");
    }
  },
  persist: true, 
});
