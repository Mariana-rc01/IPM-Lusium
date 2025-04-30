<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { X } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits(['update:isOpen']);

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('update:isOpen', false);
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
});

const closeSidebar = () => {
  emit('update:isOpen', false);
};
</script>

<template>
  <div>
    <aside 
      :class="cn(
        'fixed top-0 left-0 z-20 h-full w-80 bg-white transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0 border-r border-gray-200' : '-translate-x-full'
      )"
    >
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="font-semibold text-green-600">Criar um pedido</h2>
        <button 
          @click="closeSidebar"
          class="p-1 rounded-full hover:bg-gray-100"
          aria-label="Fechar sidebar"
        >
          <X class="h-5 w-5" />
        </button>
      </div>
      
      <div class="p-4 bg-green-50/50 h-[calc(100%-4rem-4rem)] overflow-y-auto">
        <p class="text-sm text-green-600 mb-4">Este pedido será comunicado ao diretor de curso</p>
        
        <div class="space-y-4">
          <div>
            <label for="sidebar-assunto" class="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
            <input 
              id="sidebar-assunto" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Indique o assunto"
            />
          </div>
          
          <div>
            <label for="sidebar-descricao" class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea 
              id="sidebar-descricao" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              rows="6"
              placeholder="Apresente aqui a informação relevante para descrever o assunto indicado"
            ></textarea>
          </div>
          
          <button class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors">
            Enviar
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>