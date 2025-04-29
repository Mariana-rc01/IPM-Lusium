<template>
    <div class="container mx-auto p-4 max-w-7xl">
      <!-- Header -->
      <h1 class="text-2xl font-bold mb-1">Listagem de Salas</h1>
      <p class="text-emerald-500 mb-6">Aqui pode ver a listagem de todas as salas disponibilizadas para Engenharia Informática!</p>
  
      <!-- Search bar and filter -->
      <div class="flex justify-between items-center mb-4">
        <!-- Search bar -->
        <div class="flex-none w-72">
          <Input
            v-model="searchQuery"
            placeholder="Procurar por número..."
            class="w-full border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
  
        <!-- Filter -->
        <DropdownMenu>
          <DropdownMenuTrigger as="button" class="border border-emerald-300 px-3 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-emerald-50">
            <SlidersHorizontalIcon class="h-4 w-4" />
            Filtrar
          </DropdownMenuTrigger>

          <DropdownMenuContent class="w-auto">
            <DropdownMenuItem 
              v-for="cp in uniqueCPs" 
              :key="cp" 
              @click="applyFilter(`CP${cp}`)"
            >
              CP {{ cp }}
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem @click="clearFilters">
              <Trash2 class="h-4 w-4 mr-2" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <!-- Students table -->
      <div class="border border-emerald-200 rounded-lg overflow-hidden">
        <table class="w-full table-fixed">
          <colgroup>
            <col class="w-[13%]" /> <!-- CP -->
            <col class="w-[15%]" /> <!-- Número -->
            <col class="w-[72%]" /> <!-- Capacidade -->
          </colgroup>
          <thead>
            <tr class="border-b border-emerald-200">
              <th class="py-3 px-4 text-left text-emerald-500 font-medium text-sm">
                <button @click="sortBy('cp')" class="flex items-center">
                  CP
                  <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
                </button>
              </th>
              <th class="py-3 px-4 text-left text-emerald-500 font-medium text-sm">
                <button @click="sortBy('numero')" class="flex items-center">
                  Número
                  <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
                </button>
              </th>
              <th class="py-3 px-4 text-left text-emerald-500 font-medium text-sm">
                <button @click="sortBy('capacidade')" class="flex items-center">
                  Capacidade
                  <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
                </button>
              </th>
              <th class="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sala in paginatedSalas" class="border-b border-emerald-100 hover:bg-gray-50">
              <td class="py-3 px-4 text-sm truncate">{{ sala.cp }}</td>
              <td class="py-3 px-4 text-sm truncate">{{ sala.numero }}</td>
              <td class="py-3 px-4 text-sm truncate">{{ sala.capacidade }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Footer -->
      <div class="flex justify-between items-center mt-4 gap-8">
        <!-- Label -->
        <div class="flex items-center gap-4 text-sm">CP : Complexo Pedagógico</div>
        <!-- Pagination -->
        <div class="flex items-center gap-4">
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
      </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { getAllClassrooms } from '@/api/api';
import { useUserStore } from '@/stores/user';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  Trash2,
  SlidersHorizontalIcon
} from 'lucide-vue-next';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface Sala {
  cp: number;
  numero: string;
  capacidade: number;
}

export default defineComponent({
  components: {
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    ChevronsUpDownIcon,
    Trash2,
    SlidersHorizontalIcon
  },
  data() {
    return {
      role: null as string | null,
      searchQuery: '' as string,
      selectedFilter: '' as string,
      currentPage: 1 as number,
      rowsPerPage: '5' as string,
      sortColumn: null as 'cp' | 'numero' | 'capacidade' | null,
      sortDirection: 'asc' as 'asc' | 'desc',
      salas: [] as Sala[]
    };
  },
  computed: {
    filteredSalas(): Sala[] {
      let result = this.salas;
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(sala => sala.numero.includes(query));
      }
      if (this.selectedFilter) {
        const cpNumber = parseInt(this.selectedFilter.replace('CP', ''));
        result = result.filter(sala => sala.cp === cpNumber);
      }
      if (this.sortColumn) {
        result = [...result].sort((a, b) => {
          const valueA = a[this.sortColumn!];
          const valueB = b[this.sortColumn!];
          if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
          if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return result;
    },
    uniqueCPs(): number[] {
      return [...new Set(this.salas.map(sala => sala.cp))].sort((a, b) => a - b);
    },
    totalPages(): number {
      return Math.max(1, Math.ceil(this.filteredSalas.length / parseInt(this.rowsPerPage)));
    },
    paginatedSalas(): Sala[] {
      const startIndex = (this.currentPage - 1) * parseInt(this.rowsPerPage);
      const endIndex = startIndex + parseInt(this.rowsPerPage);
      return this.filteredSalas.slice(startIndex, endIndex);
    }
  },
  methods: {
    goToPage(page: number) {
      this.currentPage = page;
    },
    sortBy(column: 'cp' | 'numero' | 'capacidade') {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
    },
    applyFilter(filterKey: string) {
      this.selectedFilter = filterKey;
      this.currentPage = 1;
    },
    clearFilters() {
      this.selectedFilter = '';
      this.currentPage = 1;
    },
    async fetchClassrooms() {
      try {
        const classrooms = await getAllClassrooms();
        this.salas = classrooms.map((classroom: any) => ({
          cp: parseInt(classroom.building.replace('CP', '')),
          numero: classroom.name,
          capacidade: classroom.capacity
        }));
      } catch (error) {
        console.error('Erro ao buscar as salas:', error);
      }
    }
  },
  mounted() {
    const userStore = useUserStore();
    const user = userStore.user;
    if (!user) {
      console.warn('Unexpected error: User not found in store');
      return;
    }
    this.role = user.type;
    if (this.role === 'student') {
      window.location.href = '/not-found';
      return;
    }
    this.fetchClassrooms();
  }
});
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
