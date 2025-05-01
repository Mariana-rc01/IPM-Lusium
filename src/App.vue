<script setup lang="ts">
import { ref, provide } from 'vue';
import Navbar from './components/navbar/Navbar.vue';
import { useRoute } from 'vue-router';
import SideBar from './components/sidebar/SideBar.vue';

const route = useRoute();

const sidebarOpen = ref(false);

provide('sidebar', {
  isOpen: sidebarOpen,
  toggle: () => (sidebarOpen.value = !sidebarOpen.value),
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <SideBar />

    <div
      class="min-h-screen flex flex-col transition-all duration-300 ease-in-out"
      :style="{
        marginLeft: sidebarOpen ? '340px' : '0',
        width: sidebarOpen ? 'calc(100% - 340px)' : '100%'
      }"
    >
      <div
        v-show="route.name !== 'login'"
        class="fixed top-0 left-0 right-0 z-10 bg-white transition-all duration-300 ease-in-out"
        :style="{
          marginLeft: sidebarOpen ? '340px' : '0',
          width: sidebarOpen ? 'calc(100% - 340px)' : '100%'
        }"
      >
        <Navbar />
      </div>

      <main
        class="flex-1 overflow-y-auto"
        :class="{
          'pt-16': route.name !== 'login'
        }"
      >
        <router-view />
      </main>
    </div>
  </div>
</template>
