<template>
    <div class="container mx-auto p-4 max-w-7xl">
      <!-- Header -->
      <h1 class="text-2xl font-bold mb-1">Listagem de Alunos</h1>
      <p class="text-emerald-500 mb-6">Aqui pode ver a listagem de todos os alunos!</p>
  
      <!-- Search bar and filter -->
      <div class="flex justify-between items-center mb-4">
        <!-- Search bar -->
        <div class="flex-none w-72">
          <Input
            v-model="searchQuery"
            placeholder="Procurar por número ou nome..."
            class="w-full border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
  
        <!-- Filter -->
        <DropdownMenu>
          <DropdownMenuTrigger as="button" class="border border-emerald-300 px-3 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-emerald-50">
            <SlidersHorizontalIcon class="h-4 w-4" />
            Filtrar
          </DropdownMenuTrigger>

          <DropdownMenuContent class="w-48">
            <DropdownMenuItem @click="applyFilter('ano1')">1º Ano</DropdownMenuItem>
            <DropdownMenuItem @click="applyFilter('ano2')">2º Ano</DropdownMenuItem>
            <DropdownMenuItem @click="applyFilter('ano3')">3º Ano</DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem @click="applyFilter('Trabalhador-Estudante')">
              <BriefcaseIcon class="h-4 w-4 mr-2" />
              Trabalhador Estudante
            </DropdownMenuItem>
            <DropdownMenuItem @click="applyFilter('Atleta')">
              <DumbbellIcon class="h-4 w-4 mr-2" />
              Atleta
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem @click="clearFilters">
              <Trash2 class="h-4 w-4 mr-2" />
              Limpar Filtros
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <!-- Students table -->
      <div class="border border-emerald-200 rounded-lg overflow-hidden">
        <table class="w-full table-fixed">
          <colgroup>
            <col class="w-[15%]" /> <!-- Número -->
            <col class="w-[45%]" /> <!-- Nome -->
            <col class="w-[30%]" /> <!-- Estatuto -->
            <col class="w-[10%]" /> <!-- Ações -->
          </colgroup>
          <thead>
            <tr class="border-b border-emerald-200">
              <th class="py-3 px-4 text-left text-emerald-500 font-medium text-sm">
                <button @click="sortBy('numero')" class="flex items-center">
                  Número
                  <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
                </button>
              </th>
              <th class="py-3 px-4 text-left text-emerald-500 font-medium text-sm">
                <button @click="sortBy('nome')" class="flex items-center">
                  Nome
                  <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
                </button>
              </th>
              <th class="py-3 px-4 text-left text-emerald-500 font-medium text-sm">
                <button @click="sortBy('estatuto')" class="flex items-center">
                  Estatuto
                  <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
                </button>
              </th>
              <th class="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="aluno in paginatedAlunos" :key="aluno.numero" class="border-b border-emerald-100 hover:bg-gray-50">
              <td class="py-3 px-4 text-sm truncate">{{ aluno.numero }}</td>
              <td class="py-3 px-4 text-sm truncate">{{ aluno.nome }}</td>
              <td class="py-3 px-4 text-sm truncate">
                <div class="flex items-center gap-2">
                  <div v-if="aluno.estatuto === 'Trabalhador-Estudante'">
                    <BriefcaseIcon class="h-5 w-5" />
                  </div>
                  <div v-else-if="aluno.estatuto === 'Atleta'">
                    <DumbbellIcon class="h-5 w-5" />
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-sm text-center flex gap-4 justify-end">
                <router-link :to="`/profile/${aluno.numero}`">
                  <UserCircleIcon class="h-5 w-5" />
                </router-link>
                <router-link :to="`/schedule/${aluno.numero}`">
                  <CalendarIcon class="h-5 w-5" />
                </router-link>
                <button v-if="role === 'director'" @click="deleteStudent(aluno.numero)">
                  <Trash2 class="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Footer -->
      <div class="flex justify-between items-center mt-4 gap-8">
        <!-- Label -->
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
                <BriefcaseIcon class="h-5 w-5" />
                <span class="text-sm">Trabalhador Estudante</span>
            </div>
            <div class="w-[1px] h-[20px] bg-zinc-900"></div>
            <div class="flex items-center gap-2">
                <DumbbellIcon class="h-5 w-5" />
                <span class="text-sm">Atleta</span>
            </div>
        </div>
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
import { getStudents, deleteStudentById } from '@/api/api';
import { useUserStore } from '@/stores/user';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  Trash2,
  SlidersHorizontalIcon,
  XCircleIcon,
  CalendarIcon,
  UserCircleIcon,
  BriefcaseIcon,
  DumbbellIcon
} from 'lucide-vue-next';

