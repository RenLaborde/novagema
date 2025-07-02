<template>
  <div class="container">
    <h2>Market Prices</h2>
    <h4>Real-Time Crypto Prices at Your Fingertips.</h4>
    <p>Select a cryptocurrency and operation to see where it’s best to trade.</p>

    <div class="filters">
      <label>
        Cryptocurrency:
        <select v-model="selectedCrypto" @change="fetchCryptoPrices">
          <option value="btc">Bitcoin</option>
          <option value="eth">Ethereum</option>
          <option value="usdc">USDC</option>
        </select>
      </label>

      <label>
        Operation:
        <select v-model="operation">
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </label>

      <input
        v-model="searchQuery"
        placeholder="Search exchange..."
        class="search-input"
      />
    </div>

    <p v-if="bestExchange">
      ✅ Best exchange to {{ operation }}: <strong>{{ bestExchange.name }}</strong> at
      <strong>{{ formatCurrencyARS(bestExchange.price) }}</strong>
    </p>

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
          <td class="buy-price">{{ formatCurrencyARS(price.bid) }}</td>
          <td class="sell-price">{{ formatCurrencyARS(price.ask) }}</td>
          <td>{{ formatDate(price.time) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  setup() {
    const prices = ref({})
    const selectedCrypto = ref('btc')
    const operation = ref('buy')
    const searchQuery = ref('')
    const error = ref(null)
    const bestExchange = ref(null)
    let intervalId = null

    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch(`https://criptoya.com/api/${selectedCrypto.value}/ars`)
        const data = await response.json()
        prices.value = data
        error.value = null
        findBestExchange()
      } catch (err) {
        error.value = 'Error fetching crypto prices.'
        console.error('Error fetching crypto prices:', err)
      }
    }

    const findBestExchange = () => {
      let best = null

      for (const [exchange, data] of Object.entries(prices.value)) {
        const value = operation.value === 'buy' ? data.ask : data.bid
        if (!value) continue
        if (
          !best ||
          (operation.value === 'buy' && value < best.price) ||
          (operation.value === 'sell' && value > best.price)
        ) {
          best = { name: exchange, price: value }
        }
      }

      bestExchange.value = best
    }

    const filteredPrices = computed(() => {
      if (!searchQuery.value) return prices.value
      return Object.fromEntries(
        Object.entries(prices.value).filter(([exchange]) =>
          exchange.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      )
    })

    const formatCurrencyARS = (value) => {
      const number = Number(value)
      if (isNaN(number)) return '$ 0,00'
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(number)
    }

    const formatDate = (timestamp) => {
      return new Date(timestamp * 1000).toLocaleString('es-AR')
    }

    onMounted(() => {
      fetchCryptoPrices()
      intervalId = setInterval(fetchCryptoPrices, 60000)
    })

    onUnmounted(() => {
      if (intervalId) clearInterval(intervalId)
    })

    return {
      prices,
      selectedCrypto,
      operation,
      searchQuery,
      filteredPrices,
      formatDate,
      formatCurrencyARS,
      error,
      bestExchange
    }
  }
}
</script>

<style scoped>
.container {
  margin: auto;
  padding: 20px;
  border: 1px solid #007bff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: #f5f8f9;
  font-family: Arial, sans-serif;
  max-width: 800px;
  text-align: center;
}
.filters {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 10px;
}
.filters label {
  font-weight: bold;
}
.search-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th,
td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}
th {
  background-color: #007bff;
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
