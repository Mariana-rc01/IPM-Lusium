<template>
    <div class="container mx-auto p-4 max-w-7xl">
      <!-- Header -->
      <h1 class="text-2xl font-bold mb-1">{{ ucName }} - {{ shiftCode }}</h1>
      <p class="text-emerald-500 mb-6">
        Aqui pode consultar os alunos inscritos no turno e a disponibilidade de salas para o mesmo horário!
      </p>

      <div class="flex flex-col md:flex-row gap-6">
        <!-- Left side -->
        <div class="md:w-64 mt-16 space-y-6">
          <h2 class="text-xl font-bold mb-4">Informação:</h2>
          <div class="space-y-6 text-base pl-4">
            <div class="flex">
              <p class="font-semibold mr-1">Horário:</p>
              <p>{{ shift.horario }}</p>
            </div>
            <div class="flex">
              <p class="font-semibold mr-1">Número de alunos:</p>
              <p :class="isOverCapacity ? 'text-red-600' : ''">{{ students.length }}</p>
            </div>
            <div class="flex">
              <p class="font-semibold mr-1">Sala:</p>
              <p>{{ shift.sala }}</p>
            </div>
            <div class="flex">
              <p class="font-semibold mr-1">Capacidade:</p>
              <p :class="isOverCapacity ? 'text-red-600' : ''">{{ shift.capacidade }}</p>
            </div>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex-1">
          <!-- Tabs -->
          <Tabs default-value="alunos" class="mb-6 mt-2">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="alunos">Alunos Inscritos</TabsTrigger>
              <TabsTrigger value="salas">Salas Disponíveis</TabsTrigger>
            </TabsList>

            <!-- Students Tab -->
            <TabsContent value="alunos">
              <div class="border border-emerald-200 rounded-lg overflow-hidden bg-white shadow-sm max-w-3xl mx-auto">
                <table class="w-full table-fixed">
                  <colgroup>
                    <col class="w-[20%]" /> <!-- Number -->
                    <col class="w-[70%]" /> <!-- Name -->
                    <col class="w-[10%]" /> <!-- Remove -->
                  </colgroup>
                  <thead>
                    <tr class="border-b border-emerald-200">
                      <th class="py-3 px-4 text-left text-emerald-500 font-medium text-sm">
                        <button @click="sortStudents('numero')" class="flex items-center">
                          Número
                          <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
                        </button>
                      </th>
                      <th class="py-3 px-4 text-left text-emerald-500 font-medium text-sm">
                        <button @click="sortStudents('nome')" class="flex items-center">
                          Nome
                          <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="student in paginatedStudents" :key="student.numero" class="border-b border-emerald-100 hover:bg-gray-50">
                      <td class="py-3 px-4 text-sm truncate">{{ student.numero }}</td>
                      <td class="py-3 px-4 text-sm truncate">{{ student.nome }}</td>
                      <td class="py-3 px-4 text-sm text-center">
                        <button @click="removeStudent(student)" class="text-black hover:text-gray-700">
                          <Trash2 class="h-5 w-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination for students -->
              <div class="flex justify-between items-center mt-4 max-w-3xl mx-auto">
                <div></div>
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2">
                    <span class="text-sm">Linhas por página</span>
                    <Select v-model="studentsPerPage">
                      <SelectTrigger class="border border-emerald-200 h-8 w-16 px-2 text-sm">
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
                    <span class="text-sm">Página {{ currentStudentPage }} de {{ totalStudentPages }}</span>
                    <div class="flex gap-1">
                      <button @click="goToStudentPage(1)" :disabled="currentStudentPage === 1"
                        class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
                        <ChevronsLeftIcon class="h-4 w-4" />
                      </button>
                      <button @click="goToStudentPage(currentStudentPage - 1)" :disabled="currentStudentPage === 1"
                        class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
                        <ChevronLeftIcon class="h-4 w-4" />
                      </button>
                      <button @click="goToStudentPage(currentStudentPage + 1)" :disabled="currentStudentPage === totalStudentPages"
                        class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
                        <ChevronRightIcon class="h-4 w-4" />
                      </button>
                      <button @click="goToStudentPage(totalStudentPages)" :disabled="currentStudentPage === totalStudentPages"
                        class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
                        <ChevronsRightIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Add students button -->
              <div class="mt-4 flex justify-end max-w-3xl mx-auto">
                <Button @click="showAddStudentsDialog = true" class="bg-emerald-900 hover:bg-emerald-800">
                  Adicionar Alunos
                </Button>
              </div>
            </TabsContent>

            <!-- Rooms Tab -->
            <TabsContent value="salas">
              <div class="border border-emerald-200 rounded-lg overflow-hidden bg-white shadow-sm max-w-3xl mx-auto">
                <table class="w-full table-fixed">
                  <colgroup>
                    <col class="w-[30%]" /> <!-- Number -->
                    <col class="w-[30%]" /> <!-- Capacity -->
                    <col class="w-[40%]" /> <!-- Check box -->
                  </colgroup>
                  <thead>
                    <tr class="border-b border-emerald-200">
                      <th class="py-3 px-4 text-left text-emerald-500 font-medium text-sm">
                        <button @click="sortRooms('sala')" class="flex items-center">
                          Nº da Sala
                          <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
                        </button>
                      </th>
                      <th class="py-3 px-4 text-left text-emerald-500 font-medium text-sm">
                        <button @click="sortRooms('capacidade')" class="flex items-center">
                          Capacidade
                          <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
                        </button>
                      </th>
                      <th class="py-3 px-4 text-center text-emerald-500 font-medium text-sm">Seleção</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="room in paginatedRooms" :key="room.id" class="border-b border-emerald-100 hover:bg-gray-50">
                      <td class="py-3 px-4 text-sm truncate">{{ room.sala }}</td>
                      <td class="py-3 px-4 text-sm truncate">{{ room.capacidade }}</td>
                      <td class="py-3 px-4 text-sm text-center">
                        <Checkbox
                          :checked="selectedRoom === room.id"
                          @update:checked="selectRoom(room.id)"
                          class="border-emerald-800 bg-white data-[state=checked]:bg-emerald-800 data-[state=checked]:border-emerald-800 data-[state=checked]:text-emerald-800"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination for rooms -->
              <div class="flex justify-between items-center mt-4 gap-8 max-w-3xl mx-auto">
                <div></div>
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2">
                    <span class="text-sm">Linhas por página</span>
                    <Select v-model="roomsPerPage">
                        <SelectTrigger class="border border-emerald-200 h-8 w-16 px-2 text-sm">
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
                    <span class="text-sm">Página {{ currentRoomPage }} de {{ totalRoomPages }}</span>
                    <div class="flex gap-1">
                      <button @click="goToRoomPage(1)" :disabled="currentRoomPage === 1"
                        class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
                        <ChevronsLeftIcon class="h-4 w-4" />
                      </button>
                      <button @click="goToRoomPage(currentRoomPage - 1)" :disabled="currentRoomPage === 1"
                        class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
                        <ChevronLeftIcon class="h-4 w-4" />
                      </button>
                      <button @click="goToRoomPage(currentRoomPage + 1)" :disabled="currentRoomPage === totalRoomPages"
                        class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
                        <ChevronRightIcon class="h-4 w-4" />
                      </button>
                      <button @click="goToRoomPage(totalRoomPages)" :disabled="currentRoomPage === totalRoomPages"
                        class="border border-emerald-200 p-1.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center">
                        <ChevronsRightIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Update room button -->
              <div class="mt-4 flex justify-end max-w-3xl mx-auto">
                <Button @click="checkRoomCapacityAndUpdate" class="bg-emerald-900 hover:bg-emerald-800">
                  Atualizar Sala
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <!-- Add Students Dialog -->
      <Dialog :open="showAddStudentsDialog" @update:open="showAddStudentsDialog = $event" :modal="true">
        <DialogContent class="sm:max-w-[600px]">
          <DialogHeader>
        <DialogTitle>Adicionar Alunos</DialogTitle>
        <DialogDescription class="text-emerald-500">
          Aqui pode adicionar alunos ao turno!
        </DialogDescription>
        <div class="absolute right-4 top-4 flex items-center gap-2">
          <InfoIcon class="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" @click="toggleInfoTooltip" />
          <button class="text-gray-500 hover:text-gray-700" @click="showAddStudentsDialog = false">
            <XIcon class="h-5 w-5" />
          </button>
        </div>
          </DialogHeader>

          <!-- Info tooltip -->
          <div v-if="showInfoTooltip" class="absolute right-4 top-14 bg-white border border-gray-200 rounded-md shadow-lg p-3 max-w-xs z-50">
        <p>Aqui pode adicionar um ou vários alunos ao turno.</p>
        <p class="mt-1">Utilize a barra de pesquisa para encontrar os alunos e adicione-os à lista. Quando todos os alunos estiverem selecionados, basta pressionar o botão Acrescentar Alunos para concluir a operação.</p>
        <p class="mt-1">Caso a capacidade da sala seja ultrapassada com os alunos adicionados, será exibido um aviso.</p>
          </div>

          <!-- Error Message -->
          <ErrorAlert v-if="showMessageErrorDialog" :message="errorMessageDialog || ''" @close="errorMessageDialog = null" />

          <ConfirmModal v-if="showModalStudents" :message="modalMessageStudents" @save="confirmAddStudents" @cancel="showModalStudents = false"/>

          <!-- Search bar -->
          <div class="mb-4 relative">
        <Input v-model="searchQuery" placeholder="Procurar por número ou nome..."
          class="w-full border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"/>

        <!-- Search results dropdown -->
        <div v-if="searchQuery && filteredAvailableStudents.length > 0" class="absolute z-10 mt-1 w-full bg-white border border-emerald-200 rounded-md shadow-lg max-h-60 overflow-auto">
          <div v-for="student in filteredAvailableStudents" :key="student.id"
            @click="addToSelection(student)" class="p-2 hover:bg-gray-100 cursor-pointer">
            <div class="flex items-center">
          <div>
            <div class="text-sm font-medium">{{ student.numero }} - {{ student.nome }}</div>
            <div class="flex items-center text-xs text-gray-500">
              <BriefcaseIcon v-if="student.estatuto === 'Trabalhador-Estudante'" class="h-3 w-3 mr-1" />
              <DumbbellIcon v-else-if="student.estatuto === 'Atleta'" class="h-3 w-3 mr-1" />
              <span>{{ student.estatuto }}</span>
            </div>
          </div>
            </div>
          </div>
        </div>

        <div v-else-if="searchQuery && filteredAvailableStudents.length === 0" class="absolute z-10 mt-1 w-full bg-white border border-emerald-200 rounded-md shadow-lg p-4 text-center text-gray-500">
          Nenhum aluno encontrado
        </div>
          </div>

          <!-- Selected Students Table -->
          <div class="border border-emerald-200 rounded-lg overflow-hidden">
        <table class="w-full table-fixed">
          <colgroup>
            <col class="w-[20%]" /> <!-- Number -->
            <col class="w-[50%]" /> <!-- Name -->
            <col class="w-[20%]" /> <!-- Estatuto -->
            <col class="w-[10%]" /> <!-- Remove -->
          </colgroup>
          <thead>
            <tr class="border-b border-emerald-200">
          <th class="py-3 px-4 text-left text-emerald-500 font-medium text-sm">
            <div class="flex items-center">
              Número
              <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
            </div>
          </th>
          <th class="py-3 px-4 text-left text-emerald-500 font-medium text-sm">
            <div class="flex items-center">
              Nome
              <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
            </div>
          </th>
          <th class="py-3 px-4 text-center text-emerald-500 font-medium text-sm">Estatuto</th>
          <th class="py-3 px-4 text-center text-emerald-500 font-medium text-sm"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in selectedStudents" :key="student.id"
          class="border-b border-emerald-100 hover:bg-gray-50">
          <td class="py-3 px-4 text-sm truncate">{{ student.numero }}</td>
          <td class="py-3 px-4 text-sm truncate">{{ student.nome }}</td>
          <td class="py-3 px-4 text-sm text-center">
            <div class="flex justify-center">
              <BriefcaseIcon v-if="student.estatuto === 'Trabalhador-Estudante'" class="h-5 w-5" />
              <DumbbellIcon v-else-if="student.estatuto === 'Atleta'" class="h-5 w-5" />
            </div>
          </td>
          <td class="py-3 px-4 text-sm text-center">
            <button @click="removeFromSelection(student)" class="text-black hover:text-gray-700">
              <Trash2 class="h-5 w-5 mx-auto" />
            </button>
          </td>
            </tr>
            <tr v-if="selectedStudents.length === 0">
          <td colspan="4" class="py-4 text-center text-gray-500 text-sm">
            Nenhum aluno selecionado
          </td>
            </tr>
          </tbody>
        </table>
          </div>

          <!-- Pagination for selected students -->
          <div v-if="selectedStudents.length > 0" class="flex justify-end items-center mt-2">
        <span class="text-sm">Página 1 de 1</span>
          </div>

          <!-- Legend -->
          <div class="flex items-center gap-4 mt-4">
        <div class="flex items-center gap-2">
          <BriefcaseIcon class="h-5 w-5" />
          <span class="text-sm">Trabalhador Estudante</span>
        </div>
        <div class="w-[1px] h-[20px] bg-zinc-300"></div>
        <div class="flex items-center gap-2">
          <DumbbellIcon class="h-5 w-5" />
          <span class="text-sm">Atleta</span>
        </div>
          </div>

          <DialogFooter>
        <Button @click="checkCapacityAndAddStudents" class="bg-emerald-900 hover:bg-emerald-700">
          Acrescentar Alunos
        </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Pop-ups -->

      <ConfirmModal v-if="showModal" :message="modalMessage" @save="confirmRoomChange" @cancel="showModal = false"/>

      <ErrorAlert v-if="errorMessage" :message="errorMessage" @close="errorMessage = null" />

      <SuccessAlert v-if="showModalSucess" :message="modalMessageSuccess || ''" @close="modalMessageSuccess = null" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { nextTick as vueNextTick } from 'vue';
