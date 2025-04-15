<template>
    <div class="w-full max-w-2xl mx-auto">
      
      <div class="bg-green-50 p-6 rounded-b-lg border border-green-100">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-semibold text-gray-900">
            O pedido de {{ request.name }}
          </h3>
          <button 
            @click="closeCard" 
            class="text-gray-700 hover:bg-gray-200 rounded-full p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <p class="text-green-500 text-sm mb-6">Podes ver aqui um pedido enviado!</p>
        
        <div class="space-y-4">
          <div>
            <label class="block text-gray-900 font-medium mb-1">Assunto</label>
            <div class="border border-gray-300 rounded-md p-2 bg-white">
              {{ request.subject || '\u00A0' }}
            </div>
          </div>
          
          <div>
            <label class="block text-gray-900 font-medium mb-1">Descrição</label>
            <div class="border border-gray-300 rounded-md p-2 bg-white min-h-[60px]">
              {{ request.description || '\u00A0' }}
            </div>
          </div>
          
          <div>
          <label class="block text-gray-900 font-medium mb-1">Notas (Opcional)</label>
          <textarea
            v-model="notes"
            class="w-full border border-gray-300 rounded-md p-2 bg-white min-h-[80px] resize-none"
            placeholder="Escreva aqui informação útil para o destinatário..."
          ></textarea>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button 
            @click="rejectRequest" 
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Recusar
          </button>
          <button 
            @click="acceptRequest" 
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue';
  
  const emit = defineEmits(['close', 'accept', 'reject']);
  
  const request = ref({
    name: 'Ana Margarida Campos Pires',
    subject: 'Troca de turno',
    description: 'Gostava de solicitar a troca do turno de IPM, para o turno PL4.',
    notes: 'Não foi possível alocar no PL4, mas consegui alocar no PL3, que ocorre no mesmo horário.'
  });

  defineProps({
  request: {
    type: Object,
    required: true
  }})
  
  const closeCard = () => {
    emit('close');
  };
  
  const acceptRequest = () => {
    emit('accept', request.value);
  };
  
  const rejectRequest = () => {
    emit('reject', request.value);
  };
  </script>