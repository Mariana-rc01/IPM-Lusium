<template>
  <div class="p-6 flex justify-center">
    <div class="w-full max-w-6xl mx-auto">
      <!-- Title -->
      <h1 class="text-2xl font-bold mb-1">Alocação manual de turnos</h1>
      <p class="text-[#10B981] mb-6">Aqui pode alocar um aluno aos turnos de cada Unidade Curricular!</p>

      <div class="flex flex-col md:flex-row gap-20">
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
  </div>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Timetable from '../components/Timetable.vue'
import { ScrollArea } from '../components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/popup/ConfirmModal.vue'

interface ClassBlock {
  id: string
  name: string
  room: string
  day: number
  startHour: string
  endHour: string
  occupancy: {
    current: number
    total: number
    percentage: number
  }
}

interface Course {
  uc: string
  turnos: ClassBlock[]
}

const showModal = ref(false)
const modalMessage = ref('')

const availableCourses = ref<Course[]>([
  {
    uc: 'IPM',
    turnos: [
      {
        id: 'IPM-T1',
        name: 'T1',
        room: 'CP1 - 0.08',
        day: 0,
        startHour: '11:00',
        endHour: '13:00',
        occupancy: { current: 94, total: 95, percentage: 98.94 }
      },
      {
        id: 'IPM-PL1',
        name: 'PL1',
        room: 'CP1 - 0.08',
        day: 0,
        startHour: '8:00',
        endHour: '10:00',
        occupancy: { current: 30, total: 35, percentage: 85.71 }
      },
      {
        id: 'IPM-PL3',
        name: 'PL3',
        room: 'CP1 - 0.08',
        day: 1,
        startHour: '11:00',
        endHour: '13:00',
        occupancy: { current: 55, total: 95, percentage: 57.89 }
      },
      {
        id: 'IPM-PL4',
        name: 'PL4',
        room: 'CP1 - 1.17',
        day: 0,
        startHour: '9:00',
        endHour: '11:00',
        occupancy: { current: 25, total: 30, percentage: 85.03 }
      }
    ]
  },
  {
    uc: 'PL',
    turnos: [
      {
        id: 'PL-T1',
        name: 'T1',
        room: 'CP1 - 0.08',
        day: 4,
        startHour: '11:00',
        endHour: '13:00',
        occupancy: { current: 94, total: 95, percentage: 98.94 }
      },
      {
        id: 'PL-PL2',
        name: 'PL2',
        room: 'CP1 - 0.08',
        day: 0,
        startHour: '9:00',
        endHour: '11:00',
        occupancy: { current: 25, total: 30, percentage: 85.03 }
      },
      {
        id: 'PL-PL3',
        name: 'PL3',
        room: 'CP1 - 0.08',
        day: 0,
        startHour: '9:00',
        endHour: '10:00',
        occupancy: { current: 30, total: 35, percentage: 85.71 }
      },
      {
        id: 'PL-PL4',
        name: 'PL4',
        room: 'CP1 - 0.08',
        day: 1,
        startHour: '11:00',
        endHour: '13:00',
        occupancy: { current: 55, total: 95, percentage: 57.89 }
      },
      {
        id: 'PL-PL5',
        name: 'PL5',
        room: 'CP1 - 0.08',
        day: 1,
        startHour: '11:00',
        endHour: '13:00',
        occupancy: { current: 55, total: 95, percentage: 57.89 }
      },
      {
        id: 'PL-PL6',
        name: 'PL6',
        room: 'CP1 - 0.17',
        day: 1,
        startHour: '9:00',
        endHour: '11:00',
        occupancy: { current: 45, total: 45, percentage: 100.00 }
      }
    ]
  },
  {
    uc: 'CG',
    turnos: [
      {
        id: 'CG-T1',
        name: 'T1',
        room: 'CP1 - 0.08',
        day: 2,
        startHour: '11:00',
        endHour: '13:00',
        occupancy: { current: 55, total: 95, percentage: 57.89 }
      },
      {
        id: 'CG-PL1',
        name: 'PL1',
        room: 'CP1 - 0.08',
        day: 2,
        startHour: '9:00',
        endHour: '11:00',
        occupancy: { current: 25, total: 30, percentage: 85.03 }
      },
      {
        id: 'CG-PL2',
        name: 'PL2',
        room: 'CP1 - 0.08',
        day: 3,
        startHour: '11:00',
        endHour: '13:00',
        occupancy: { current: 94, total: 95, percentage: 98.94 }
      },
      {
        id: 'CG-PL3',
        name: 'PL3',
        room: 'CP2 - 2.09',
        day: 3,
        startHour: '8:00',
        endHour: '10:00',
        occupancy: { current: 30, total: 35, percentage: 85.71 }
      }
    ]
  },
  {
    uc: 'SSI',
    turnos: [
      {
        id: 'SSI-T1',
        name: 'T1',
        room: 'CP1 - 0.08',
        day: 3,
        startHour: '9:00',
        endHour: '11:00',
        occupancy: { current: 94, total: 95, percentage: 98.94 }
      },
      {
        id: 'SSI-PL1',
        name: 'PL1',
        room: 'CP1 - 0.08',
        day: 4,
        startHour: '9:00',
        endHour: '11:00',
        occupancy: { current: 25, total: 30, percentage: 85.03 }
      }
    ]
  }
])

