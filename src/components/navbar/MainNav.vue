<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import UserNav from './UserNav.vue';
import { useUserStore } from '@/stores/user';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const userStore = useUserStore();
const user = computed(() => userStore.user);

const baseLinks = [
  { href: '/home', label: 'Home Page' },
  { href: '/courses', label: 'Unidades Curriculares' },
  { href: '/tickets', label: 'Pedidos' },
];

const scheduleLink = computed(() =>
  user.value?.type === 'student'
    ? [{ href: `/schedule/${user.value.id}`, label: 'Horário' }]
    : []
);

const showTeacherAlunos = computed(() =>
  user.value?.type === 'teacher'
);

const showDirectorAlunosDropdown = computed(() =>
  user.value?.type === 'director'
);

const showSalas = computed(() =>
  user.value?.type === 'director'
);
</script>

<template>
  <nav :class="cn('flex items-center justify-between w-full border-none', $attrs.class ?? '')">
    <div class="flex items-center space-x-4 lg:space-x-6">
      <a
        v-for="link in baseLinks"
        :key="link.href"
        :href="link.href"
        class="text-sm font-medium text-black transition-colors hover:text-primary"
      >
        {{ link.label }}
      </a>

      <a
        v-for="link in scheduleLink"
        :key="link.href"
        :href="link.href"
        class="text-sm font-medium text-black transition-colors hover:text-primary"
      >
        {{ link.label }}
      </a>

      <a
        v-if="showTeacherAlunos"
        href="/students"
        class="text-sm font-medium text-black transition-colors hover:text-primary"
      >
        Alunos
      </a>

      <!-- Dropdown menu for directors -->
      <DropdownMenu v-if="showDirectorAlunosDropdown">
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

      <a
        v-if="showSalas"
        href="/classrooms"
        class="text-sm font-medium text-black transition-colors hover:text-primary"
      >
        Salas
      </a>
    </div>

    <div class="flex items-center space-x-4">
      <UserNav />
    </div>
  </nav>
</template>
