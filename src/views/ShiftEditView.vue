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
              <p :class="isOverCapacity ? 'text-red-600' : ''">{{ shift.totalStudentsRegistered }}</p>
            </div>
            <div class="flex">
              <p class="font-semibold mr-1">Sala:</p>
              <p>{{ shift.classroomId }}</p>
            </div>
            <div class="flex">
              <p class="font-semibold mr-1">Capacidade:</p>
                <p :class="isOverCapacity ? 'text-red-600' : ''">{{ shift.capacity }}</p>
            </div>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex-1">
          <!-- Tabs -->
            <Tabs default-value="alunos" class="mb-4 mt-2">
            <TabsList class="grid grid-cols-2 w-[400px] mx-auto">
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
                        <button @click="sortStudents('id')" class="flex items-center">
                          Número
                          <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
                        </button>
                      </th>
                      <th class="py-3 px-4 text-left text-emerald-500 font-medium text-sm">
                        <button @click="sortStudents('name')" class="flex items-center">
                          Nome
                          <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="student in paginatedStudents" :key="student.id" class="border-b border-emerald-100 hover:bg-gray-50">
                      <td class="py-3 px-4 text-sm truncate">{{ student.id }}</td>
                      <td class="py-3 px-4 text-sm truncate">{{ student.name }}</td>
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
                        <button @click="sortRooms('id')" class="flex items-center">
                          Nº da Sala
                          <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
                        </button>
                      </th>
                      <th class="py-3 px-4 text-left text-emerald-500 font-medium text-sm">
                        <button @click="sortRooms('capacity')" class="flex items-center">
                          Capacidade
                          <ChevronsUpDownIcon class="h-4 w-4 ml-1" />
                        </button>
                      </th>
                      <th class="py-3 px-4 text-center text-emerald-500 font-medium text-sm">Seleção</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="room in paginatedRooms" :key="room.id" class="border-b border-emerald-100 hover:bg-gray-50">
                      <td class="py-3 px-4 text-sm truncate">{{ room.name }}</td>
                      <td class="py-3 px-4 text-sm truncate">{{ room.capacity }}</td>
                      <td class="py-3 px-4 text-sm text-center">
                        <Checkbox
                          :checked="selectedRoom === room.name"
                          @update:checked="selectRoom(room.name)"
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
        <div class="absolute right-4 top-4 flex items-center gap-8">
          <InfoIcon class="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer" @click="toggleInfoTooltip" />
          <button class="text-gray-800 hover:text-gray-800" @click="showAddStudentsDialog = false"></button>
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
            <div class="text-sm font-medium">{{ student.id }} - {{ student.name }}</div>
            <div class="flex items-center text-xs text-gray-500">
              <BriefcaseIcon v-if="student.status === 'Trabalhador-Estudante'" class="h-3 w-3 mr-1" />
              <DumbbellIcon v-else-if="student.status === 'Atleta'" class="h-3 w-3 mr-1" />
              <span>{{ student.status }}</span>
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
            <col class="w-[20%]" /> <!-- Status -->
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
          <td class="py-3 px-4 text-sm truncate">{{ student.id }}</td>
          <td class="py-3 px-4 text-sm truncate">{{ student.name }}</td>
          <td class="py-3 px-4 text-sm text-center">
            <div class="flex justify-center">
              <BriefcaseIcon v-if="student.status === 'Trabalhador-Estudante'" class="h-5 w-5" />
              <DumbbellIcon v-else-if="student.status === 'Atleta'" class="h-5 w-5" />
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

      <ConfirmModal v-if="showModalRemoveStudent" :message="modalMessageRemoveStudent"
        @save="confirmRemoveStudent"
        @cancel="() => { showModalRemoveStudent = false; selectedStudentToRemove = null; }"
      />

      <ErrorAlert v-if="showMessageError" :message="errorMessage || ''" @close="errorMessage = null" />

      <SuccessAlert v-if="showModalSucess" :message="modalMessageSuccess || ''" @close="modalMessageSuccess = null" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  Trash2,
  BriefcaseIcon,
  DumbbellIcon,
  InfoIcon
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SuccessAlert from '@/components/popup/SuccessAlert.vue';
import ConfirmModal from '@/components/popup/ConfirmModal.vue';
import ErrorAlert from '@/components/popup/ErrorAlert.vue';
import {
  getAllAllocations,
  getStudentById,
  getAvailableRooms,
  getStudents,
  getAllUCs,
  getShiftsByCourse,
  getRoomByShiftId,
  updateShiftRoom,
  deleteAllocation,
  createAllocation,
  updateShiftTotalStudents
} from '@/api/api';