import {ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, ChevronsUpDownIcon,
Trash2, BriefcaseIcon, DumbbellIcon, InfoIcon,XIcon} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import SuccessAlert from '@/components/popup/SuccessAlert.vue'
import ConfirmModal from '@/components/popup/ConfirmModal.vue'
import ErrorAlert from '@/components/popup/ErrorAlert.vue'

interface Student {
    id: number
    numero: string
    nome: string
    estatuto: string
}

interface Room {
    id: number
    sala: string
    capacidade: number
}

interface Shift {
    id: number
    codigo: string
    horario: string
    sala: string
    capacidade: number
}

const showModalSucess = ref(false)
const modalMessageSuccess = ref<string | null>(null)

const showModal = ref(false)
const modalMessage = ref('')

const showModalStudents = ref(false)
const modalMessageStudents = ref('')

const errorMessage = ref<string | null>(null)
const showMessageError = ref(false)

const errorMessageDialog = ref<string | null>(null)
const showMessageErrorDialog = ref(false)

const ucName = ref('IPM')
const shiftCode = ref('PL4')

// TODO - change when we have JSON server
const shift = ref<Shift>({
    id: 1,
    codigo: 'PL4',
    horario: '9h - 11h',
    sala: 'CP1 - 1.18',
    capacidade: 10
})

