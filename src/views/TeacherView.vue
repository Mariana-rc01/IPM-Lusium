<template>
    <div class="p-6">  
      <div class="w-full max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-1">{{computedTitle}}</h1>
      <p class="text-green-500 mb-6">Aqui pode consultar o horário da Unidade Curricular selecionada!</p>
      <Timetable 
        mode="teacher" 
        :blocks="teacherBlocks"
      />
    </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import Timetable from '../components/Timetable.vue';

  interface PageProps {
    title?: string;
  }
  
  const props = withDefaults(defineProps<PageProps>(), {
    title: 'Horário',
  });

  const currentUC = 'IPM' + ' - Horário'; // Needs to be passed from the parent component or using the url

  // Computed title based on the mode
  const computedTitle = computed(() => {
      return currentUC || props.title;
    }
  );

  // Example data for the teacher view
  const teacherBlocks = [
    {
      name: 'PL3',
      room: 'CP3 - 1.04',
      day: 1, // Tuesday
      startHour: '8:00',
      endHour: '10:00', // 2-hour class
      occupancy: {
        current: 27,
        total: 30,
        percentage: 90
      }
    },
    {
      name: 'PL4',
      room: 'CP1 - 1.17',
      day: 0, // Monday
      startHour: '9:00',
      endHour: '10:00', // 1-hour class
      occupancy: {
        current: 27,
        total: 29,
        percentage: 93.10
      }
    },
    {
      name: 'PL1',
      room: 'CP1 - 1.18',
      day: 0, // Monday
      startHour: '9:00',
      endHour: '10:00', // 1-hour class (side by side with PL4)
      occupancy: {
        current: 25,
        total: 30,
        percentage: 83.31
      }
    },
    {
      name: 'PL5',
      room: 'CP2 - 2.12',
      day: 1, // Tuesday
      startHour: '10:00',
      endHour: '12:00', // 2-hour class
      occupancy: {
        current: 27,
        total: 30,
        percentage: 90
      }
    },
    {
      name: 'T1',
      room: 'CP1 - 0.08',
      day: 2, // Wednesday
      startHour: '11:00',
      endHour: '13:00', // 2-hour class
      occupancy: {
        current: 94,
        total: 95,
        percentage: 98.94
      }
    },
    {
      name: 'T2',
      room: 'CP1 - 0.08',
      day: 2, // Wednesday
      startHour: '14:00',
      endHour: '16:00', // 2-hour class
      occupancy: {
        current: 94,
        total: 95,
        percentage: 98.94
      }
    },
    {
      name: 'PL7',
      room: 'CP1 - 0.17',
      day: 3, // Thursday
      startHour: '8:00',
      endHour: '10:00', // 2-hour class
      occupancy: {
        current: 45,
        total: 45,
        percentage: 100.00
      }
    },
    {
      name: 'PL8',
      room: 'CP2 - 2.09',
      day: 4, // Friday
      startHour: '8:00',
      endHour: '10:00', // 2-hour class
      occupancy: {
        current: 30,
        total: 35,
        percentage: 85.71
      }
    }
    ,
    {
      name: 'PL9',
      room: 'CP1 - 2.21',
      day: 4, // Friday
      startHour: '10:00',
      endHour: '12:00', // 2-hour class
      occupancy: {
        current: 84,
        total: 95,
        percentage: 88.42
      }
    },
    {
      name: 'T3',
      room: 'CP1 - 0.08',
      day: 4, // Friday
      startHour: '14:00',
      endHour: '16:00', // 2-hour class
      occupancy: {
        current: 94,
        total: 95,
        percentage: 98.94
      }
    },
    {
      name: 'PL6',
      room: 'CP1 - 2.21',
      day: 4, // Friday
      startHour: '14:00',
      endHour: '16:00', // 2-hour class
      occupancy: {
        current: 84,
        total: 95,
        percentage: 88.42
      }
    },
    {
      name: 'PL9',
      room: 'CP1 - 2.21',
      day: 4, // Friday
      startHour: '16:00',
      endHour: '18:00', // 2-hour class
      occupancy: {
        current: 84,
        total: 95,
        percentage: 88.42
      }
    }
  ];
  </script>