interface Student {
  id: string;
  name: string;
  status: string;
}

interface Room {
  id: string;
  name: string;
  capacity: number;
}

interface Shift {
  id: string;
  courseId: string;
  name: string;
  horario: string;
  classroomId: string;
  totalStudentsRegistered: number;
  capacity: number;
  type: string;
}

export default defineComponent({
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    ChevronsUpDownIcon,
    Trash2,
    BriefcaseIcon,
    DumbbellIcon,
    InfoIcon,
    Button,
    Input,
    Checkbox,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    SuccessAlert,
    ConfirmModal,
    ErrorAlert
  },
  data() {
    return {
      showModalSucess: false,
      modalMessageSuccess: null as string | null,
      students: [] as Student[],
      availableStudents: [] as Student[],
      rooms: [] as Room[],
      shift: {
        id: '',
        courseId: '',
        name: '',
        horario: '',
        classroomId: '',
        totalStudentsRegistered: 0,
        capacity: 0,
        type: ' '
      } as Shift,
      showModal: false,
      modalMessage: '',
      showModalRemoveStudent: false,
      modalMessageRemoveStudent: '',
      showModalStudents: false,
      modalMessageStudents: '',
      errorMessage: null as string | null,
      showMessageError: false,
      errorMessageDialog: null as string | null,
      showMessageErrorDialog: false,
      shiftCode: '',
      ucName: '',
      studentsPerPage: '10',
      roomsPerPage: '10',
      currentStudentPage: 1,
      currentRoomPage: 1,
      studentSortColumn: null as 'id' | 'name' | null,
      studentSortDirection: 'asc' as 'asc' | 'desc',
      roomSortColumn: null as 'id' | 'capacity' | null,
      roomSortDirection: 'asc' as 'asc' | 'desc',
      selectedRoom: '',
      showAddStudentsDialog: false,
      searchQuery: '',
      selectedStudents: [] as Student[],
      showInfoTooltip: false,
      selectedStudentToRemove: null as Student | null
    };
  },
  computed: {
    isOverCapacity(): boolean {
      return this.students.length > this.shift.capacity;
    },
    sortedStudents(): Student[] {
      let result = [...this.students];
      if (this.studentSortColumn) {
        result.sort((a, b) => {
          const valueA = a[this.studentSortColumn!];
          const valueB = b[this.studentSortColumn!];
          if (valueA < valueB) return this.studentSortDirection === 'asc' ? -1 : 1;
          if (valueA > valueB) return this.studentSortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return result;
    },
    totalStudentPages(): number {
      return Math.max(1, Math.ceil(this.sortedStudents.length / parseInt(this.studentsPerPage)));
    },
    paginatedStudents(): Student[] {
      const startIndex = (this.currentStudentPage - 1) * parseInt(this.studentsPerPage);
      const endIndex = startIndex + parseInt(this.studentsPerPage);
      return this.sortedStudents.slice(startIndex, endIndex);
    },
    sortedRooms(): Room[] {
      let result = [...this.rooms];
      if (this.roomSortColumn) {
        result.sort((a, b) => {
          const valueA = a[this.roomSortColumn!];
          const valueB = b[this.roomSortColumn!];
          if (valueA < valueB) return this.roomSortDirection === 'asc' ? -1 : 1;
          if (valueA > valueB) return this.roomSortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return result;
    },
    totalRoomPages(): number {
      return Math.max(1, Math.ceil(this.sortedRooms.length / parseInt(this.roomsPerPage)));
    },
    paginatedRooms(): Room[] {
      const startIndex = (this.currentRoomPage - 1) * parseInt(this.roomsPerPage);
      const endIndex = startIndex + parseInt(this.roomsPerPage);
      return this.sortedRooms.slice(startIndex, endIndex);
    },
    filteredAvailableStudents(): Student[] {
      const notInShift = this.availableStudents.filter(
        availableStudent => !this.students.some(
          shiftStudent => shiftStudent.id === availableStudent.id
        )
      );
      const notSelected = notInShift.filter(
        availableStudent => !this.selectedStudents.some(
          selectedStudent => selectedStudent.id === availableStudent.id
        )
      );
      if (!this.searchQuery) return [];
      const query = this.searchQuery.toLowerCase();
      return notSelected.filter(student =>
        student.name.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    async loadData() {
      try {
        this.shiftCode = this.$route.params.idShift as string || '';
        this.ucName = this.$route.params.idUC as string || '';

        const allCourses = await getAllUCs();
        const course = allCourses.find((c: { abbreviation: string }) => c.abbreviation === this.ucName);
        if (!course) throw new Error(`UC não encontrada: ${this.ucName}`);

        const shifts = await getShiftsByCourse(course.id);
        const currentShiftData = shifts.find((t: { name: string }) => t.name === this.shiftCode);
        if (!currentShiftData) throw new Error(`Turno não encontrado: ${this.shiftCode}`);

        const roomData = await getRoomByShiftId(currentShiftData.id);
        if (!roomData) throw new Error(`Sala não encontrada para o turno: ${currentShiftData.id}`);

        this.shift = {
          id: currentShiftData.id,
          courseId: course.id,
          name: currentShiftData.name,
          horario: `${currentShiftData.startHour}-${currentShiftData.endHour}`,
          classroomId: currentShiftData.room,
          totalStudentsRegistered: currentShiftData.totalStudentsRegistered,
          capacity: roomData.capacity,
          type: currentShiftData.type,
        };

        const allAllocations = await getAllAllocations();
        const shiftAllocations = allAllocations.filter((a: { shiftId: number }) => a.shiftId === Number(this.shift.id));
        this.students = await Promise.all(
          shiftAllocations.map(async (a: { studentId: string }) => {
            const student = await getStudentById(a.studentId);
            return {
              id: student.id,
              name: student.name,
              status: student.specialStatus || '',
            };
          })
        );

        const allStudents = await getStudents();
        this.availableStudents = allStudents.filter(
          (student: any) =>
            student.enrolled.includes(this.shift.courseId) &&
            !this.students.some((s) => s.id === student.id)
        );

        this.rooms = await getAvailableRooms(
          this.shift.id,
          currentShiftData.day,
          currentShiftData.startHour,
          currentShiftData.endHour
        );

        this.selectedRoom = this.shift.classroomId;
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        this.errorMessage = (error as any).message || 'Erro ao carregar os dados do turno.';
        this.showMessageError = true;
      }
    },
    toggleInfoTooltip() {
      this.showInfoTooltip = !this.showInfoTooltip;
    },
    goToStudentPage(page: number) {
      this.currentStudentPage = page;
    },
    sortStudents(column: 'id' | 'name') {
      if (this.studentSortColumn === column) {
        this.studentSortDirection = this.studentSortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.studentSortColumn = column;
        this.studentSortDirection = 'asc';
      }
    },
    goToRoomPage(page: number) {
      this.currentRoomPage = page;
    },
    sortRooms(column: 'id' | 'capacity') {
      if (this.roomSortColumn === column) {
        this.roomSortDirection = this.roomSortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.roomSortColumn = column;
        this.roomSortDirection = 'asc';
      }
    },
    selectRoom(roomId: string) {
      this.selectedRoom = roomId;
    },
    checkRoomCapacityAndUpdate() {
      const selectedRoomData = this.rooms.find(room => room.name === this.selectedRoom);
      if (selectedRoomData) {
        if (selectedRoomData.capacity < this.students.length) {
          this.modalMessage = 'A sala não tem capacidade para todos os alunos. Tem a certeza que quer alterar?';
          this.showModal = true;
        } else {
          this.updateRoom(selectedRoomData);
        }
      }
    },
    async confirmRoomChange() {
      const selectedRoomData = this.rooms.find(room => room.name === this.selectedRoom);
      if (selectedRoomData) {
        await this.updateRoom(selectedRoomData);
        this.showModal = false;
      }
    },
    async updateRoom(roomData: Room) {
      try {
        await updateShiftRoom(this.shift.id, roomData.id);
        this.shift.classroomId = roomData.name;
        this.shift.capacity = roomData.capacity;
        await this.loadData();

        this.showModalSucess = false;
        this.nextTick(() => {
          this.modalMessageSuccess = 'A sala deste turno foi alterada com sucesso!';
          this.showModalSucess = true;
        });
      } catch (error) {
        console.error('Erro ao atualizar a sala na API:', error);
        this.errorMessage = 'Erro ao atualizar a sala. Por favor, tente novamente.';
        this.showMessageError = true;
      }
    },
    removeStudent(student: Student) {
      this.modalMessageRemoveStudent = `Tem a certeza que deseja remover o aluno ${student.name}?`;
      this.showModalRemoveStudent = true;
      this.selectedStudentToRemove = student;
    },
    async confirmRemoveStudent() {
      if (this.selectedStudentToRemove) {
        try {
          const allAllocationsResponse = await getAllAllocations();
          const allocationToRemove = allAllocationsResponse.find(
            (allocation: any) =>
              allocation.studentId === this.selectedStudentToRemove?.id &&
              allocation.shiftId === Number(this.shift.id)
          );

          if (allocationToRemove) {
            await deleteAllocation(allocationToRemove.id);
            await updateShiftTotalStudents(this.shift.id, this.shift.totalStudentsRegistered - 1);
          }

          const index = this.students.findIndex(s => s.id === this.selectedStudentToRemove?.id);
          if (index !== -1) this.students.splice(index, 1);

          this.showModalSucess = false;
          this.nextTick(() => {
            this.modalMessageSuccess = 'O aluno foi removido com sucesso!';
            this.showModalSucess = true;
          });
        } catch (error) {
          console.error('Erro ao remover a Allocation na API:', error);
          this.errorMessage = 'Erro ao remover o aluno. Por favor, tente novamente.';
          this.showMessageError = true;
        }
        await this.loadData();
        this.selectedStudentToRemove = null;
        this.showModalRemoveStudent = false;
        this.modalMessageRemoveStudent = '';
      }
    },
    addToSelection(student: Student) {
      if (!this.selectedStudents.some(s => s.id === student.id)) {
        this.selectedStudents.push(student);
        this.searchQuery = '';
      }
    },
    removeFromSelection(student: Student) {
      const index = this.selectedStudents.findIndex(s => s.id === student.id);
      if (index !== -1) this.selectedStudents.splice(index, 1);
    },
    async checkCapacityAndAddStudents() {
      if (this.selectedStudents.length === 0) {
        this.showMessageErrorDialog = true;
        this.errorMessageDialog = 'Nenhum aluno selecionado!';
        setTimeout(() => {
          this.errorMessageDialog = null;
          this.showMessageErrorDialog = false;
        }, 1000);
        return;
      }

      try {
        const allAllocations = await getAllAllocations();
        const shifts = await getShiftsByCourse(this.shift.courseId);
        const errorMessages = [];

        for (const student of this.selectedStudents) {
          const allocationInAnotherShift = allAllocations.find((allocation: any) => {
            const isSameStudent = allocation.studentId === student.id;
            const isInAnotherShiftOfSameType = shifts.some(
              (s: any) => s.id === String(allocation.shiftId) && s.type === this.shift.type && s.id !== String(this.shift.id)
            );
            return isSameStudent && isInAnotherShiftOfSameType;
          });

          if (allocationInAnotherShift) {
            const conflictingShift = shifts.find((s: any) => s.id === String(allocationInAnotherShift.shiftId));
            errorMessages.push(`O aluno ${student.name} já está alocado no turno ${conflictingShift.name}.`);
          }
        }

        if (this.students.length + this.selectedStudents.length > this.shift.capacity) {
          errorMessages.push('A capacidade da sala será ultrapassada. Deseja continuar?');
        }

        if (errorMessages.length > 0) {
          this.modalMessageStudents = errorMessages.join(' ');
          this.showModalStudents = true;
        } else {
          this.addSelectedStudents();
        }
      } catch (error) {
        console.error('Erro ao verificar alunos ou capacidade:', error);
        this.errorMessageDialog = 'Erro ao verificar alunos ou capacidade. Por favor, tente novamente.';
        this.showMessageErrorDialog = true;
        setTimeout(() => {
          this.errorMessageDialog = null;
          this.showMessageErrorDialog = false;
        }, 3000);
      }
    },
    confirmAddStudents() {
      this.addSelectedStudents();
      this.showModalStudents = false;
      this.modalMessageStudents = '';
    },
    async addSelectedStudents() {
      try {
        const allAllocations = await getAllAllocations();
        const shifts = await getShiftsByCourse(this.shift.courseId);
        const lastId = allAllocations.reduce((maxId: number, allocation: any) => Math.max(maxId, Number(allocation.id)), 0);

        await Promise.all(
          this.selectedStudents.map(async (student, index) => {
            const allocationInAnotherShift = allAllocations.find((allocation: any) => {
              const isSameStudent = allocation.studentId === student.id;
              const isInAnotherShiftOfSameType = shifts.some(
                (s: any) => s.id === String(allocation.shiftId) && s.type === this.shift.type && s.id !== String(this.shift.id)
              );
              return isSameStudent && isInAnotherShiftOfSameType;
            });

            if (allocationInAnotherShift) {
              await deleteAllocation(allocationInAnotherShift.id);
              const oldShift = shifts.find((s: any) => String(s.id) === String(allocationInAnotherShift.shiftId));
              if (oldShift) await updateShiftTotalStudents(oldShift.id, oldShift.totalStudentsRegistered - 1);
            }

            if (!this.students.some(s => s.id === student.id)) {
              await createAllocation({
                id: String(lastId + index + 1),
                studentId: student.id,
                shiftId: Number(this.shift.id),
              });
              this.students.push(student);
              await updateShiftTotalStudents(this.shift.id, this.shift.totalStudentsRegistered + 1);
            }
          })
        );

        this.selectedStudents = [];
        this.showAddStudentsDialog = false;
        this.searchQuery = '';
        this.showInfoTooltip = false;
        await this.loadData();

        this.showModalSucess = false;
        this.nextTick(() => {
          this.modalMessageSuccess = 'Alunos adicionados com sucesso!';
          this.showModalSucess = true;
        });
      } catch (error) {
        console.error('Erro ao adicionar alunos:', error);
        this.errorMessage = 'Erro ao adicionar os alunos. Por favor, tente novamente.';
        this.showMessageError = true;
      }
    },
    nextTick(callback: () => void) {
      (this as any).$nextTick(callback);
    }
  },
  mounted() {
    this.loadData();
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