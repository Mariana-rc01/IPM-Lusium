<template>
  <div class="p-6 flex justify-start items-start min-h-screen">
    <div class="w-full max-w-6xl mx-6">
      <!-- Title -->
      <h1 class="text-2xl font-bold mb-1 text-left">Alocação manual de turnos</h1>
      <p class="text-[#10B981] mb-6 text-left">Aqui pode alocar um aluno aos turnos de cada Unidade Curricular!</p>

      <div class="flex flex-col md:flex-row gap-20 items-start">
        <!-- Sidebar with the options for Course and Shifts -->
        <div class="flex-1">
          <div class="border border-[#10B981] w-[250px] rounded-lg p-2">
            <ScrollArea class="h-auto rounded-lg p-1 text-black text-base">
              <div v-for="course in availableCourses" :key="course.uc" class="border-b border-black last:border-b-0">
                <!-- Course Header -->
                <div class="flex items-center justify-between cursor-pointer py-2"
                  @click="toggleUC(course.uc)">
                  <div class="flex items-center gap-2">
                    <span class="text-black">
                      <svg v-if="expandedUCs.includes(course.uc)" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                      </svg>
                      <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                      </svg>
                    </span>
                    <h3 class="font-medium text-base text-black">{{ course.uc }}</h3>
                  </div>
                </div>

                <!-- Shifts of the Course -->
                <div v-if="expandedUCs.includes(course.uc)" class="pl-6">
                  <div v-for="turno in course.turnos" :key="turno.id"
                    class="flex items-center gap-2 py-1">
                    <Checkbox :id="turno.id" :checked="selectedShifts.includes(turno.id)"
                      @update:checked="(checked) => updateSelection(checked, turno.id)"
                      class="h-3 w-3"/>
                    <label :for="turno.id" class="text-base text-black">
                      {{ turno.name }}
                      <span class="text-gray-500 ml-1">
                        ({{ turno.occupancy.current }}/{{ turno.occupancy.total }})
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
          <Button class="mt-2 text-sm py-2 px-4 w-auto bg-[#10B981] text-white hover:bg-[#34D399]"
            @click="AssignSchedule">
            Alocar Horário
          </Button>
        </div>

        <!-- Timetable -->
        <div class="flex-1 h-[900px] w-full min-w-[1000px]">
          <Timetable mode="teacher" :blocks="selectedBlocks" class="scale-110 origin-top-left"/>
        </div>
      </div>
    </div>

    <!-- Modal Component -->
    <ConfirmModal v-if="showModal" :message="modalMessage"
      @save="handleConfirm"
      @cancel="handleCancel"/>

    <SuccessAlert v-if="showModalSucess" :message="modalMessageSuccess || ''" @close="modalMessageSuccess = null" />

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import Timetable from '../components/Timetable.vue';
import { ScrollArea } from '../components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/popup/ConfirmModal.vue';
import SuccessAlert from '@/components/popup/SuccessAlert.vue';
import {
  getAllocationsByStudentId,
  deleteAllocation,
  createAllocation,
  getShiftById,
  updateShiftTotalStudents,
  getAllAllocations,
  getStudentById,
  getStudentAllocations,
  getAvailableCourses,
  addStudentToNoAllocations
} from '@/api/api';

interface ClassBlock {
  id: string;
  name: string;
  room: string;
  day: number;
  startHour: string;
  endHour: string;
  type: string;
  occupancy: {
    current: number;
    total: number;
    percentage: number;
  };
}

interface Course {
  uc: string;
  turnos: ClassBlock[];
}

