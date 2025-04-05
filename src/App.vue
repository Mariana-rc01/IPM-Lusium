<script setup lang="ts">
import Navbar from './components/navbar/Navbar.vue';
</script>

<template>
  <div class="bg-white min-h-screen">
    <Navbar />
    <router-view />
  </div>
</template>
