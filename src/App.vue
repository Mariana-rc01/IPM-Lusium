<script setup lang="ts">
import { ref, provide } from 'vue';
import Navbar from './components/navbar/MainNav.vue';
import SideBar from './components/sidebar/SideBar.vue';

const sidebarOpen = ref(false);

provide('sidebar', {
  isOpen: sidebarOpen,
  toggle: () => sidebarOpen.value = !sidebarOpen.value
});
</script>

<template>
  <div class="min-h-screen bg-white flex">
    <SideBar :isOpen="sidebarOpen" @update:isOpen="sidebarOpen = $event" />
    
    <div 
      class="min-h-screen flex flex-col transition-all duration-300 ease-in-out"
      :style="{ 
        marginLeft: sidebarOpen ? '320px' : '0', 
        width: sidebarOpen ? 'calc(100% - 320px)' : '100%'
      }"
    >
      <Navbar class="h-14 border-b border-gray-200 sticky top-0 z-10 bg-white" />
      
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>