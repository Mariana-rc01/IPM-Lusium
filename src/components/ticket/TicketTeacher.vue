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
            v-model="request.notes"
            class="border border-gray-300 rounded-md p-2 w-full bg-white"
            rows="3"
          ></textarea>
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

interface TicketTeacherRequest {
  id: string;
  name: string;
  subject: string;
  description: string;
  notes?: string;
}
const request = ref<TicketTeacherRequest>({
  id: '',
  name: '',
  subject: '',
  description: '',
  notes: ''
});

const props = defineProps<{
  ticketId: string;
}>();

const closeCard = () => {
  emit('close');
};

onMounted(async () => {
  try {
    const data = await getRequestByTicketId(props.ticketId, 'teacher');
    request.value = data;
    console.log('Pedido do Professor:', request.value);
  } catch (error) {
    console.error('Erro ao buscar pedido do professor:', error);
  }
});
</script>