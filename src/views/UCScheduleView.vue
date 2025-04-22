<template>
  <div class="p-6">
    <div class="w-full max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-1">{{ computedTitle }}</h1>
      <p class="text-green-500 mb-6">Aqui pode consultar o horário da Unidade Curricular selecionada!</p>
      <Timetable
        mode="teacher"
        :blocks="teacherBlocks"
        class="scale-105 origin-top-left"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Timetable from '../components/Timetable.vue';
import { getAvailableCourses } from '@/api/api';

interface ClassBlock {
  id: string;
  name: string;
  room: string;
  day: number;
  startHour: string;
  endHour: string;
  occupancy: {
    current: number;
    total: number;
    percentage: number;
  };
}

export default defineComponent({
  name: 'CourseTimetable',
  components: { Timetable },
  setup() {
    const route = useRoute();
    const courseId = ref<string>(route.params.idCourse as string);

    const computedTitle = ref<string>('Horário da UC');
    const teacherBlocks = ref<ClassBlock[]>([]);

    onMounted(async () => {
  try {
    const courses = await getAvailableCourses([courseId.value]);
    if (courses.length > 0) {
      const course = courses[0];
      computedTitle.value = `Horário da UC ${course.uc}`;
      teacherBlocks.value = course.turnos.map((t: any) => ({
        // estas duas para a navegação
        uc: course.uc,
        shiftName: t.name,

        // resto das props que já tinhas
        id: t.id,
        name: t.name,
        room: t.room,
        day: t.day,
        startHour: t.startHour,
        endHour: t.endHour,
        occupancy: {
          current: t.occupancy.current,
          total: t.occupancy.total,
          percentage: t.occupancy.percentage
        }
      }));
    }
  } catch (err) {
    console.error('Erro ao carregar turnos da unidade curricular:', err);
  }
});

    return {
      computedTitle,
      teacherBlocks
    };
  }
});
</script>