// TODO - change when we have JSON server
const students = ref<Student[]>([
    { id: 1, numero: 'a104262', nome: 'Afonso Gregório de Sousa', estatuto: 'Trabalhador-Estudante' },
    { id: 2, numero: 'a95147', nome: 'Diogo Alexandre Pereira da Costa', estatuto: 'Nenhum' },
    { id: 3, numero: 'a97941', nome: 'Diogo Filipe Oliveira da Silva', estatuto: 'Nenhum' },
    { id: 4, numero: 'a104353', nome: 'Eduardo de Oliveira Sousa Faria', estatuto: 'Nenhum' },
    { id: 5, numero: 'a77399', nome: 'Fernando Jorge da Silva Pires', estatuto: 'Nenhum' },
    { id: 6, numero: 'a104100', nome: 'Hélder Ricardo Ribeiro Gomes', estatuto: 'Nenhum' },
    { id: 7, numero: 'a103993', nome: 'Julia Bughi Correa da Costa', estatuto: 'Nenhum' },
    { id: 8, numero: 'a90817', nome: 'Mariana Rocha Cristino', estatuto: 'Atleta' },
    { id: 9, numero: 'a104089', nome: 'Nuno Miguel Ribeiro da Silva', estatuto: 'Nenhum' },
    { id: 10, numero: 'a104082', nome: 'Pedro Figueiredo Pereira', estatuto: 'Nenhum' }
])

