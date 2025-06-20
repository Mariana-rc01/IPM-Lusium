<template>
  <div class="w-full max-w-md mx-auto">
    <SuccessAlert
      v-if="successMessage"
      :message="successMessage"
      class="mb-4"
    />
    <ErrorAlert
      v-if="errorMessage"
      :message="errorMessage"
      class="mb-4"
    />
    <div class="bg-green-50 rounded-lg shadow-sm border border-green-100 overflow-hidden">
      <div class="flex justify-between items-center p-4 pb-2">
        <h3 class="text-base font-semibold text-gray-900">
          {{ isCreate ? 'Criar um pedido' : getTitle() }}
        </h3>
        <div class="flex items-center gap-2">
          <div v-if="!isCreate && !isSidebar" class="relative group">
            <button
              @click="toggleMarked"
              class="p-1 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Marcar pedido"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                :fill="isMarked ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-amber-500"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>
            <div class="absolute top-full mt-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div class="absolute -top-1 right-4 w-3 h-3 bg-white border-l border-t border-green-500 transform -rotate-45"></div>
              <div class="w-72 border border-green-500 rounded-md bg-white p-3 shadow-lg">
                <div class="flex items-start space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <div>
                    <p class="text-green-600 text-sm">Marcar pedido para trabalhar na sidebar.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!isSidebar" class="text-gray-700 hover:bg-gray-200 rounded-full p-1 cursor-pointer" @click="closeRequest" aria-label="Fechar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </div>
          <div v-else class="w-5 h-5"></div>
        </div>
      </div>

      <div class="px-4 pb-2">
        <p :class="isCreate ? 'text-green-600' : 'text-green-600 text-sm'">
          {{ isCreate
            ? (isDirector ? 'Este pedido será comunicado aos alunos e docentes'
                          : 'Este pedido será comunicado ao diretor de curso')
            : getSubtitle() }}
        </p>
      </div>

      <div class="px-4 space-y-3 pb-4">
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

        <template v-else>
          <template v-if="!isFromDirector">
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
          </template>

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

          <template v-if="showResponseNotes && info.response">
            <div>
              <label class="block text-gray-900 text-sm font-medium mb-1">Notas</label>
              <div class="border border-gray-300 rounded-md p-2 bg-white text-sm min-h-[80px]">
                {{ info.response || '\u00A0' }}
              </div>
            </div>
          </template>

          <template v-if="isDirector && !isFromDirector">
            <div>
              <label class="block text-gray-900 text-sm font-medium mb-1">Notas (opcional)</label>
              <textarea
                v-model="directorResponse"
                class="border border-gray-300 rounded-md p-2 bg-white text-sm min-h-[80px] w-full"
              ></textarea>
            </div>
          </template>
        </template>
      </div>

      <div class="px-4 pb-4 flex justify-end space-x-2">
      <template v-if="isCreate">
        <div class="relative group">
          <button
            @click="submitRequest"
            :disabled="!newSubject || !newDescription"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Enviar
          </button>
          <div
            v-if="!newSubject || !newDescription"
            class="absolute bottom-full mb-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          >
            <div class="w-72 border border-red-500 rounded-md bg-white p-3 shadow-lg">
              <div class="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <div>
                  <p class="text-red-500 text-sm">Os campos do assunto e descrição devem ser preenchidos.</p>
                </div>
              </div>
            </div>
            <div class="absolute -bottom-1 right-4 w-3 h-3 bg-white border-r border-b border-red-500 transform rotate-45"></div>
          </div>
        </div>
      </template>
      <template v-else-if="isDirector && !isFromDirector">
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
import { ref, onMounted, computed, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'
import {
  getRequestByTicketId,
  updateRequest,
  createRequest,
  getUserInfoById
} from '@/api/api'
import { useUserStore } from '@/stores/user'
import SuccessAlert from '../popup/SuccessAlert.vue'
import ErrorAlert from '../popup/ErrorAlert.vue'
import { useMarkedTicketStore } from '@/stores/markedTicket'

const emit = defineEmits(['close', 'created', 'marked']);
const props = defineProps<{
  ticketId?: string
  userType: string
  isCreate?: boolean
  isSidebar?: boolean
}>()

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
const newSubject = ref('')
const newDescription = ref('')

onMounted(() => {
  if (isCreate.value) {
    newSubject.value = localStorage.getItem('ticket.newSubject') || ''
    newDescription.value = localStorage.getItem('ticket.newDescription') || ''
  }

  if (isDirector.value && !isFromDirector.value) {
    directorResponse.value = localStorage.getItem(`ticket.response`) || ''
  }
})
watch(newSubject, (val) => {
  localStorage.setItem('ticket.newSubject', val)
})
watch(newDescription, (val) => {
  localStorage.setItem('ticket.newDescription', val)
})
watch(directorResponse, (val) => {
  if (isDirector.value && !isFromDirector.value && props.ticketId) {
    localStorage.setItem(`ticket.response`, val)
  }
})
const isMarked = ref(false) // Estado para controlar se o pedido está marcado
const markedTicketStore = useMarkedTicketStore()

const isDirector = computed(() => props.userType === 'director')
const isCreate = computed(() => props.isCreate === true)
const isFromDirector = computed(() => info.value.sender === 'Diretor de Curso')
const isSidebar = computed(() => props.isSidebar === true)

const dataSenderId = ref<string | null>(null)

const showResponseNotes = computed(() => {
  const id = dataSenderId.value || ''
  const isStudent = id.startsWith('a')
  const isTeacher = id.startsWith('t')
  return (isStudent || isTeacher) && !isDirector.value
})

const successMessage = ref('')
const errorMessage = ref('')

watch(() => markedTicketStore.markedTicketId, (newMarkedTicketId) => {
  if (props.ticketId) {
    isMarked.value = newMarkedTicketId === props.ticketId
  }
}, { immediate: true })

const toggleMarked = () => {
  isMarked.value = !isMarked.value

  if (isMarked.value) {
    markedTicketStore.setMarkedTicketId(props.ticketId!)
  } else {
    markedTicketStore.clearMarkedTicketId()
  }

  emit('marked', {
    ticketId: props.ticketId,
    marked: isMarked.value
  })
}

const getTitle = () => {
  const id = dataSenderId.value || '';
  const isStudent = id.startsWith('a');
  const isTeacher = id.startsWith('t');
  const isDirector = id.startsWith('d');

  if (id === useUserStore().user?.id) {
    return `O teu pedido #${info.value.id}`;
  }

  if (isStudent || isTeacher || isDirector) {
    return `O pedido de ${info.value.sender}`;
  }

  return `Pedido #${info.value.id}`;
};

const getSubtitle = () =>
  isDirector.value
    ? 'Aqui podes gerir o pedido recebido.'
    : 'Aqui podes ver o estado do teu pedido.'

const closeRequest = () => emit('close')

const rejectRequest = async () => {
  await updateRequest(props.ticketId!, {
    status: 'Recusado',
    response: directorResponse.value
  })
  info.value.status = 'Recusado'
  info.value.response = directorResponse.value

  successMessage.value = "Pedido recusado com sucesso!"
  localStorage.removeItem('ticket.newSubject')
  localStorage.removeItem('ticket.newDescription')
  localStorage.removeItem(`ticket.response`)
}
const acceptRequest = async () => {
  await updateRequest(props.ticketId!, {
    status: 'Aceite',
    response: directorResponse.value
  })
  info.value.status = 'Aceite'
  info.value.response = directorResponse.value

  successMessage.value = "Pedido aceite com sucesso!"
  localStorage.removeItem('ticket.newSubject')
  localStorage.removeItem('ticket.newDescription')
  localStorage.removeItem(`ticket.response`)
}

const submitRequest = async () => {
  const userStore = useUserStore()
  const me = userStore.user!.id
  const today = new Date().toISOString().slice(0, 10)
  let recipient = 'all'
  if (userStore.user?.type === 'student' || userStore.user?.type === 'teacher') {
    recipient = 'd1'
  }
  const created = await createRequest({
    subject: newSubject.value,
    sender: me,
    recipient: recipient,
    date: today.split('-').reverse().join('-'),
    status: "",
    description: newDescription.value,
    response: ""
  })

  if (!created)

  successMessage.value = "Pedido enviado com sucesso!"
  localStorage.removeItem('ticket.newSubject')
  localStorage.removeItem('ticket.newDescription')
  localStorage.removeItem(`ticket.response`)

  emit('created')
}

const fill = ref('none')

onMounted(async () => {
  if (!isCreate.value && props.ticketId) {
    isMarked.value = markedTicketStore.markedTicketId === props.ticketId

    const data = await getRequestByTicketId(props.ticketId)
    if (data) {
      dataSenderId.value = data.sender
      const senderInfo = await getUserInfoById(data.sender)
      let senderName = senderInfo.name

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
      fill.value = isMarked.value ? 'currentColor' : 'none'
    }
  }
})

watch(isMarked, (newIsMarked) => {
    fill.value = newIsMarked ? 'currentColor' : 'none'
})
</script>
