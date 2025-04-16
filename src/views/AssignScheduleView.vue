<template>
  <div class="p-6 flex justify-start items-start min-h-screen">
    <div class="w-full max-w-6xl mx-32">
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { nextTick as vueNextTick } from 'vue';
import Timetable from '../components/Timetable.vue';
import { ScrollArea } from '../components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/popup/ConfirmModal.vue';
import SuccessAlert from '@/components/popup/SuccessAlert.vue';
import { getAllocationsByStudentId, deleteAllocation, createAllocation, getShiftById,
  updateShiftTotalStudents, getAllAllocations, getStudentById, getStudentAllocations,
  getAvailableCourses, addStudentToNoAllocations } from '@/api/api';

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

const route = useRoute();
const studentId = ref<string>(route.params.idAluno as string);
const enrolledCourses = ref<string[]>([]);
const allocations = ref<string[]>([]);

const showModal = ref(false);
const modalMessage = ref('');

const showModalSucess = ref(false);
const modalMessageSuccess = ref<string | null>(null);

const availableCourses = ref<Course[]>([]);
const selectedShifts = ref<string[]>([]);
const expandedUCs = ref<string[]>([]);

const selectedBlocks = computed<ClassBlock[]>(() =>
  availableCourses.value.flatMap(course =>
    course.turnos
      .filter(turno => selectedShifts.value.includes(turno.id))
      .map(turno => ({ ...turno, name: `${course.uc} - ${turno.name}` }))
  )
);

const toggleUC = (uc: string) => {
  const index = expandedUCs.value.indexOf(uc);
  if (index > -1) {
    expandedUCs.value.splice(index, 1);
  } else {
    expandedUCs.value.push(uc);
  }
};

const updateSelection = (checked: boolean, shiftId: string) => {
  if (checked) {
    selectedShifts.value.push(shiftId);
  } else {
    selectedShifts.value = selectedShifts.value.filter(id => id !== shiftId);
  }
};

const loadStudentData = async () => {
  try {
    const student = await getStudentById(studentId.value);
    enrolledCourses.value = student.enrolled;

    allocations.value = await getStudentAllocations(studentId.value);
    availableCourses.value = await getAvailableCourses(enrolledCourses.value);

    // Pre-select the already allocated shifts
    selectedShifts.value = allocations.value;

    console.log('Available Courses:', availableCourses.value);
    console.log('Allocations:', allocations.value);
  } catch (error) {
    console.error('Erro ao carregar dados:', (error as any).message);
  }
};

// Update the database after saving the schedule
const saveSchedule = async () => {
  try {
    const oldAllocations = await getAllocationsByStudentId(studentId.value);

    await Promise.all(
      oldAllocations.map(async (allocation: any) => {
        const shift = await getShiftById(allocation.shiftId);
        await updateShiftTotalStudents(allocation.shiftId, Math.max(0, shift.totalStudentsRegistered - 1));

        await deleteAllocation(allocation.id);
      })
    );

    if (selectedShifts.value.length === 0) {
      await addStudentToNoAllocations(studentId.value);

      showModalSucess.value = false;
      nextTick(() => {
        modalMessageSuccess.value = 'Nenhum turno selecionado. O aluno foi adicionado à lista de não alocados.';
        showModalSucess.value = true;
        loadStudentData();
      });
      return;
    }

    const allAllocations = await getAllAllocations();
    const lastId = allAllocations.reduce((maxId: number, allocation: any) => Math.max(maxId, Number(allocation.id)), 0);

    await Promise.all(
      selectedShifts.value.map(async (shiftId, index) => {
        const shift = await getShiftById(shiftId);
        await updateShiftTotalStudents(shiftId, shift.totalStudentsRegistered + 1);

        await createAllocation({
          id: String(lastId + index + 1),
          studentId: studentId.value,
          shiftId,
        });
      })
    );

    showModalSucess.value = false;
    nextTick(() => {
      modalMessageSuccess.value = 'Horário atualizado com sucesso!';
      showModalSucess.value = true;
      loadStudentData();
    });
  } catch (error) {
    console.error('Erro ao salvar horário:', error);
    modalMessage.value = 'Erro ao atualizar o horário';
    showModal.value = true;
  }
};

function handleCancel() {
  console.log('Action canceled!');
  showModal.value = false;
  // Resets the modal message
  modalMessage.value = '';
}

const handleConfirm = () => {
  console.log('Action confirmed!');
  // Logs the allocated blocks
  console.log('Assign schedule:', selectedBlocks.value);
  showModal.value = false;
  // Resets the modal message
  modalMessage.value = '';
};

const AssignSchedule = () => {
  const validation = validateSchedule();

  if (!validation.valid) {
    modalMessage.value = `Erros:\n${validation.issues.join('. ')}`;
    showModal.value = true;
    return;
  }

  saveSchedule();
};

const validateSchedule = (): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];

  for (const course of availableCourses.value) {
    const selected = course.turnos.filter(t =>
      selectedShifts.value.includes(t.id)
    );
    const theoreticals = selected.filter(t => t.type === 'T');
    const praticals = selected.filter(t => t.type === 'PL');
    console.log('Practical:', praticals);
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

  return {
    valid: issues.length === 0,
    issues,
  };
};

onMounted(() => {
  loadStudentData();
});

function nextTick(callback: () => void) {
  vueNextTick(callback);
}
</script>
