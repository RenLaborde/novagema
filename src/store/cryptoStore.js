import { defineStore } from "pinia";
import { fetchCryptoPrices } from "@/services/cryptoService";

export const useCryptoStore = defineStore("crypto", {
  state: () => ({
    data: [],
    loading: false,
    error: null
  }),
  actions: {
    async loadCryptoPrices() {
      this.loading = true;
      this.error = null;
      try {
        this.data = await fetchCryptoPrices();
      } catch (err) {
        this.error = "Error fetching data";
      } finally {
        this.loading = false;
      }
    }
  }
});