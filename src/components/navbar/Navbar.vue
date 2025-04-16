<script setup lang="ts">
import MainNav from './MainNav.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
    <div v-if="userStore.user">
      <p> [DEBUG] {{ userStore.user.name }} é {{ userStore.user.type }}</p>
    </div>
    <div class="border-none">
      <div class="flex h-16 items-center px-5">
        <MainNav class="mx-6" />
        <div class="ml-auto flex items-center space-x-4">
        </div>
      </div>
    </div>
</template>