<template>
  <div class="container mx-auto p-4 max-w-7xl">
    <!-- Header -->
    <h1 class="text-2xl font-bold mb-1">Listagem de Pedidos</h1>
    <p class="text-emerald-500 mb-6">Aqui pode ver a listagem de todos os pedidos que efetuou</p>

    <!-- Search bar, filters, and create button -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-4">
        <!-- Search bar -->
        <div class="flex-none w-72">
          <Input
            v-model="searchQuery"
            placeholder="Procurar por assunto..."
            class="w-full border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        
        <!-- Filter buttons -->
        <div class="flex gap-2">
          <button 
            @click="setFilter('enviados')" 
            class="flex items-center gap-2 px-4 py-2 rounded-md text-sm"
            :class="activeFilter === 'enviados' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-white text-emerald-700 border border-dashed border-emerald-300'"
          >
            <SendIcon class="h-4 w-4" />
            Enviados
          </button>
          
          <button 
            @click="setFilter('recebidos')" 
            class="flex items-center gap-2 px-4 py-2 rounded-md text-sm"
            :class="activeFilter === 'recebidos' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-white text-emerald-700 border border-dashed border-emerald-300'"
          >
            <PackageOpen class="h-4 w-4" />
            Recebidos
          </button>
        </div>
      </div>
      
      <!-- Create new request button -->
      <button class="flex items-center gap-2 px-4 py-2 rounded-md text-sm border border-emerald-500 text-emerald-700 bg-white hover:bg-emerald-50">
        <PlusCircleIcon class="h-4 w-4" />
        Criar novo pedido
      </button>
    </div>

    <!-- Requests table -->
    <div class="border border-emerald-200 rounded-lg overflow-hidden">
      <table class="w-full table-fixed">
        <colgroup>
          <col class="w-[12%]" /> <!-- Código do Pedido -->
          <col class="w-[25%]" /> <!-- Assunto -->
          <col class="w-[12%]" /> <!-- Remetente -->
          <col class="w-[20%]" /> <!-- Destinatário -->
          <col class="w-[12%]" /> <!-- Data -->
          <col class="w-[14%]" /> <!-- Estado -->
          <col class="w-[5%]" /> <!-- Ações -->
        </colgroup>
        <thead>
          <tr class="border-b border-emerald-200">
            <th class="py-3 px-4 text-left text-emerald-600 font-medium text-sm">Código do Pedido</th>
            <th class="py-3 px-4 text-left text-emerald-600 font-normal text-sm">
              <button @click="sortBy('assunto')" class="flex items-center">
                Assunto
                <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
              </button>
            </th>
            <th class="py-3 px-4 text-left text-emerald-600 font-normal text-sm">Remetente</th>
            <th class="py-3 px-4 text-left text-emerald-600 font-normal text-sm">Destinatário</th>
            <th class="py-3 px-4 text-left text-emerald-600 font-normal text-sm">
              {{ activeFilter === 'enviados' ? 'Data de envio' : 'Data de recepção' }}
            </th>
            <th class="py-3 px-4 text-left text-emerald-600 font-normal text-sm">
              <button @click="sortBy('estado')" class="flex items-center">
                Estado do pedido
                <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
              </button>
            </th>
            <th class="py-3 px-4 w-10"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pedido in paginatedPedidos" :key="pedido.codigo" class="cursor-pointer hover:bg-gray-100" @click="openCard(pedido)">
            <td class="py-3 px-4">{{ pedido.codigo }}</td>
            <td class="py-3 px-4">{{ pedido.assunto }}</td>
            <td class="py-3 px-4">{{ pedido.remetente }}</td>
            <td class="py-3 px-4">{{ pedido.destinatario }}</td>
            <td class="py-3 px-4">{{ pedido.data }}</td>
            <td class="py-3 px-4 text-sm">
              <div class="flex items-center">
                <div v-if="pedido.estado === 'Enviado'" class="flex items-center">
                  <CircleIcon class="h-4 w-4 mr-2 text-gray-500" />
                  Enviado
                </div>
                <div v-else-if="pedido.estado === 'Aceite'" class="flex items-center">
                  <CheckIcon class="h-4 w-4 mr-2 text-emerald-500" />
                  Aceite
                </div>
                <div v-else-if="pedido.estado === 'Recusado'" class="flex items-center">
                  <XIcon class="h-4 w-4 mr-2 text-red-500" />
                  Recusado
                </div>
                <div v-else-if="pedido.estado === 'Recebido'" class="flex items-center">
                  <CircleIcon class="h-4 w-4 mr-2 text-gray-500" />
                  Recebido
                </div>
              </div>
            </td>
            <td class="py-3 px-4 text-sm text-center">
              <button class="text-gray-700 hover:text-gray-900">
                <Trash2 class="h-5 w-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end items-center mt-4 gap-8">
      <div class="flex items-center gap-2">
        <span class="text-sm">Linhas por página</span>
        <Select v-model="rowsPerPage">
          <SelectTrigger class="compact-select-trigger border-emerald-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div class="flex items-center gap-4">
        <span class="text-sm">Página {{ currentPage }} de {{ totalPages }}</span>
        <div class="flex gap-1">
          <button 
            @click="goToPage(1)" 
            :disabled="currentPage === 1"
            class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center"
          >
            <ChevronsLeftIcon class="h-4 w-4" />
          </button>
          <button 
            @click="goToPage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center"
          >
            <ChevronLeftIcon class="h-4 w-4" />
          </button>
          <button 
            @click="goToPage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center"
          >
            <ChevronRightIcon class="h-4 w-4" />
          </button>
          <button 
            @click="goToPage(totalPages)" 
            :disabled="currentPage === totalPages"
            class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center"
          >
            <ChevronsRightIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
      <!-- CardTeacher Modal -->
      <div v-if="selectedRequest" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <component
        :is="activeCardComponent"
        :request="selectedRequest"
        @close="closeCard"
        @accept="handleAccept"
        @reject="handleReject"
      />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'

  import TicketTeacher from '../components/ticket/TicketTeacher.vue'
  import TicketStudent from '../components/ticket/TicketStudent.vue'
  import TicketTeacherAnnouncement from '../components/ticket/TicketTeacherAnnouncement.vue'

  import { 
    ChevronLeftIcon, 
    ChevronsLeftIcon, 
    ChevronsRightIcon,
    ChevronsUpDownIcon,
    CircleIcon,
    CheckIcon,
    XIcon,
    Trash2,
    PlusCircleIcon,
    PackageOpen,
    SendIcon,
  } from 'lucide-vue-next'
  
  // Imports from shadcn-vue
  import { Input } from '@/components/ui/input'
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select'
  
  // Types
  interface Pedido {
    codigo: string
    assunto: string
    remetente: string
    destinatario: string
    data: string
    estado: 'Enviado' | 'Aceite' | 'Recusado' | 'Recebido'
  }
  
  // State
  const searchQuery = ref('')
  const activeFilter = ref<'enviados' | 'recebidos'>('enviados')
  const currentPage = ref(1)
  const rowsPerPage = ref('5')
  const sortColumn = ref<'assunto' | 'estado' | null>(null)
  const sortDirection = ref<'asc' | 'desc'>('asc')
  const selectedRequest = ref<Pedido | null>(null)
  
  // Example data
  const pedidosEnviados = ref<Pedido[]>([
    {
      codigo: 'P-8782',
      assunto: 'Mudança de turno',
      remetente: 'Eu',
      destinatario: 'Diretor de Curso',
      data: '17/02/2025',
      estado: 'Enviado'
    },
    {
      codigo: 'P-7878',
      assunto: 'Alteração de turno',
      remetente: 'Eu',
      destinatario: 'Diretor de Curso',
      data: '18/02/2025',
      estado: 'Aceite'
    },
    {
      codigo: 'P-7839',
      assunto: 'Turno de IPM',
      remetente: 'Eu',
      destinatario: 'Diretor de Curso',
      data: '18/02/2025',
      estado: 'Recusado'
    },
    {
      codigo: 'P-5562',
      assunto: 'Alteração do turno de CG',
      remetente: 'Eu',
      destinatario: 'Diretor de Curso',
      data: '19/02/2025',
      estado: 'Recusado'
    },
    {
      codigo: 'P-5160',
      assunto: 'Horário pouco flexível',
      remetente: 'Eu',
      destinatario: 'Diretor de Curso',
      data: '20/02/2025',
      estado: 'Enviado'
    },
    {
      codigo: 'P-5161',
      assunto: 'Alteração de horário de IPM',
      remetente: 'Eu',
      destinatario: 'Diretor de Curso',
      data: '20/02/2025',
      estado: 'Enviado'
    },
    {
      codigo: 'P-5162',
      assunto: 'Alteração de horário de IPM',
      remetente: 'Eu',
      destinatario: 'Diretor de Curso',
      data: '20/02/2025',
      estado: 'Enviado'
    },
    {
      codigo: 'P-5163',
      assunto: 'Alteração de horário de IPM',
      remetente: 'Eu',
      destinatario: 'Diretor de Curso',
      data: '20/02/2025',
      estado: 'Enviado'
    },
    {
      codigo: 'P-5164',
      assunto: 'Alteração de horário de IPM',
      remetente: 'Eu',
      destinatario: 'Diretor de Curso',
      data: '20/02/2025',
      estado: 'Aceite'
    },
    {
      codigo: 'P-5165',
      assunto: 'Alteração de horário de IPM',
      remetente: 'Eu',
      destinatario: 'Diretor de Curso',
      data: '20/02/2025',
      estado: 'Enviado'
    }
  ])
  
  const pedidosRecebidos = ref<Pedido[]>([
    {
      codigo: 'P-1782',
      assunto: 'Mudança de Sala',
      remetente: 'Diretor de Curso',
      destinatario: 'Eu/ Alunos e docentes',
      data: '17/02/2025',
      estado: 'Recebido'
    },
    {
      codigo: 'P-1878',
      assunto: 'Alteração de Sala IPM Teórica',
      remetente: 'Diretor de Curso',
      destinatario: 'Eu/ Alunos e docentes',
      data: '18/02/2025',
      estado: 'Recebido'
    },
    {
      codigo: 'P-2839',
      assunto: 'Mudanças de salas dos turnos SSI',
      remetente: 'Diretor de Curso',
      destinatario: 'Eu/ Alunos e docentes',
      data: '18/02/2025',
      estado: 'Recebido'
    },
    {
      codigo: 'P-3562',
      assunto: 'IPM - Alteração de salas',
      remetente: 'Diretor de Curso',
      destinatario: 'Eu/ Alunos e docentes',
      data: '19/02/2025',
      estado: 'Recebido'
    },
    {
      codigo: 'P-4160',
      assunto: 'Alteração temporária de salas',
      remetente: 'Diretor de Curso',
      destinatario: 'Eu/ Alunos e docentes',
      data: '20/02/2025',
      estado: 'Recebido'
    },
    {
      codigo: 'P-4161',
      assunto: 'Alteração de salas de SSI',
      remetente: 'Diretor de Curso',
      destinatario: 'Eu/ Alunos e docentes',
      data: '20/02/2025',
      estado: 'Recebido'
    },
    {
      codigo: 'P-4162',
      assunto: 'Alteração de salas de SSI',
      remetente: 'Diretor de Curso',
      destinatario: 'Eu/ Alunos e docentes',
      data: '20/02/2025',
      estado: 'Recebido'
    },
    {
      codigo: 'P-4163',
      assunto: 'Alteração de salas de SSI',
      remetente: 'Diretor de Curso',
      destinatario: 'Eu/ Alunos e docentes',
      data: '20/02/2025',
      estado: 'Recebido'
    },
    {
      codigo: 'P-4164',
      assunto: 'Alteração de salas de SSI',
      remetente: 'Diretor de Curso',
      destinatario: 'Eu/ Alunos e docentes',
      data: '20/02/2025',
      estado: 'Recebido'
    },
    {
      codigo: 'P-4165',
      assunto: 'Alteração de salas de SSI',
      remetente: 'Diretor de Curso',
      destinatario: 'Eu/ Alunos e docentes',
      data: '20/02/2025',
      estado: 'Recebido'
    },
    {
      codigo: 'P-4166',
      assunto: 'Alteração de salas de SSI',
      remetente: 'Diretor de Curso',
      destinatario: 'Eu/ Alunos e docentes',
      data: '20/02/2025',
      estado: 'Recebido'
    },
    {
      codigo: 'P-4167',
      assunto: 'Alteração de salas de SSI',
      remetente: 'Diretor de Curso',
      destinatario: 'Eu/ Alunos e docentes',
      data: '20/02/2025',
      estado: 'Recebido'
    }
  ])

  const activeCardComponent = ref<typeof TicketStudent | typeof TicketTeacher | typeof TicketTeacherAnnouncement | null>(null)

  // Computed properties
  const filteredPedidos = computed(() => {
    const pedidos = activeFilter.value === 'enviados' ? pedidosEnviados.value : pedidosRecebidos.value
    
    // Apply search filter
    let result = pedidos
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(pedido => 
        pedido.assunto.toLowerCase().includes(query) ||
        pedido.codigo.toLowerCase().includes(query)
      )
    }
    
    // Apply sorting
    if (sortColumn.value) {
      result = [...result].sort((a, b) => {
        const valueA = a[sortColumn.value as keyof Pedido]
        const valueB = b[sortColumn.value as keyof Pedido]
        
        if (valueA < valueB) return sortDirection.value === 'asc' ? -1 : 1
        if (valueA > valueB) return sortDirection.value === 'asc' ? 1 : -1
        return 0
      })
    }
    
    return result
  })
  
  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(filteredPedidos.value.length / parseInt(rowsPerPage.value)))
  })
  
  const paginatedPedidos = computed(() => {
    const startIndex = (currentPage.value - 1) * parseInt(rowsPerPage.value)
    const endIndex = startIndex + parseInt(rowsPerPage.value)
    return filteredPedidos.value.slice(startIndex, endIndex)
  })
  
  // Methods
  const setFilter = (filter: 'enviados' | 'recebidos') => {
    activeFilter.value = filter
    currentPage.value = 1
  }

  const goToPage = (page: number) => {
    currentPage.value = page
  }
  
  const sortBy = (column: 'assunto' | 'estado') => {
    if (sortColumn.value === column) {
      // Reverse direction if the column is already selected
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      // New column selected
      sortColumn.value = column
      sortDirection.value = 'asc'
    }
  }

  const openCard = (pedido: Pedido) => {
    selectedRequest.value = pedido
    activeCardComponent.value = pedido.remetente === 'Diretor de Curso' ? TicketTeacher : TicketStudent
  }

  const closeCard = () => {
    selectedRequest.value = null
    activeCardComponent.value = null
  }

  const handleAccept = (request: Pedido) => {
    console.log('Accepted:', request)
    closeCard()
  }

  const handleReject = (request: Pedido) => {
    console.log('Rejected:', request)
    closeCard()
  }
  
  // Lifecycle hooks
  onMounted(() => {
    // Set "Enviados" as the default filter
    activeFilter.value = 'enviados'
  })
  </script>
  
  <style scoped>
  /* Custom style for compact select */
  .compact-select-trigger {
    height: 30px;
    min-width: 0;
    width: 45px;
    padding: 0 8px;
    font-size: 0.875rem;
  }
  
  .compact-select-trigger :deep(.flex) {
    gap: 0.25rem;
  }
  
  .compact-select-trigger :deep(svg) {
    height: 12px;
    width: 12px;
  }
  </style>
