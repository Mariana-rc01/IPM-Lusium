<script setup lang="ts">
import { ref, computed } from 'vue';
import { cn } from '@/lib/utils';
import UserNav from './UserNav.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const router = useRouter();
const userStore = useUserStore();
const user = computed(() => userStore.user);

const commonLinks = [
  { href: '/home', label: 'Home Page' },
  { href: '/courses', label: 'Unidades Curriculares' },
  { href: '/tickets', label: 'Pedidos' },
];

const scheduleLink = computed(() => user.value?.type === 'student'
  ? [{ href: `/schedule/${user.value.id}`, label: 'Horário' }]
  : []);

const showSalas = computed(() =>
  user.value?.type === 'director' || user.value?.type === 'teacher'
);

const showAlunosDropdown = computed(() =>
  user.value?.type === 'director'
);

</script>

<template>
  <nav :class="cn('flex items-center justify-between w-full border-none', $attrs.class ?? '')">
    <div class="flex items-center space-x-4 lg:space-x-6">
      <!-- Links comuns -->
      <a
        v-for="link in commonLinks"
        :key="link.href"
        :href="link.href"
        class="text-sm font-medium text-black transition-colors hover:text-primary"
      >
        {{ link.label }}
      </a>

      <!-- Dropdown Alunos -->
      <DropdownMenu v-if="showAlunosDropdown">
        <DropdownMenuTrigger class="text-sm font-medium text-black transition-colors hover:text-primary">
          Alunos
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" align="end">
          <DropdownMenuItem as-child>
            <a href="/students" class="w-full text-black">Todos os alunos</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem as-child>
            <a href="/students/non-allocated" class="w-full text-black">Alunos não alocados</a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Link Salas -->
      <a
        v-if="showSalas"
        href="/classrooms"
        class="text-sm font-medium text-black transition-colors hover:text-primary"
      >
        Salas
      </a>

      <!-- Horário para estudantes -->
      <a
        v-for="link in scheduleLink"
        :key="link.href"
        :href="link.href"
        class="text-sm font-medium text-black transition-colors hover:text-primary"
      >
        {{ link.label }}
      </a>
    </div>

    <div class="flex items-center space-x-4">
      <UserNav />
    </div>
  </nav>
</template>
