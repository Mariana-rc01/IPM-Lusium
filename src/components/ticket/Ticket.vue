<template>
  <div class="w-full max-w-md mx-auto">
    <div class="bg-green-50 rounded-lg shadow-sm border border-green-100 overflow-hidden">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 pb-2">
        <h3 class="text-base font-semibold text-gray-900">
          {{ isCreate ? 'Criar um pedido' : getTitle() }}
        </h3>
        <button @click="closeRequest" class="text-gray-700 hover:bg-gray-200 rounded-full p-1" aria-label="Fechar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Subtítulo -->
      <div class="px-4 pb-2">
        <p :class="isCreate ? 'text-green-600' : 'text-green-600 text-sm'">
          {{ isCreate
             ? 'Este pedido será comunicado aos alunos e docentes'
             : getSubtitle() }}
        </p>
      </div>

      <!-- Conteúdo -->
      <div class="px-4 space-y-3 pb-4">
        <!-- Modo CRIAR -->
        <template v-if="isCreate">
          <div>
            <label class="block text-gray-900 text-sm font-medium mb-1">Assunto</label>
            <input
              v-model="newSubject"
              type="text"
              placeholder="Indique o assunto"
              class="w-full border border-gray-300 rounded-md p-2 bg-white text-sm"
            />
          </div>

          <div>
            <label class="block text-gray-900 text-sm font-medium mb-1">Descrição</label>
            <textarea
              v-model="newDescription"
              placeholder="Apresente aqui a informação relevante para descrever o assunto indicado"
              class="w-full border border-gray-300 rounded-md p-2 bg-white text-sm min-h-[80px]"
            ></textarea>
          </div>
        </template>

        <!-- Modo VISUALIZAR/EDITAR -->
        <template v-else>
          <div class="flex items-center">
            <span class="text-sm font-medium text-gray-900 mr-2">Estado:</span>
            <span
              :class="{
                'text-red-600': info.status === 'Recusado',
                'text-green-600': info.status === 'Aceite',
                'text-gray-600': info.status === 'Enviado' || info.status === 'Recebido'
              }"
              class="text-sm font-medium"
            >
              {{ info.status }}
            </span>
          </div>

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

          <!-- Controles só para diretor -->
          <template v-if="isDirector">
            <div>
              <label class="block text-gray-900 text-sm font-medium mb-1">Resposta (opcional)</label>
                <textarea
                v-model="directorResponse"
                class="border border-gray-300 rounded-md p-2 bg-white text-sm min-h-[80px] w-full"
              ></textarea>
            </div>
          </template>
        </template>
      </div>

      <!-- Botões de ação -->
      <div class="px-4 pb-4 flex justify-end space-x-2">
        <!-- RESET da área de botões -->
        <template v-if="isCreate">
          <button
            @click="submitRequest"
            :disabled="!newSubject || !newDescription"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Enviar
          </button>
        </template>
        <template v-else-if="isDirector">
          <button @click="rejectRequest" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
            Recusar
          </button>
          <button @click="acceptRequest" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
            Aceitar
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { defineProps, defineEmits } from 'vue'
import {
  getRequestByTicketId,
  updateRequest,
  createRequest,
  getUserInfoById
} from '@/api/api'
import { useUserStore } from '@/stores/user'

const emit = defineEmits(['close','created']);
const props = defineProps<{
  ticketId?: string
  userType: string
  isCreate?: boolean
}>()

// estado interno
interface RequestInfo {
  id: string
  status: string
  subject: string
  description: string
  response?: string
  sender: string
}
const info = ref<RequestInfo>({
  id: '',
  status: 'Pendente',
  subject: '',
  description: '',
  response: '',
  sender: ''
})
const directorResponse = ref('')

// novos campos para criação
const newSubject = ref('')
const newDescription = ref('')

// helpers
const isDirector = computed(() => props.userType === 'director')
const isCreate = computed(() => props.isCreate === true)
const getTitle = () =>
  `O pedido de ${info.value.sender}`
const getSubtitle = () =>
  isDirector.value
    ? 'Aqui podes gerir o pedido recebido.'
    : 'Aqui podes ver o estado do teu pedido.'

// fechar modal
const closeRequest = () => emit('close')

// aceitar/recusar (diretor)
const rejectRequest = async () => {
  await updateRequest(props.ticketId!, {
    status: 'Recusado',
    response: directorResponse.value
  })
  info.value.status = 'Recusado'
  info.value.response = directorResponse.value
}
const acceptRequest = async () => {
  await updateRequest(props.ticketId!, {
    status: 'Aceite',
    response: directorResponse.value
  })
  info.value.status = 'Aceite'
  info.value.response = directorResponse.value
}

// criar novo pedido
const submitRequest = async () => {
  const userStore = useUserStore()
  const me = userStore.user!.id
  const today = new Date().toISOString().slice(0, 10)  // "YYYY-MM-DD"
  const created = await createRequest({
    subject: newSubject.value,
    sender: me,
    recipient: 'd1',      // Diretor de curso
    date: today,
    status: "",
    description: newDescription.value,
    response: ""
  })

  if (!created)
    console.log(created)

  emit('created')
}

// carregar dados existentes
onMounted(async () => {
  if (!isCreate.value && props.ticketId) {
    const data = await getRequestByTicketId(props.ticketId)
    if (data) {
    const senderNamePromise = await getUserInfoById(data.sender)
    let senderName = senderNamePromise.name

    if (data.sender.charAt(0) === "d") {
      senderName = "Diretor de Curso"
    }

      info.value = {
        id: data.id,
        status: data.status || 'Pendente',
        subject: data.subject,
        description: data.description,
        response: data.response,
        sender: senderName
      }
      directorResponse.value = data.response || ''
    }
  }
})
</script>