// TODO - change when we have JSON server
const availableStudents = ref<Student[]>([
    { id: 11, numero: 'a104345', nome: 'Renata Gregório de Sousa', estatuto: 'Trabalhador-Estudante' },
    { id: 12, numero: 'a98941', nome: 'Tiago Filipe Oliveira da Silva', estatuto: 'Atleta' },
    { id: 13, numero: 'a104593', nome: 'Zelda Correa da Costa', estatuto: 'Trabalhador-Estudante' },
])

// TODO - change when we have JSON server
const rooms = ref<Room[]>([
    { id: 1, sala: 'CP1 - 1.18', capacidade: 10 },
    { id: 2, sala: 'CP1 - 1.13', capacidade: 5 },
    { id: 3, sala: 'CP1 - 1.17', capacidade: 30 },
    { id: 4, sala: 'CP1 - 2.01', capacidade: 35 },
    { id: 5, sala: 'CP2 - 0.01', capacidade: 35 },
    { id: 6, sala: 'CP2 - 0.14', capacidade: 35 },
    { id: 7, sala: 'CP3 - 1.12', capacidade: 35 },
    { id: 8, sala: 'CP3 - 3.14', capacidade: 38 },
    { id: 9, sala: 'CP4 - 1.04', capacidade: 38 },
    { id: 10, sala: 'CP4 - 0.05', capacidade: 45 }
])

