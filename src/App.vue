<script setup lang="ts">
import Navbar from './components/navbar/Navbar.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div class="bg-white min-h-screen">
    <Navbar v-if="route.name !== 'login'" />
    <router-view />
  </div>
</template>