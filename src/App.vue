<template>
  <div class="bg-white min-h-screen">
    <header v-if="$route.name !== 'login' && $route.name !== 'home'" class="p-4 bg-gray-50 border-b mb-4" >
      <div class="max-w-6xl mx-auto">
        <h1 class="text-xl font-bold mb-4">Demonstração do Componente de Horário</h1>
        <div class="flex gap-4">
          <router-link
            to="/aluno"
            class="px-4 py-2 rounded-md"
            :class="$route.name === 'student' ? 'bg-green-500 text-white' : 'bg-gray-200'"
          >
            Visão do Aluno
          </router-link>
          <router-link
            to="/docente"
            class="px-4 py-2 rounded-md"
            :class="$route.name === 'teacher' ? 'bg-green-500 text-white' : 'bg-gray-200'"
          >
            Visão do Docente
          </router-link>
        </div>
      </div>
    </header>

    <router-view />
  </div>
</template>
