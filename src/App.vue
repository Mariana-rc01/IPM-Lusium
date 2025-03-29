<template>
  <div class="bg-gray-50 min-h-screen">
    <header class="p-4 bg-white border-b mb-4">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-xl font-bold mb-4">Demonstração do Componente de Horário</h1>
        <div class="flex gap-4">
          <button 
            @click="currentView = 'student'" 
            class="px-4 py-2 rounded-md"
            :class="currentView === 'student' ? 'bg-green-500 text-white' : 'bg-gray-200'"
          >
            Visão do Aluno
          </button>
          <button 
            @click="currentView = 'teacher'" 
            class="px-4 py-2 rounded-md"
            :class="currentView === 'teacher' ? 'bg-green-500 text-white' : 'bg-gray-200'"
          >
            Visão do Docente
          </button>
        </div>
      </div>
    </header>

    <!-- Switches the component/view/page rendered according to a variable -->
    <component :is="currentView === 'student' ? StudentView : TeacherView" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import StudentView from './views/StudentView.vue';
import TeacherView from './views/TeacherView.vue';

const currentView = ref<'student' | 'teacher'>('student');
</script>