export default defineComponent({
  components: {
    Timetable,
    ScrollArea,
    Checkbox,
    Button,
    ConfirmModal,
    SuccessAlert
  },
  data() {
    return {
      studentId: '' as string,
      enrolledCourses: [] as string[],
      allocations: [] as string[],
      showModal: false,
      modalMessage: '',
      showModalSucess: false,
      modalMessageSuccess: null as string | null,
      availableCourses: [] as Course[],
      selectedShifts: [] as string[],
      expandedUCs: [] as string[],
    }
  },
  computed: {
    selectedBlocks(): ClassBlock[] {
      return this.availableCourses.flatMap(course =>
        course.turnos
          .filter(turno => this.selectedShifts.includes(turno.id))
          .map(turno => ({ ...turno, name: `${course.uc} - ${turno.name }`}))
      );
    }
  },
  methods: {
    toggleUC(uc: string) {
      const index = this.expandedUCs.indexOf(uc);
      if (index > -1) {
        this.expandedUCs.splice(index, 1);
      } else {
        this.expandedUCs.push(uc);
      }
    },
    updateSelection(checked: boolean, shiftId: string) {
      if (checked) {
        this.selectedShifts.push(shiftId);
      } else {
        this.selectedShifts = this.selectedShifts.filter(id => id !== shiftId);
      }
    },
    async loadStudentData() {
      try {
        const route = useRoute();
        this.studentId = route.params.idStudent as string;

        const student = await getStudentById(this.studentId);
        this.enrolledCourses = student.enrolled;

        this.allocations = await getStudentAllocations(this.studentId);
        this.availableCourses = await getAvailableCourses(this.enrolledCourses);

        this.selectedShifts = this.allocations;
      } catch (error) {
        console.error('Erro ao carregar dados:', (error as any).message);
      }
    },
    async saveSchedule() {
      try {
        const oldAllocations = await getAllocationsByStudentId(this.studentId);

        await Promise.all(
          oldAllocations.map(async (allocation: any) => {
            const shift = await getShiftById(allocation.shiftId);
            await updateShiftTotalStudents(allocation.shiftId, Math.max(0, shift.totalStudentsRegistered - 1));
            await deleteAllocation(allocation.id);
          })
        );

        if (this.selectedShifts.length === 0) {
          await addStudentToNoAllocations(this.studentId);

          this.showModalSucess = false;
          this.nextTick(() => {
            this.modalMessageSuccess = 'Nenhum turno selecionado. O aluno foi adicionado à lista de não alocados.';
            this.showModalSucess = true;
            this.loadStudentData();
          });
          return;
        }

        const allAllocations = await getAllAllocations();
        const lastId = allAllocations.reduce((maxId: number, allocation: any) => Math.max(maxId, Number(allocation.id)), 0);

        await Promise.all(
          this.selectedShifts.map(async (shiftId, index) => {
            const shift = await getShiftById(shiftId);
            await updateShiftTotalStudents(shiftId, shift.totalStudentsRegistered + 1);

            await createAllocation({
              id: String(lastId + index + 1),
              studentId: this.studentId,
              shiftId: Number(shiftId),
            });
          })
        );

        this.showModalSucess = false;
        this.nextTick(() => {
          this.modalMessageSuccess = 'Horário atualizado com sucesso!';
          this.showModalSucess = true;
          this.loadStudentData();
        });
      } catch (error) {
        console.error('Erro ao salvar horário:', error);
        this.modalMessage = 'Erro ao atualizar o horário';
        this.showModal = true;
      }
    },
    handleCancel() {
      console.log('Action canceled!');
      this.showModal = false;
      this.modalMessage = '';
    },
    handleConfirm() {
      console.log('Action confirmed!');
      console.log('Assign schedule:', this.selectedBlocks);
      this.showModal = false;
      this.modalMessage = '';
    },
    AssignSchedule() {
      const validation = this.validateSchedule();

      if (!validation.valid) {
        this.modalMessage = `Erros:\n${validation.issues.join('. ')}`;
        this.showModal = true;
        return;
      }

      this.saveSchedule();
    },
    validateSchedule(): { valid: boolean; issues: string[] } {
      const issues: string[] = [];

      for (const course of this.availableCourses) {
        const selected = course.turnos.filter(t =>
          this.selectedShifts.includes(t.id)
        );
        const theoreticals = selected.filter(t => t.type === 'T');
        const praticals = selected.filter(t => t.type === 'PL');

        if (theoreticals.length > 1) {
          issues.push(`Mais de um turno teórico selecionado para ${course.uc}`);
        }
        if (praticals.length > 1) {
          issues.push(`Mais de um turno prático selecionado para ${course.uc}`);
        }
        if (theoreticals.length + praticals.length < 2 && course.uc !== 'LI2') {
          issues.push(`Faltam turnos para ${course.uc}`);
        }
      }

      const allSelectedShifts = this.availableCourses.flatMap(course =>
        course.turnos.filter(t => this.selectedShifts.includes(t.id))
      );

      for (let i = 0; i < allSelectedShifts.length; i++) {
        for (let j = i + 1; j < allSelectedShifts.length; j++) {
          const shiftA = allSelectedShifts[i];
          const shiftB = allSelectedShifts[j];

          if (
            shiftA.day === shiftB.day &&
            shiftA.startHour < shiftB.endHour &&
            shiftA.endHour > shiftB.startHour
          ) {
            issues.push(
              `Conflito de horário entre ${shiftA.name} e ${shiftB.name}`
            );
          }
        }
      }

      return { valid: issues.length === 0, issues };
    },
    nextTick(callback: () => void) {
      (this as any).$nextTick(callback);
    }
  },
  mounted() {
    this.loadStudentData();
  }
});
</script>
