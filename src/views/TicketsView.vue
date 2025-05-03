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
          <Input v-model="searchQuery" placeholder="Procurar por assunto..."
            class="w-full border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500" />
        </div>

        <!-- Filter buttons -->
        <div class="flex gap-2">
          <button @click="setFilter('enviados')" class="flex items-center gap-2 px-4 py-2 rounded-md text-sm" :class="activeFilter === 'enviados'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-white text-emerald-700 border border-dashed border-emerald-300'">
            <SendIcon class="h-4 w-4" />
            Enviados
          </button>

          <button @click="setFilter('recebidos')" class="flex items-center gap-2 px-4 py-2 rounded-md text-sm" :class="activeFilter === 'recebidos'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-white text-emerald-700 border border-dashed border-emerald-300'">
            <PackageOpen class="h-4 w-4" />
            Recebidos
          </button>
        </div>
      </div>

      <button
        @click="createNewTicket"
        class="flex items-center gap-2 px-4 py-2 rounded-md text-sm border border-emerald-500 text-emerald-700 bg-white hover:bg-emerald-50">
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
          <tr v-for="pedido in paginatedPedidos" :key="pedido.codigo" @click="openTicket(pedido.codigo)"
            class="border-b border-emerald-100 hover:bg-gray-50 cursor-pointer">
            <td class="py-3 px-4 text-sm truncate">{{ pedido.codigo }}</td>
            <td class="py-3 px-4 text-sm truncate">{{ pedido.assunto }}</td>
            <td class="py-3 px-4 text-sm truncate">{{ pedido.remetente }}</td>
            <td class="py-3 px-4 text-sm truncate">{{ pedido.destinatario }}</td>
            <td class="py-3 px-4 text-sm truncate">{{ pedido.data }}</td>
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
              <div class="flex justify-center">
                <div v-if="pedido.remetente === 'Eu'">
                  <button @click.stop="removePedido(pedido)" class="text-gray-700 hover:text-gray-900">
                    <Trash2 class="h-5 w-5" />
                  </button>
                </div>
                <div v-else class="w-5 h-5"></div>
              </div>
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
          <button @click="goToPage(1)" :disabled="currentPage === 1"
            class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
            <ChevronsLeftIcon class="h-4 w-4" />
          </button>
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
            class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
            <ChevronLeftIcon class="h-4 w-4" />
          </button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
            class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
            <ChevronRightIcon class="h-4 w-4" />
          </button>
          <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages"
            class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
            <ChevronsRightIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Ticket -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <Ticket
        :ticketId="selectedTicketId"
        :userType="ticketType"
        :isCreate="isCreating"
        @close="showModal = false"
        @created="handleCreated"
      />
    </div>

    <!-- SuccessAlert -->
    <SuccessAlert v-if="showModalSuccess" :message="modalMessageSuccess" @close="showModalSuccess = false" class="mb-4" />

    <!-- ConfirmModal -->
    <ConfirmModal
      v-if="showModalRemovePedido"
      :message="modalMessageRemovePedido"
      @save="confirmRemovePedido"
      @cancel="showModalRemovePedido = false"
    />

    <!-- ErrorAlert -->
    <ErrorAlert v-if="showMessageError" :message="errorMessage || ''" @close="showMessageError = false" />
  </div>
</template>

<script lang="ts">
import {
  ChevronLeftIcon, ChevronRightIcon,
  ChevronsLeftIcon, ChevronsRightIcon,
  ChevronsUpDownIcon, CircleIcon,
  CheckIcon, XIcon, Trash2,
  PlusCircleIcon, PackageOpen, SendIcon
} from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import * as api from '@/api/api'
import { useUserStore } from '@/stores/user'
import Ticket from '@/components/ticket/Ticket.vue'
import SuccessAlert from '@/components/popup/SuccessAlert.vue';
import ConfirmModal from '@/components/popup/ConfirmModal.vue';
import ErrorAlert from '@/components/popup/ErrorAlert.vue';

interface Pedido {
  codigo: string
  assunto: string
  remetente: string
  destinatario: string
  data: string
  estado: 'Enviado' | 'Aceite' | 'Recusado' | 'Recebido'
}

