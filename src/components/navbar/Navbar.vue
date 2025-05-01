<script setup lang="ts">
import { inject, type Ref } from 'vue';
import MainNav from './MainNav.vue';
import { Menu } from 'lucide-vue-next'; // ícone de menu (hambúrguer)

const sidebar = inject('sidebar') as {
  isOpen: Ref<boolean>,
  toggle: () => void
};
</script>

<template>
  <div class="border-none">
    <div class="flex h-16 items-center px-5">
      <!-- Botão para abrir a sidebar -->
      <button
        @click="sidebar?.toggle()"
        class="p-2 rounded-md hover:bg-gray-100"
        aria-label="Abrir sidebar"
      >
        <Menu class="w-5 h-5" />
      </button>

      <MainNav class="mx-6" />
      <div class="ml-auto flex items-center space-x-4">
      </div>
    </div>
  </div>
</template>
