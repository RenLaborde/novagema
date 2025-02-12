<template>
  <div>
    <button @click="fetchCryptoPrices">Refresh</button>
    <input v-model="searchQuery" placeholder="Search exchange..." />
    <table>
      <thead>
        <tr>
          <th>Exchange</th>
          <th>Buy Price (ARS)</th>
          <th>Sell Price (ARS)</th>
          <th>Buy (Total)</th>
          <th>Sell (Total)</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(price, exchange) in filteredPrices" :key="exchange">
          <td>{{ exchange }}</td>
          <td>{{ price.bid }}</td>
          <td>{{ price.ask }}</td>
          <td>{{ price.totalBid }}</td>
          <td>{{ price.totalAsk }}</td>
          <td>{{ formatDate(price.time) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      prices: {},
      searchQuery: "" // Para el filtro de búsqueda
    };
  },
  computed: {
    filteredPrices() {
      // Si no hay filtro, se muestran todas las cotizaciones
      if (!this.searchQuery) return this.prices;
      
      // Si hay filtro, se muestra solo las que coinciden con el nombre del exchange
      return Object.fromEntries(
        Object.entries(this.prices).filter(([exchange]) =>
          exchange.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      );
    }
  },
  methods: {
    async fetchCryptoPrices() {
      try {
        // Se obtiene la información de la API
        const response = await fetch("https://criptoya.com/api/btc/ars");
        this.prices = await response.json(); // Se guarda en la variable 'prices'
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      }
    },
    formatDate(timestamp) {
      // Se convierte la fecha en formato legible
      return new Date(timestamp * 1000).toLocaleString();
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
button {
  margin-bottom: 10px;
  padding: 5px 10px;
}
input {
  margin-bottom: 10px;
  padding: 5px;
}
</style>
