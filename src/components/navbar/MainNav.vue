<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import UserNav from './UserNav.vue';
import { Menu } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

const storedRole = localStorage.getItem('userRole') || 'student';
const userRole = ref(storedRole);
const router = useRouter();

const sidebar = inject('sidebar', {
  isOpen: ref(false),
  toggle: () => {}
});

const links = computed(() => {
  const commonLinks = [
    { href: '/homepage', label: 'Home Page' },
    { href: '/unidadescurriculares', label: 'Unidades Curriculares' },
    { href: '/pedidos', label: 'Pedidos' }
  ];

  if (userRole.value === 'diretor') {
    return [
      ...commonLinks,
      { href: '/salas', label: 'Salas' }
    ];
  } else {
    return [
      ...commonLinks,
      { href: '/horario', label: 'Horário' }
    ];
  }
});

const toggleRole = () => {
  const newRole = userRole.value === 'student' ? 'diretor' : 'student';
  userRole.value = newRole;
  localStorage.setItem('userRole', newRole);
  
  if (newRole === 'student') {
    router.push('/aluno');
  } else {
    router.push('/docente');
  }
};
</script>

<template>
  <nav class="bg-white flex items-center justify-between px-4 h-full">
    <div class="flex items-center space-x-6">
      <button 
        @click="sidebar.toggle" 
        class="p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none"
        aria-label="Abrir menu de pedidos"
      >
        <Menu class="h-6 w-6" />
      </button>
      
      <a
        v-for="link in links"
        :key="link.href"
        :href="link.href"
        class="text-sm font-medium text-black transition-colors hover:text-primary"
      >
        {{ link.label }}
      </a>
      
      <DropdownMenu v-if="userRole === 'diretor'">
        <DropdownMenuTrigger class="text-sm font-medium text-black transition-colors hover:text-primary">
          Alunos
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" align="end">
          <DropdownMenuItem as-child>
            <a href="/alunos" class="w-full text-black">Todos os alunos</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem as-child>
            <a href="/alunos/nao-alocados" class="w-full text-black">Alunos não alocados</a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    
    <div class="flex items-center space-x-4">
      <button
        @click="toggleRole"
        class="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
      >
        Alternar para {{ userRole === 'student' ? 'Diretor' : 'Aluno' }}
      </button>
      <UserNav />
    </div>
  </nav>
</template>