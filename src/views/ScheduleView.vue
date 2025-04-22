<template>
  <div class="p-6">
    <div class="w-full max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-1">Horário</h1>
      <p class="text-green-500 mb-6">Aqui pode consultar o horário que lhe foi atribuído!</p>

      <Timetable mode="student" :blocks="studentBlocks" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Timetable from '../components/Timetable.vue';
import {
  getStudentById,
  getStudentAllocations,
  getAvailableCourses
} from '@/api/api';
import { useUserStore } from '@/stores/user';

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
  name: 'StudentTimetable',
  components: { Timetable },
  setup() {
    const route = useRoute();
    const studentId = ref<string>(route.params.idStudent as string);
    const enrolledCourses = ref<string[]>([]);
    const allocations = ref<string[]>([]);
    const availableCourses = ref<Course[]>([]);
    const studentShifts = ref<string[]>([]);

    const studentBlocks = computed<ClassBlock[]>(() =>
      availableCourses.value.flatMap(course =>
        course.turnos
          .filter(turno => studentShifts.value.includes(turno.id))
          .map(turno => ({
            ...turno,
            name: `${course.uc} - ${turno.name}`
          }))
      )
    );

    const loadStudentData = async () => {
      try {
        const student = await getStudentById(studentId.value);
        enrolledCourses.value = student.enrolled;

        allocations.value = await getStudentAllocations(studentId.value);
        availableCourses.value = await getAvailableCourses(enrolledCourses.value);

        // Gets the already assigned shifts
        studentShifts.value = allocations.value;

        console.log('Available Courses:', availableCourses.value);
        console.log('Allocations:', allocations.value);
      } catch (error: any) {
        console.error('Erro ao carregar dados:', error.message);
      }
    };

    onMounted(() => {
      loadStudentData();

      const userStore = useUserStore();
      const user = userStore.user;
      if (!user) {
        console.warn('Unexpected error: User not found in store');
        return;
      }

      const userType = user.type; // 'student', 'teacher', or 'director'
      const id = user.id;

      // If the user is a director, redirect to the allocation view
      if (userType === 'director') {
        window.location.href = `/allocate/${studentId.value}`;
        return;
      }

      // If the user is a student, verify if the ID matches; if not, redirect to login
      if (userType === 'student' && id !== studentId.value) {
        window.location.href = '/login';
      }
    });

    return {
      studentBlocks
    };
  }
});
</script>
