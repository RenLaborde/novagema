<template>
    <div class="logo">
      <img :src="logo" alt="Novagema Logo" />
    </div>
  </template>
  
  <script setup>
  import logo from '@/assets/logo.png';
  </script>
  
  <style scoped>
  .logo {
    position: fixed;
    top: 10px;
    left: 10px;
  }
  
  .logo img {
    width: 150px;
    height: auto;
  }
  </style>
  