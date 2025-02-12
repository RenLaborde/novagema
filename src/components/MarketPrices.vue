<template>
  <!-- <div>
    <h2 class="text-xl font-bold mb-4">Market Prices</h2>
    <button @click="loadCryptoPrices" class="bg-blue-500 text-white px-4 py-2 rounded mb-4">
      Refresh
    </button>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <table v-if="!loading && data.length > 0" class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">Exchange</th>
          <th class="border p-2">Crypto</th>
          <th class="border p-2">Buying Price (Ask)</th>
          <th class="border p-2">Selling Price (Bid)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="index">
          <td class="border p-2">{{ row.exchange }}</td>
          <td class="border p-2">{{ row.coin }}</td>
          <td class="border p-2">{{ row.ask }}</td>
          <td class="border p-2">{{ row.bid }}</td>
        </tr>
      </tbody>
    </table>
  </div> -->
</template>

<script>
//  import { onMounted } from "vue";

//  export default {
//   setup() {
//     const store = useCryptoStore();
//     const { data, loadCryptoPrices, loading, error } = store;

//     onMounted(() => {
//       loadCryptoPrices();
//     });

//     return { data, loadCryptoPrices, loading, error };
//   }
// };
</script>

<style scoped>
/* table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
th {
  background-color: #f4f4f4;
} */
</style>
