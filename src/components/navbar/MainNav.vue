<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '@/lib/utils'
import UserNav from './UserNav.vue'
import { useRouter } from 'vue-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

const initialRole = localStorage.getItem('userRole') || 'student';
const userRole = ref(initialRole)
const router = useRouter()

const links = computed(() => {
  const commonLinks = [
    { href: '/home', label: 'Home Page' },
    { href: '/unidadescurriculares', label: 'Unidades Curriculares' },
    { href: '/pedidos', label: 'Pedidos' }
  ]

  if (userRole.value === 'diretor') {
    return [
      ...commonLinks,
      { href: '/salas', label: 'Salas' }
    ]
  } else {
    return [
      ...commonLinks,
      { href: '/horario', label: 'Horário' }
    ]
  }
})

const toggleRole = () => {
  const newRole = userRole.value === 'student' ? 'diretor' : 'student'
  userRole.value = newRole
  localStorage.setItem('userRole', newRole)
  
  if (newRole === 'student') {
    router.push('/aluno')
  } else {
    router.push('/docente')
  }
}
</script>

<template>
  <nav :class="cn('flex items-center justify-between w-full border-none', $attrs.class ?? '')">
    <div class="flex items-center space-x-4 lg:space-x-6">
      <a
        v-for="(link, index) in links.slice(0, 3)"
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
      
      <a
        v-for="link in links.slice(3)"
        :key="link.href"
        :href="link.href"
        class="text-sm font-medium text-black transition-colors hover:text-primary"
      >
        {{ link.label }}
      </a>
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