export default {
  name: 'TicketsView',
  components: {
    Input, Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
    ChevronLeftIcon, ChevronRightIcon,
    ChevronsLeftIcon, ChevronsRightIcon,
    ChevronsUpDownIcon, CircleIcon,
    CheckIcon, XIcon, Trash2,
    PlusCircleIcon, PackageOpen, SendIcon,
    Ticket,
    SuccessAlert,
    ConfirmModal,
    ErrorAlert
  },
  data() {
    return {
      searchQuery: '',
      activeFilter: 'enviados' as 'enviados' | 'recebidos',
      currentPage: 1,
      rowsPerPage: '5',
      sortColumn: null as 'assunto' | 'estado' | null,
      sortDirection: 'asc' as 'asc' | 'desc',
      pedidosEnviados: [] as Pedido[],
      pedidosRecebidos: [] as Pedido[],
      showModal: false,
      selectedTicketId: '',
      ticketType: '', // 'student' | 'teacher' | 'director'
      isCreating: false,
      selectedPedidoToRemove: null as Pedido | null,
      showModalRemovePedido: false,
      modalMessageRemovePedido: '',
      showModalSuccess: false,
      modalMessageSuccess: '',
      errorMessage: '',
      showMessageError: false,
      errorMessageDialog: null as string | null,
      showMessageErrorDialog: false,
      showModalConfirm: false,
      modalMessageConfirm: '',
    }
  },
  computed: {
    filteredPedidos(): Pedido[] {
      const pedidos = this.activeFilter === 'enviados'
        ? this.pedidosEnviados
        : this.pedidosRecebidos
      let result = pedidos

      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        result = result.filter(p =>
          p.assunto.toLowerCase().includes(q) ||
          p.codigo.toLowerCase().includes(q)
        )
      }

      if (this.sortColumn) {
        result = [...result].sort((a, b) => {
          const va = a[this.sortColumn!]
          const vb = b[this.sortColumn!]
          return this.sortDirection === 'asc'
            ? va.localeCompare(vb)
            : vb.localeCompare(va)
        })
      }

      return result
    },
    totalPages(): number {
      return Math.max(1,
        Math.ceil(this.filteredPedidos.length / parseInt(this.rowsPerPage))
      )
    },
    paginatedPedidos(): Pedido[] {
      const start = (this.currentPage - 1) * parseInt(this.rowsPerPage)
      return this.filteredPedidos.slice(start, start + parseInt(this.rowsPerPage))
    },
  },
  methods: {
    setFilter(f: 'enviados' | 'recebidos') {
      this.activeFilter = f
      this.currentPage = 1
    },
    goToPage(page: number) {
      this.currentPage = page
    },
    sortBy(column: 'assunto' | 'estado') {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortColumn = column
        this.sortDirection = 'asc'
      }
    },
    openTicket(id: string) {
      this.selectedTicketId = id
      this.isCreating = false
      this.showModal = true
    },
    createNewTicket() {
      this.selectedTicketId = ''
      this.isCreating = true
      this.showModal = true
    },
    removePedido(pedido: Pedido) {
      this.modalMessageRemovePedido = `Tem a certeza que deseja eliminar o pedido com o assunto "${pedido.assunto}"?`;
      this.selectedPedidoToRemove = pedido;
      this.showModalRemovePedido = true;
    },
    async confirmRemovePedido() {
      if (!this.selectedPedidoToRemove) return;

      try {
        await api.deleteRequest(this.selectedPedidoToRemove.codigo);

        this.pedidosEnviados = this.pedidosEnviados.filter(
          p => p.codigo !== this.selectedPedidoToRemove?.codigo
        );

        this.modalMessageSuccess = 'O pedido foi eliminado com sucesso!';
        this.showModalSuccess = true;
      } catch (error) {
        console.error('Erro ao eliminar pedido:', error);
        this.errorMessage = 'Erro ao eliminar o pedido. Por favor, tente novamente.';
        this.showMessageError = true;
      }

      this.showModalRemovePedido = false;
      this.selectedPedidoToRemove = null;
    },
    handleCreated() {
      this.showModal = false;
      this.modalMessageSuccess = 'Pedido enviado com sucesso!';
      this.showModalSuccess = true;
    },
    closeConfirm() {
      this.showModalConfirm = false;
    }
  },
  async mounted() {
    const userStore = useUserStore()
    const user = userStore.user
    if (!user) return

    const allRequests = await api.list_Requests()
    console.log(allRequests)
    const me = user.id
    this.ticketType = user.type

    const mapped: Pedido[] = await Promise.all(allRequests.map(async req => {
      const senderInfo = await api.getUserInfoById(req.sender)
      let senderName = senderInfo.name

      const remetente = req.sender === me
        ? 'Eu'
        : req.sender === 'd1'
          ? 'Diretor de Curso'
          : senderName

      const destinatario = req.recipient === me
        ? 'Eu'
        : req.recipient === 'all'
          ? 'Todos'
          : req.recipient === 'd1'
            ? 'Diretor de Curso'
            : req.recipient

      let estado: Pedido['estado']

      if (req.sender === me) {
        if (req.status === 'Aceite' || req.status === 'Recusado') {
          estado = req.status as Pedido['estado']
        } else {
          estado = 'Enviado'
        }
      } else {
        if (req.status === 'Aceite' || req.status === 'Recusado') {
          estado = req.status as Pedido['estado']
        } else {
          estado = 'Recebido'
        }
      }

      return {
        codigo: req.id,
        assunto: req.subject,
        remetente,
        destinatario,
        data: req.date,
        estado
      }
    }))

    this.pedidosEnviados = mapped.filter(p => p.remetente === 'Eu')
    this.pedidosRecebidos = mapped.filter(p =>
      p.destinatario === 'Eu' || p.destinatario === 'Todos'
    )
  }
}
</script>

<style scoped>
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