const studentsPerPage = ref('10')
const roomsPerPage = ref('10')
const currentStudentPage = ref(1)
const currentRoomPage = ref(1)
const studentSortColumn = ref<'numero' | 'nome' | null>(null)
const studentSortDirection = ref<'asc' | 'desc'>('asc')
const roomSortColumn = ref<'sala' | 'capacidade' | null>(null)
const roomSortDirection = ref<'asc' | 'desc'>('asc')
const selectedRoom = ref(1)
const showAddStudentsDialog = ref(false)
const searchQuery = ref('')
const selectedStudents = ref<Student[]>([])
const showInfoTooltip = ref(false)

const isOverCapacity = computed(() => {
    return students.value.length > shift.value.capacidade
})

const sortedStudents = computed(() => {
    let result = [...students.value]

    if (studentSortColumn.value) {
        result.sort((a, b) => {
        const valueA = a[studentSortColumn.value!]
        const valueB = b[studentSortColumn.value!]

        if (valueA < valueB) return studentSortDirection.value === 'asc' ? -1 : 1
        if (valueA > valueB) return studentSortDirection.value === 'asc' ? 1 : -1
        return 0
        })
    }

    return result
})

const totalStudentPages = computed(() => {
    return Math.max(1, Math.ceil(sortedStudents.value.length / parseInt(studentsPerPage.value)))
})

const paginatedStudents = computed(() => {
    const startIndex = (currentStudentPage.value - 1) * parseInt(studentsPerPage.value)
    const endIndex = startIndex + parseInt(studentsPerPage.value)
    return sortedStudents.value.slice(startIndex, endIndex)
})

const sortedRooms = computed(() => {
    let result = [...rooms.value]

    if (roomSortColumn.value) {
        result.sort((a, b) => {
        const valueA = a[roomSortColumn.value!]
        const valueB = b[roomSortColumn.value!]

        if (valueA < valueB) return roomSortDirection.value === 'asc' ? -1 : 1
        if (valueA > valueB) return roomSortDirection.value === 'asc' ? 1 : -1
        return 0
        })
    }

    return result
    })

    const totalRoomPages = computed(() => {
    return Math.max(1, Math.ceil(sortedRooms.value.length / parseInt(roomsPerPage.value)))
    })

    const paginatedRooms = computed(() => {
    const startIndex = (currentRoomPage.value - 1) * parseInt(roomsPerPage.value)
    const endIndex = startIndex + parseInt(roomsPerPage.value)
    return sortedRooms.value.slice(startIndex, endIndex)
})

const filteredAvailableStudents = computed(() => {
    // Filter out students that are already in the shift
    const notInShift = availableStudents.value.filter(
        availableStudent => !students.value.some(
        shiftStudent => shiftStudent.numero === availableStudent.numero
        )
    )

    // Also filter out students that are already selected
    const notSelected = notInShift.filter(
        availableStudent => !selectedStudents.value.some(
        selectedStudent => selectedStudent.numero === availableStudent.numero
        )
    )

    // Filter by search query
    if (!searchQuery.value) return []

    const query = searchQuery.value.toLowerCase()
    return notSelected.filter(student =>
        student.nome.toLowerCase().includes(query) ||
        student.numero.toLowerCase().includes(query)
    )
})

