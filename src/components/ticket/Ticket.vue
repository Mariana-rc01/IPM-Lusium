<template>
  <div class="w-full max-w-md mx-auto">
    <div class="bg-green-50 rounded-lg shadow-sm border border-green-100 overflow-hidden">
      <div class="flex justify-between items-center p-4 pb-2">
        <h3 class="text-base font-semibold text-gray-900">
          {{ getTitle() }}
        </h3>
        <button 
          @click="closeRequest" 
          class="text-gray-700 hover:bg-gray-200 rounded-full p-1"
          aria-label="Fechar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="px-4 pb-2">
        <p class="text-green-600 text-sm">{{ getSubtitle() }}</p>
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

        <template v-if="isDirector()">
          <div>
            <label class="block text-gray-900 text-sm font-medium mb-1">Nota (opcional)</label>
            <textarea v-model="directorNote" class="border border-gray-300 rounded-md p-2 bg-white text-sm min-h-[80px]"></textarea>
          </div>
        </template>
        
        <template v-if="isDirector()">
          <div class="flex justify-between mt-4">
            <button @click="rejectRequest" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
              Recusar
            </button>
            <button @click="acceptRequest" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
              Aceitar
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { getRequestByTicketId, updateRequest } from '@/api/api';

const emit = defineEmits(['close']);

interface TicketStudentInfo {
  id: string;
  status: string;
  subject: string;
  description: string;
}

const props = defineProps<{
  ticketId: string;
  userType: string;
}>();

const info = ref<TicketStudentInfo>({
  id: "0",
  status: 'Pendente',
  subject: '',
  description: ''
});
const directorNote = ref<string>('');

const closeRequest = () => {
  emit('close');
};

const rejectRequest = async () => {
  try {
    await updateRequest(props.ticketId, "student", { status: 'Recusado', note: directorNote.value });
    info.value.status = 'Recusado';
    console.log('Pedido recusado com nota:', directorNote.value);
  } catch (error) {
    console.error('Erro ao rejeitar pedido:', error);
  }
};

const acceptRequest = async () => {
  try {
    await updateRequest(props.ticketId, "student", {status: "Aceite", note: directorNote.value});
    info.value.status = 'Aceite';
    console.log('Pedido aceito com nota:', directorNote.value);
  } catch (error) {
    console.error('Erro ao aceitar pedido:', error);
  }
};

const getTitle = () => {
  if (isDirector()) {
    return `O pedido de ${info.value.subject}`;
  } else {
    return `O teu pedido #${info.value.id}`;
  }
};

const getSubtitle = () => {
  if (props.userType === 'director') {
    return 'Podes ver aqui o pedido enviado!';
  } else {
    return 'Podes ver aqui o teu pedido!';
  }
};

const isDirector = () => {
  return props.userType === 'director';
};

onMounted(async () => {
  try {
    const data = await getRequestByTicketId(props.ticketId, props.userType);
    info.value = data;
    console.log('Pedido:', info.value);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
  }
});
</script>
