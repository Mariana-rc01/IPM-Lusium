<template>
    <div class="w-full max-w-md mx-auto">
      <div class="bg-green-50 rounded-lg shadow-sm border border-green-100 overflow-hidden">
        <div class="flex justify-between items-center p-4 pb-2">
          <h3 class="text-base font-semibold text-gray-900">
            O teu pedido #{{ info.id }}
          </h3>
          <button 
            @click="closeRequest" 
            class="text-gray-700 hover:bg-gray-200 rounded-full p-1"
            aria-label="Fechar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div class="px-4 pb-2">
          <p class="text-green-600 text-sm">Podes ver aqui o teu pedido!</p>
        </div>
        
        <div class="px-4 pb-3">
          <div class="flex items-center">
            <span class="text-sm font-medium text-gray-900 mr-2">Estado:</span>
            <span 
              :class="{
                'text-red-600': info.status === 'Recusado',
                'text-green-600': info.status === 'Aceite',
                'text-yellow-600': info.status === 'Pendente'
              }"
              class="text-sm font-medium"
            >
              {{ info.status }}
            </span>
          </div>
        </div>
        
        <div class="px-4 space-y-3 pb-4">
          <div>
            <label class="block text-gray-900 text-sm font-medium mb-1">Assunto</label>
            <div class="border border-gray-300 rounded-md p-2 bg-white text-sm">
              {{ info.subject || '\u00A0' }}
            </div>
          </div>
          
          <div>
            <label class="block text-gray-900 text-sm font-medium mb-1">Descrição</label>
            <div class="border border-gray-300 rounded-md p-2 bg-white text-sm min-h-[80px]">
              {{ info.description || '\u00A0' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import { getRequestByTicketId } from '@/api/api';
  
  const emit = defineEmits(['close']);
  
  interface TicketStudentInfo {
    id: string;
    status: string;
    subject: string;
    description: string;
  }

  const info = ref<TicketStudentInfo>({
    id: "0",
    status: 'Pendente',
    subject: '',
    description: ''
  });

  
  const props = defineProps<{
    ticketId: string;
  }>();
  
  const closeRequest = () => {
    emit('close');
  };
  
  onMounted(async () => {
    try {
      const data = await getRequestByTicketId(props.ticketId, 'student');
      info.value = data;
      console.log('Pedido:', info.value);
    } catch (error) {
      console.error('Erro a buscar pedido:', error);
    }
  });
  </script>
  