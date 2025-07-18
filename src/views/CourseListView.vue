<template>
  <div class="container mx-auto p-4 max-w-7xl">
    <!-- Header -->
    <h1 class="text-2xl font-bold mb-1">Listagem de UC's</h1>
    <p class="text-emerald-500 mb-6">Aqui pode ver a listagem de todas as UC’s!</p>

    <!-- Search bar and filter -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex-none w-72">
        <Input
          v-model="searchQuery"
          placeholder="Procurar por nome..."
          class="w-full border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>
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
          <DropdownMenuItem @click="clearFilters">
            <Trash2 class="h-4 w-4 mr-2" />
            Limpar Filtros
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <!-- Courses table -->
    <div class="border border-emerald-200 rounded-lg overflow-hidden font-medium">
      <table class="w-full table-fixed">
        <colgroup>
          <col class="w-[15%]" />
          <col class="w-[50%]" />
          <col class="w-[20%]" />
          <col class="w-[20%]" />
        </colgroup>
        <thead>
          <tr class="border-b border-emerald-200">
            <th class="py-3 px-4 text-left text-emerald-500 text-sm">
              <button @click="sortBy('codUc')" class="flex items-center">
                Código UC
                <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
              </button>
            </th>
            <th class="py-3 px-4 text-left text-emerald-500 text-sm">
              <button @click="sortBy('nome')" class="flex items-center">
                Nome
                <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
              </button>
            </th>
            <th class="py-3 px-4 text-left text-emerald-500 text-sm">
              <button @click="sortBy('anoCurricular')" class="flex items-center">
                Ano Curricular
                <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
              </button>
            </th>
            <th class="py-3 px-4 text-left text-emerald-500 text-sm">
              <button @click="sortBy('ocupacao')" class="flex items-center">
                Ocupação dos Turnos
                <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in paginatedCourses" :key="course.codUc" class="border-b border-emerald-100 hover:bg-gray-50">
            <td class="py-3 px-4 text-sm truncate">{{ course.codUc }}</td>
            <td class="py-3 px-4 text-sm truncate">
              <router-link :to="`/uc-schedule/${course.codUc}`">
                <Button type="button" :disabled="isLoading" class="underline">
                  {{ course.nome }}
                </Button>
              </router-link>
            </td>
            <td class="py-3 px-4 text-sm truncate">
              <div class="w-fit border py-1 px-2 rounded-lg border-emerald-200">
                {{ course.anoCurricular }}º ano
              </div>
            </td>
            <td class="py-3 px-4 text-sm truncate">
              <div class="flex items-center gap-2">
                <div v-if="course.ocupacao === 'Baixa'">
                  <ArrowDown class="text-emerald-500 h-5 w-5" />
                </div>
                <div v-if="course.ocupacao === 'Média'">
                  <ArrowRight class="text-emerald-500 h-5 w-5" />
                </div>
                <div v-if="course.ocupacao === 'Alta'">
                  <ArrowUp class="text-emerald-500 h-5 w-5" />
                </div>
                {{ course.ocupacao }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="flex justify-end items-center mt-4 gap-8">
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
            <button @click="goToPage(1)" :disabled="currentPage === 1" class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
              <ChevronsLeftIcon class="h-4 w-4" />
            </button>
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
              <ChevronLeftIcon class="h-4 w-4" />
            </button>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
              <ChevronRightIcon class="h-4 w-4" />
            </button>
            <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
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
import { useUserStore } from '@/stores/user';
import { getStudentById, getAllCoursesWithOccupation, getAllCoursesWithOccupationForAll } from '@/api/api';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  Trash2,
  SlidersHorizontalIcon,
  ArrowUp,
  ArrowRight,
  ArrowDown,
} from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Course {
  codUc: string;
  nome: string;
  anoCurricular: number;
  ocupacao: string;
}

export default defineComponent({
  name: 'CourseListView',
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
    SlidersHorizontalIcon,
    ArrowUp,
    ArrowRight,
    ArrowDown,
  },
  data() {
    return {
      searchQuery: '',
      selectedFilter: '',
      currentPage: 1,
      rowsPerPage: '10',
      sortColumn: null as 'codUc' | 'nome' | 'anoCurricular' | 'ocupacao' | null,
      sortDirection: 'asc' as 'asc' | 'desc',
      courses: [] as Course[],
      isLoading: false,
      error: '',
    };
  },
  computed: {
    filteredCourses(): Course[] {
      let result = this.courses;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter((course) => course.nome.toLowerCase().includes(query));
      }

      if (this.selectedFilter) {
        switch (this.selectedFilter) {
          case 'ano1':
            result = result.filter((course) => course.anoCurricular === 1);
            break;
          case 'ano2':
            result = result.filter((course) => course.anoCurricular === 2);
            break;
          case 'ano3':
            result = result.filter((course) => course.anoCurricular === 3);
            break;
        }
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
    totalPages(): number {
      return Math.max(1, Math.ceil(this.filteredCourses.length / parseInt(this.rowsPerPage)));
    },
    paginatedCourses(): Course[] {
      const startIndex = (this.currentPage - 1) * parseInt(this.rowsPerPage);
      const endIndex = startIndex + parseInt(this.rowsPerPage);
      return this.filteredCourses.slice(startIndex, endIndex);
    },
  },
  methods: {
    async fetchCourses() {
      this.isLoading = true;
      try {
        const userStore = useUserStore();
        const user = userStore.user;

        if (!user) {
          throw new Error('Utilizador não autenticado.');
        }

        if (user.type === 'student') {
          const student = await getStudentById(user.id);
          const enrolledCourses = student.enrolled;
          const apiResponse = await getAllCoursesWithOccupation(enrolledCourses);

          this.courses = apiResponse.map((course: any) => ({
            codUc: course.id || '-',
            nome: course.name || '-',
            anoCurricular: course.year || '-',
            ocupacao: course.occupancyLevel,
          }));
        } else if (user.type === 'director' || user.type === 'teacher') {
          const apiResponse = await getAllCoursesWithOccupationForAll();

          this.courses = apiResponse.map((course: any) => ({
            codUc: course.id || '-',
            nome: course.name || '-',
            anoCurricular: course.year || '-',
            ocupacao: course.occupancyLevel,
          }));
        } else {
          throw new Error('Tipo de utilizador desconhecido.');
        }
      } catch (err: any) {
        console.error('Erro ao carregar cursos:', err);
        this.error = 'Não foi possível carregar os cursos.';
      } finally {
        this.isLoading = false;
      }
    },
    goToPage(page: number) {
      this.currentPage = page;
    },
    sortBy(column: 'codUc' | 'nome' | 'anoCurricular' | 'ocupacao') {
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
  },
  mounted() {
    this.fetchCourses();
  },
});
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
