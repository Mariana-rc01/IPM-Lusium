<template>
  <div class="w-full max-w-2xl mx-auto">
    <div class="bg-blue-50 p-6 rounded-b-lg border border-blue-100">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-semibold text-gray-900">
          Anúncio do pedido de {{ announcement.name }}
        </h3>
        <button 
          @click="closeCard" 
          class="text-gray-700 hover:bg-gray-200 rounded-full p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      
      <p class="text-blue-500 text-sm mb-6">Aqui está o anúncio do pedido!</p>
      
      <div class="space-y-4">
        <div>
          <label class="block text-gray-900 font-medium mb-1">Assunto</label>
          <div class="border border-gray-300 rounded-md p-2 bg-white">
            {{ announcement.subject || '\u00A0' }}
          </div>
        </div>
        
        <div>
          <label class="block text-gray-900 font-medium mb-1">Descrição</label>
          <div class="border border-gray-300 rounded-md p-2 bg-white min-h-[60px]">
            {{ announcement.description || '\u00A0' }}
          </div>
        </div>
        
        <div>
          <label class="block text-gray-900 font-medium mb-1">Notas (Opcional)</label>
          <textarea
            v-model="announcement.notes"
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

interface TicketTeacherAnnouncement {
  id: string;
  name: string;
  subject: string;
  description: string;
  notes?: string;
}
const announcement = ref<TicketTeacherAnnouncement>({
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
    announcement.value = data;
    console.log('Anúncio do Pedido do Professor:', announcement.value);
  } catch (error) {
    console.error('Erro ao buscar anúncio do pedido do professor:', error);
  }
});
</script>