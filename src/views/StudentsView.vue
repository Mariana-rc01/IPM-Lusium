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
  
        <!-- Botão de criar novo aluno (opcional) -->
        <button class="flex items-center gap-2 px-4 py-2 rounded-md text-sm border border-emerald-500 text-emerald-700 bg-white hover:bg-emerald-50">
          <PlusCircleIcon class="h-4 w-4" />
          Criar novo aluno
        </button>
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
                <!-- Exemplo de apresentação de estatuto com ícone -->
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
                <button>
                  <UserCircleIcon class="h-5 w-5" />
                </button>
                <button>
                  <CalendarIcon class="h-5 w-5" />
                </button>
                <button v-if="role === 'diretor'">
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
                <span class="text-sm">Trabalhador-Estudante</span>
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
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'

  const role = ref('diretor') // *****TEMP***** Pode ser 'aluno', 'diretor' ou 'professor'

  import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    ChevronsUpDownIcon,
    Trash2,
    PlusCircleIcon,
    BriefcaseIcon,
    DumbbellIcon,
    UserCircleIcon,
    CalendarIcon
  } from 'lucide-vue-next'
  
  // Imports from shadcn-vue
  import { Input } from '@/components/ui/input'
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
  } from '@/components/ui/select'
  
  // Types
  interface Aluno {
    numero: string
    nome: string
    estatuto: string
  }
  
  // States
  const searchQuery = ref('')
  const currentPage = ref(1)
  const rowsPerPage = ref('5')
  const sortColumn = ref<'numero' | 'nome' | 'estatuto' | null>(null)
  const sortDirection = ref<'asc' | 'desc'>('asc')
  
  // Example data
  const alunos = ref<Aluno[]>([
    {
      numero: 'a104725',
      nome: 'Afonso Dionisio Santos',
      estatuto: 'Trabalhador-Estudante'
    },
    {
      numero: 'a104732',
      nome: 'Afonso Gonçalves Pedreira',
      estatuto: 'Atleta'
    },
    {
      numero: 'a104527',
      nome: 'Afonso Gregório de Sousa',
      estatuto: 'Trabalhador-Estudante'
    },
    {
      numero: 'a104338',
      nome: 'Alex Araujo da Silva',
      estatuto: 'Nenhum'
    },
    {
      numero: 'a104612',
      nome: 'Alexandre Antes Dias',
      estatuto: 'Trabalhador-Estudante'
    },
    {
      numero: 'a104765',
      nome: 'Alexandre de Oliveira Monsanto',
      estatuto: 'Nenhum'
    },
    {
      numero: 'a104920',
      nome: 'Alexandre Marques Miranda',
      estatuto: 'Atleta'
    },
    {
      numero: 'a105011',
      nome: 'Ana Carolina Penha Cerqueira',
      estatuto: 'Nenhum'
    },
    {
      numero: 'a105288',
      nome: 'Júda Rodrigues Coelho',
      estatuto: 'Atleta'
    },
    {
      numero: 'a105469',
      nome: 'Ana Margarida Campos Pires',
      estatuto: 'Trabalhador-Estudante'
    }
  ])
  
  // Computed properties
  const filteredAlunos = computed(() => {

    // Apply search filter
    let result = alunos.value
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter((aluno) =>
        aluno.nome.toLowerCase().includes(query) ||
        aluno.numero.toLowerCase().includes(query)
      )
    }
    
    // Apply sorting
    if (sortColumn.value) {
      result = [...result].sort((a, b) => {
        const valueA = a[sortColumn.value!]
        const valueB = b[sortColumn.value!]
  
        if (valueA < valueB) return sortDirection.value === 'asc' ? -1 : 1
        if (valueA > valueB) return sortDirection.value === 'asc' ? 1 : -1
        return 0
      })
    }
    
    return result
  })
  
  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(filteredAlunos.value.length / parseInt(rowsPerPage.value)))
  })
  
  const paginatedAlunos = computed(() => {
    const startIndex = (currentPage.value - 1) * parseInt(rowsPerPage.value)
    const endIndex = startIndex + parseInt(rowsPerPage.value)
    return filteredAlunos.value.slice(startIndex, endIndex)
  })
  
  // Methods
  function goToPage(page: number) {
    currentPage.value = page
  }
  
  function sortBy(column: 'numero' | 'nome' | 'estatuto') {
    if (sortColumn.value === column) {
      // Reverse direction if the column is already selected
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      // New column selected
      sortColumn.value = column
      sortDirection.value = 'asc'
    }
  }
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
