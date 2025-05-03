<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/navbar/Navbar.vue';
import SideBar from './components/sidebar/SideBar.vue';
import { useSidebarStateStore } from '@/stores/sidebarState';

const route = useRoute();
const sidebarStore = useSidebarStateStore();

watch(
  () => sidebarStore.isOpen,
  (newVal) => {
    localStorage.setItem("sidebarState", JSON.stringify(newVal));
  },
  { immediate: true }
);
</script>

<template>
  <div class="min-h-screen bg-white">
    <SideBar />

    <div
      class="min-h-screen flex flex-col transition-all duration-300 ease-in-out"
      :style="{
        marginLeft: sidebarStore.isOpen ? '340px' : '0',
        width: sidebarStore.isOpen ? 'calc(100% - 340px)' : '100%'
      }"
    >
      <div
        v-show="route.name !== 'login'"
        class="fixed top-0 left-0 right-0 z-10 bg-white transition-all duration-300 ease-in-out"
        :style="{
          marginLeft: sidebarStore.isOpen ? '340px' : '0',
          width: sidebarStore.isOpen ? 'calc(100% - 340px)' : '100%'
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
