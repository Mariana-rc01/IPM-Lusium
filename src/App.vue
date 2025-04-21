<script setup lang="ts">
import { ref, provide } from 'vue';
import Navbar from './components/navbar/Navbar.vue';
import SideBar from './components/sidebar/SideBar.vue';

const sidebarOpen = ref(false);

provide('sidebar', {
  isOpen: sidebarOpen,
  toggle: () => sidebarOpen.value = !sidebarOpen.value
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <SideBar :isOpen="sidebarOpen" @update:isOpen="sidebarOpen = $event" />
    
    <div 
      class="min-h-screen flex flex-col transition-all duration-300 ease-in-out"
      :style="{ 
        marginLeft: sidebarOpen ? '320px' : '0', 
        width: sidebarOpen ? 'calc(100% - 320px)' : '100%'
      }"
    >
      <div class="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 transition-all duration-300 ease-in-out"
           :style="{ 
             marginLeft: sidebarOpen ? '320px' : '0', 
             width: sidebarOpen ? 'calc(100% - 320px)' : '100%'
           }">
        <Navbar />
      </div>
      
      <main class="flex-1 overflow-y-auto pt-16">
        <router-view />
      </main>
    </div>
  </div>
</template>