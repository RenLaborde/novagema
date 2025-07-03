<template>
  <div class="container">
    <h2>Market Prices</h2>
    <h4>Real-Time Crypto Prices at Your Fingertips.</h4>
    <p>Select a cryptocurrency and operation to see where it’s best to trade.</p>

    <div class="filters">
      <label>
        Cryptocurrency:
        <select v-model="selectedCrypto">
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

    <div v-if="bestExchange">
      <p>
        ✅ Best exchange to {{ operation }}: <strong>{{ bestExchange.name }}</strong> at
        <strong>{{ formatCurrencyARS(bestExchange.price) }}</strong>
      </p>
      <button class="copy-button" @click="copyBestExchange">
        {{ copied ? '✔ Copied!' : '📋 Copy Best Exchange Info' }}
      </button>
    </div>

    <div v-if="chartData" class="chart-section">
      <h4>Price Comparison</h4>
      <Bar :data="chartData" :options="chartOptions" />
    </div>

    <table v-if="Object.keys(filteredPrices).length">
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

    <p v-else>No data available for this selection.</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const prices = ref({});
const selectedCrypto = ref('btc');
const operation = ref('buy');
const searchQuery = ref('');
const error = ref(null);
const bestExchange = ref(null);
const copied = ref(false);
const chartData = ref(null);
const chartOptions = {
  responsive: true,
  indexAxis: 'y',
  plugins: {
    legend: { display: false },
    title: { display: false }
  },
  scales: {
    x: {
      ticks: {
        callback: function (value) {
          return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            notation: 'compact', // 👈 muestra 120M en lugar de $120.000.000,00
            maximumFractionDigits: 1
          }).format(value);
        },
        color: '#333',
        font: {
          size: 12
        }
      },
      grid: {
        color: '#eaeaea'
      }
    },
    y: {
      ticks: {
        color: '#333',
        font: {
          size: 12,
          weight: 'bold'
        }
      },
      grid: {
        display: false
      }
    }
  }
};

let intervalId = null;

const fetchCryptoPrices = async () => {
  try {
    const response = await fetch(`https://criptoya.com/api/${selectedCrypto.value}/ars`);
    const data = await response.json();
    prices.value = data;
    error.value = null;
    findBestExchange();
    updateChart();
  } catch (err) {
    error.value = 'Error fetching crypto prices.';
    console.error('Error fetching crypto prices:', err);
  }
};

const findBestExchange = () => {
  let best = null;
  for (const [exchange, data] of Object.entries(prices.value)) {
    const value = operation.value === 'buy' ? data.ask : data.bid;
    if (!value) continue;
    if (
      !best ||
      (operation.value === 'buy' && value < best.price) ||
      (operation.value === 'sell' && value > best.price)
    ) {
      best = { name: exchange, price: value };
    }
  }
  bestExchange.value = best;
};

const updateChart = () => {
  const entries = Object.entries(prices.value);
  const labels = entries.map(([exchange]) => exchange);
  const dataValues = entries.map(([_, data]) =>
    operation.value === 'buy' ? data.ask : data.bid
  );

  chartData.value = {
    labels,
    datasets: [
      {
        label: `Price (${operation.value.toUpperCase()})`,
        data: dataValues,
        backgroundColor: '#007bff'
      }
    ]
  };
};

const filteredPrices = computed(() => {
  if (!searchQuery.value) return prices.value;
  return Object.fromEntries(
    Object.entries(prices.value).filter(([exchange]) =>
      exchange.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

const formatCurrencyARS = (value) => {
  const number = Number(value);
  if (isNaN(number)) return '$\u00a00,00';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString('es-AR');
};

const copyBestExchange = async () => {
  if (!bestExchange.value) return;
  const message = `Best exchange to ${operation.value.toUpperCase()} ${selectedCrypto.value.toUpperCase()}: ${bestExchange.value.name} at ${formatCurrencyARS(bestExchange.value.price)}`;
  try {
    await navigator.clipboard.writeText(message);
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  } catch (err) {
    console.error('Error copying to clipboard:', err);
  }
};

watch(selectedCrypto, fetchCryptoPrices);
watch(operation, () => {
  findBestExchange();
  updateChart();
});

onMounted(() => {
  fetchCryptoPrices();
  intervalId = setInterval(fetchCryptoPrices, 60000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
.container {
  margin: auto;
  padding: 20px;
  max-width: 800px;
  border: 1px solid #007bff;
  border-radius: 8px;
  background: #f5f8f9;
  font-family: Arial, sans-serif;
  text-align: center;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}

.search-input {
  padding: 8px;
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.copy-button {
  margin-top: 10px;
  padding: 8px 14px;
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.copy-button:hover {
  background-color: #0056b3;
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

@media (max-width: 600px) {
  .filters {
    flex-direction: column;
    align-items: center;
  }
  table {
    font-size: 0.9rem;
  }
}

.chart-section {
  margin-top: 30px;
  margin-bottom: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
</style>