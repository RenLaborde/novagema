<template>
  <div class="analysis-container">
    <div class="header">
      <button class="btn-back" @click="goDashboard">&larr; Back to Dashboard</button>
      <h2>Analysis</h2>
      <p>Analyze your crypto portfolio performance.</p>
    </div>

    <div class="table-section">
      <table class="styled-table">
        <thead>
          <tr>
            <th>Crypto</th>
            <th>Amount</th>
            <th>Current value (ARS)</th>
            <th>Total invested (ARS)</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, code) in cryptoData" :key="code">
            <td>{{ code.toUpperCase() }}</td>
            <td>{{ entry.amount.toFixed(4) }}</td>
            <td>{{ formatCurrency(entry.totalValue) }}</td>
            <td>{{ formatCurrency(entry.totalSpent) }}</td>
            <td :class="getResultClass(entry.totalValue, entry.totalSpent)">
              {{ formatCurrency(entry.totalValue - entry.totalSpent) }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="2">Total</td>
            <td>{{ formatCurrency(totalValue) }}</td>
            <td>{{ formatCurrency(totalSpentTotal) }}</td>
            <td :class="getResultClass(totalValue, totalSpentTotal)">
              {{ formatCurrency(totalValue - totalSpentTotal) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="chart-section">
      <h3>Current Distribution</h3>
      <Pie :data="chartData" />

      <h3>Investment vs Value (Bar)</h3>
      <Bar :data="barChartData" />

      <h3>Profit/Loss per Crypto</h3>
      <Doughnut :data="doughnutData" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { getUserTransactions, getCryptoPrice } from '@/services/apiClient'
import { Pie, Bar, Doughnut } from 'vue-chartjs'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale)

const router = useRouter()
const goDashboard = () => router.push('/dashboard')

const userStore = useUserStore()
const userId = userStore.userId

const transactions = ref([])
const cryptoData = ref({})
const totalValue = ref(0)

const chartData = ref({ labels: [], datasets: [] })
const barChartData = ref({ labels: [], datasets: [] })
const doughnutData = ref({ labels: [], datasets: [] })

const totalSpentTotal = computed(() => {
  return Object.values(cryptoData.value).reduce((sum, entry) => sum + entry.totalSpent, 0)
})

const formatCurrency = (value) => {
  const n = Number(value)
  if (isNaN(n)) return '$ 0,00'
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(n)
}

const getResultClass = (value, spent) => {
  return value - spent >= 0 ? 'positive' : 'negative'
}

const fetchTransactions = async () => {
  if (!userId) return
  try {
    transactions.value = await getUserTransactions(userId)
    await processData()
  } catch (error) {
    console.error('Error fetching transactions:', error)
  }
}

const processData = async () => {
  cryptoData.value = {}
  totalValue.value = 0

  const uniqueCodes = [...new Set(transactions.value.map(t => t.crypto_code))]
  const prices = {}

  await Promise.all(uniqueCodes.map(async (code) => {
    try {
      prices[code] = await getCryptoPrice(code)
    } catch (err) {
      prices[code] = 0
      console.error(`Error getting price for ${code}:`, err)
    }
  }))

  for (const t of transactions.value) {
    const code = t.crypto_code
    const amount = parseFloat(t.crypto_amount)
    const money = parseFloat(t.money)

    if (!cryptoData.value[code]) {
      cryptoData.value[code] = { amount: 0, totalSpent: 0, totalValue: 0 }
    }

    if (t.action === 'purchase') {
      cryptoData.value[code].amount += amount
      cryptoData.value[code].totalSpent += money
    } else if (t.action === 'sale') {
      cryptoData.value[code].amount -= amount
      cryptoData.value[code].totalSpent -= money
    }
  }

  const labels = []
  const values = []
  const invested = []
  const profits = []

  for (const code in cryptoData.value) {
    const entry = cryptoData.value[code]
    entry.totalValue = parseFloat((entry.amount * prices[code]).toFixed(2))
    entry.totalSpent = parseFloat(entry.totalSpent.toFixed(2))
    totalValue.value += entry.totalValue

    labels.push(code.toUpperCase())
    values.push(entry.totalValue)
    invested.push(entry.totalSpent)
    profits.push(parseFloat((entry.totalValue - entry.totalSpent).toFixed(2)))
  }

  chartData.value = {
    labels,
    datasets: [{
      label: 'Balance (ARS)',
      data: values,
      backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
      borderWidth: 1
    }]
  }

  barChartData.value = {
    labels,
    datasets: [
      {
        label: 'Invested',
        data: invested,
        backgroundColor: '#ffc107'
      },
      {
        label: 'Current Value',
        data: values,
        backgroundColor: '#007bff'
      }
    ]
  }

  doughnutData.value = {
    labels,
    datasets: [{
      label: 'Profit/Loss',
      data: profits,
      backgroundColor: profits.map(p => p >= 0 ? '#28a745' : '#dc3545')
    }]
  }
}

onMounted(fetchTransactions)
</script>

<style scoped>
.analysis-container {
  margin: auto;
  padding: 20px;
  max-width: 1000px;
  border: 1px solid #007bff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: #f5f8f9;
  font-family: Arial, sans-serif;
  text-align: center;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.btn-back {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #007bff;
}
.table-section {
  margin-bottom: 30px;
  overflow-x: auto;
}
.styled-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
}
.styled-table th,
.styled-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}
.styled-table thead {
  background-color: #007bff;
  color: white;
}
.total-row td {
  font-weight: bold;
  background-color: #f4f4f4;
}
.positive {
  color: green;
}
.negative {
  color: red;
}
.chart-section {
  max-width: 800px;
  margin: 40px auto;
  display: grid;
  gap: 30px;
  grid-template-columns: 1fr;
}
@media (max-width: 500px) {
  .styled-table th,
  .styled-table td {
    padding: 8px;
    font-size: 0.9rem;
  }
  .chart-section {
    grid-template-columns: 1fr;
  }
}
</style>