function toggleInfoTooltip() {
    showInfoTooltip.value = !showInfoTooltip.value
}

// Methods for student pagination and sorting
function goToStudentPage(page: number) {
    currentStudentPage.value = page
}

function sortStudents(column: 'numero' | 'nome') {
    if (studentSortColumn.value === column) {
        // Reverse direction if the column is already selected
        studentSortDirection.value = studentSortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        // New column selected
        studentSortColumn.value = column
        studentSortDirection.value = 'asc'
    }
}

// Methods for room pagination and sorting
function goToRoomPage(page: number) {
    currentRoomPage.value = page
}

function sortRooms(column: 'sala' | 'capacidade') {
    if (roomSortColumn.value === column) {
        // Reverse direction if the column is already selected
        roomSortDirection.value = roomSortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        // New column selected
        roomSortColumn.value = column
        roomSortDirection.value = 'asc'
    }
}

// Room selection and update
function selectRoom(roomId: number) {
    selectedRoom.value = roomId
}

function checkRoomCapacityAndUpdate() {
  const selectedRoomData = rooms.value.find(room => room.id === selectedRoom.value);
  if (selectedRoomData) {
    if (selectedRoomData.capacidade < students.value.length) {
      modalMessage.value = 'A sala não tem capacidade para todos os alunos. Tem a certeza que quer alterar?';
      showModal.value = true;
    } else {
      updateRoom(selectedRoomData);
    }
  }
}

function confirmRoomChange() {
    const selectedRoomData = rooms.value.find(room => room.id === selectedRoom.value)
    if (selectedRoomData) {
        updateRoom(selectedRoomData)
        showModal.value = false
    }
}

function updateRoom(roomData: Room) {
    shift.value.sala = roomData.sala
    shift.value.capacidade = roomData.capacidade

    showModalSucess.value = false;
    nextTick(() => {
      modalMessageSuccess.value = 'A sala deste turno foi alterada com sucesso!';
      showModalSucess.value = true;
    });

}

// Student management
function removeStudent(student: Student) {
    const index = students.value.findIndex(s => s.id === student.id)
    if (index !== -1) {
        students.value.splice(index, 1)

        showModalSucess.value = false;
        nextTick(() => {
          modalMessageSuccess.value = 'O aluno foi removido com sucesso!';
          showModalSucess.value = true;
        });
    }
}

// Add students dialog management
function addToSelection(student: Student) {
    // Check if student is not already in selection
    if (!selectedStudents.value.some(s => s.id === student.id)) {
        selectedStudents.value.push(student)
        searchQuery.value = '' // Clear search after selection
    }
}

function removeFromSelection(student: Student) {
    const index = selectedStudents.value.findIndex(s => s.id === student.id)
    if (index !== -1) {
        selectedStudents.value.splice(index, 1)
    }
}

function checkCapacityAndAddStudents() {
    if (selectedStudents.value.length === 0) {
        showMessageErrorDialog.value = true;
        errorMessageDialog.value = 'Nenhum aluno selecionado!';
        setTimeout(() => {
            errorMessageDialog.value = null;
            showMessageErrorDialog.value = false;
        }, 1000);
        return;
    }

    // Verifica se a capacidade será ultrapassada
    if (students.value.length + selectedStudents.value.length > shift.value.capacidade) {
        modalMessageStudents.value = 'A capacidade da sala será ultrapassada. Deseja continuar?';
        showModalStudents.value = true;
    } else {
        addSelectedStudents();
    }
}

function confirmAddStudents() {
    addSelectedStudents()
    showModalStudents.value = false;
    modalMessageStudents.value = '';
}

function addSelectedStudents() {
    // Add selected students to the shift
    selectedStudents.value.forEach(student => {
        // Check if student is not already in the shift
        if (!students.value.some(s => s.id === student.id)) {
        students.value.push(student)
        }
    })

    // Clear selection and close dialog
    selectedStudents.value = []
    showAddStudentsDialog.value = false
    searchQuery.value = ''
    showInfoTooltip.value = false

    showModalSucess.value = false;
    nextTick(() => {
      modalMessageSuccess.value = 'Alunos adicionados com sucesso!';
      showModalSucess.value = true;
    });
}

function nextTick(callback: () => void) {
  vueNextTick(callback);
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