const hours = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
]

const expandedUCs = ref<string[]>([])

const toggleUC = (uc: string) => {
  const index = expandedUCs.value.indexOf(uc)
  if (index > -1) {
    expandedUCs.value.splice(index, 1)
  } else {
    expandedUCs.value.push(uc)
  }
}

const selectedShifts = ref<string[]>([])

const selectedBlocks = computed<ClassBlock[]>(() =>
  availableCourses.value.flatMap(course =>
      course.turnos
        .filter(turno => selectedShifts.value.includes(turno.id))
        .map(turno => ({...turno, name: `${course.uc} - ${turno.name}`})))
)

const updateSelection = (checked: boolean, turnoID: string) => {
  if (checked)
    selectedShifts.value = [...selectedShifts.value, turnoID]
  else
    selectedShifts.value = selectedShifts.value.filter(id => id !== turnoID)
}

const validateSchedule = (): { valid: boolean, issues: string[] } => {
  const issues: string[] = [];

  for (const course of availableCourses.value) {
    const selected = course.turnos.filter(t => selectedShifts.value.includes(t.id));
    const theoreticals = selected.filter(t => t.name.startsWith('T'));
    const praticals = selected.filter(t => t.name.startsWith('PL'));

    // Check if more than one theoretical or practical shift is selected
    if (theoreticals.length > 1) {
      issues.push(`Mais de um turno teórico selecionado para ${course.uc}`);
    }
    if (praticals.length > 1) {
      issues.push(`Mais de um turno prático selecionado para ${course.uc}`);
    }

    // Check if no shifts are selected for the course
    if (theoreticals.length + praticals.length < 2) {
      issues.push(`Faltam turnos para ${course.uc}`);
    }
  }

  // Check for overlapping blocks
  const hasOverlap = selectedBlocks.value.some((block1, i) => {
    return selectedBlocks.value.some((block2, j) => {
      // Skip comparing the same block
      if (i === j) return false;
       // Skip blocks on different days
      if (block1.day !== block2.day) return false;

      const start1 = hours.indexOf(block1.startHour);
      const end1 = hours.indexOf(block1.endHour);
      const start2 = hours.indexOf(block2.startHour);
      const end2 = hours.indexOf(block2.endHour);

      // Check if the blocks overlap
      return start1 < end2 && end1 > start2;
    });
  });

  if (hasOverlap) {
    issues.push('O horário possui sobreposições');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
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
    modalMessage.value = `Erros:\n${validation.issues.join('\n')}`;
    showModal.value = true;
    return;
  }

  modalMessage.value = 'Schedule successfully allocated!';
  showModal.value = true;
  // TODO - Remove the old schedule and add the new one to the JSON server
  // TODO - Update the number of students in the selected shifts
};
</script>