interface Aluno {
  numero: string;
  nome: string;
  estatuto: string;
  ano: number;
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
    Button,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    ChevronsUpDownIcon,
    Trash2,
    SlidersHorizontalIcon,
    XCircleIcon,
    CalendarIcon,
    UserCircleIcon,
    BriefcaseIcon,
    DumbbellIcon
  },
  data() {
    return {
      role: null as string | null,
      searchQuery: '' as string,
      selectedFilter: '' as string,
      currentPage: 1 as number,
      rowsPerPage: '5' as string,
      sortColumn: null as 'numero' | 'nome' | 'estatuto' | null,
      sortDirection: 'asc' as 'asc' | 'desc',
      alunos: [] as Aluno[]
    };
  },
  computed: {
    filteredAlunos(): Aluno[] {
      let result = this.alunos;
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(aluno => aluno.nome.toLowerCase().includes(query) || aluno.numero.toLowerCase().includes(query));
      }
      if (this.selectedFilter) {
        switch (this.selectedFilter) {
          case 'ano1': result = result.filter(aluno => aluno.ano === 1); break;
          case 'ano2': result = result.filter(aluno => aluno.ano === 2); break;
          case 'ano3': result = result.filter(aluno => aluno.ano === 3); break;
          case 'Trabalhador-Estudante': result = result.filter(aluno => aluno.estatuto === 'Trabalhador-Estudante'); break;
          case 'Atleta': result = result.filter(aluno => aluno.estatuto === 'Atleta'); break;
        }
      }
      if (this.sortColumn) {
        result = [...result].sort((a, b) => {
          const va = a[this.sortColumn!]; const vb = b[this.sortColumn!];
          if (va < vb) return this.sortDirection === 'asc' ? -1 : 1;
          if (va > vb) return this.sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return result;
    },
    totalPages(): number {
      return Math.max(1, Math.ceil(this.filteredAlunos.length / parseInt(this.rowsPerPage)));
    },
    paginatedAlunos(): Aluno[] {
      const start = (this.currentPage - 1) * parseInt(this.rowsPerPage);
      return this.filteredAlunos.slice(start, start + parseInt(this.rowsPerPage));
    }
  },
  methods: {
    estatutoIcon(est: string) {
      switch(est) {
        case 'Atleta': return DumbbellIcon;
        case 'Trabalhador-Estudante': return BriefcaseIcon;
        default: return UserCircleIcon;
      }
    },
    async fetchAlunos() {
      try {
        const students = await getStudents();
        this.alunos = students.map((aluno: any) => ({
          numero: aluno.id,
          nome: aluno.name,
          estatuto: this.mapSpecialStatus(aluno.specialStatus),
          ano: aluno.year
        }));
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    },
    mapSpecialStatus(status: string): string {
      switch (status) {
        case 'athlete': return 'Atleta';
        case 'working student': return 'Trabalhador-Estudante';
        default: return 'Sem Estatuto';
      }
    },
    applyFilter(value: string) {
      this.selectedFilter = value;
      this.currentPage = 1;
    },
    clearFilters() {
      this.selectedFilter = '';
      this.currentPage = 1;
      this.searchQuery = '';
    },
    sortBy(column: 'numero' | 'nome' | 'estatuto') {
      if (this.sortColumn === column) this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      else { this.sortColumn = column; this.sortDirection = 'asc'; }
    },
    goToPage(page: number) {
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },
    async deleteStudent(studentId: string) {
      try {
        await deleteStudentById(studentId);
        this.alunos = this.alunos.filter(a => a.numero !== studentId);
      } catch (error) {
        console.error('Erro ao eliminar o aluno:', error);
      }
    }
  },
  mounted() {
    const userStore = useUserStore();
    const user = userStore.user;
    if (!user) { window.location.href = '/not-found'; return; }
    this.role = user.type;
    if (this.role === 'student') { window.location.href = '/not-found'; return; }
    this.fetchAlunos();
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
