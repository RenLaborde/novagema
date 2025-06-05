<template> 
  <div class="container">
    <h2>Real-Time Crypto Prices at Your Fingertips!</h2>
    <input v-model="searchQuery" placeholder="Search exchange..." class="search-input" />
    <table>
      <thead>
        <tr>
          <th>Exchange</th>
          <th>Buy Price (ARS)</th>
          <th>Sell Price (ARS)</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(price, exchange) in filteredPrices" :key="exchange">
          <td>{{ exchange }}</td>
          <td class="buy-price">{{ formatPrice(price.bid) }}</td>
          <td class="sell-price">{{ formatPrice(price.ask) }}</td>
          <td>{{ formatDate(price.time) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue"; 

export default {
  setup() {
    const prices = ref({});
    const searchQuery = ref("");
    const error = ref(null);
    let intervalId = null;

    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch("https://criptoya.com/api/btc/ars");
        const data = await response.json();
        prices.value = data;
        error.value = null;
      } catch (err) {
        error.value = "Error fetching crypto prices.";
        console.error("Error fetching crypto prices:", err);
      }
    };

    const filteredPrices = computed(() => {
      if (!searchQuery.value) return prices.value;
      return Object.fromEntries(
        Object.entries(prices.value).filter(([exchange]) =>
          exchange.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      );
    });

    const formatDate = (timestamp) => {
      return new Date(timestamp * 1000).toLocaleString();
    };

    const formatPrice = (price) => {
      return price ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(price) : "N/A";
    };

    onMounted(() => {
      fetchCryptoPrices();
      intervalId = setInterval(fetchCryptoPrices, 60000); // Actualiza cada 60 segundos
    });

    onUnmounted(() => {
      if (intervalId) clearInterval(intervalId);
    });

    return { prices, searchQuery, filteredPrices, formatDate, formatPrice, error };
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  text-align: center;
}
.search-input {
  padding: 8px;
  margin-bottom: 10px;
  width: 50%;
  border: 1px solid #ddd;
  border-radius: 5px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}
th {
  background-color: #333;
  color: white;
}
.buy-price {
  color: green;
  font-weight: bold;
}
.sell-price {
  color: red;
  font-weight: bold;
}
.error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
</style>
