// user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: '',
    users: [
      { userId: "user1", password: "123" },
      { userId: "user2", password: "123" }
    ]
  }),
  actions: {
    login(userId, password) {
      const user = this.users.find(user => user.userId === userId && user.password === password);
      if (user) {
        this.userId = userId;
        return true;
      }
      return false;
    },
    logout() {
      this.userId = '';
    }
  },
  persist: true
});