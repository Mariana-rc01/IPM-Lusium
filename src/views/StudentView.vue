<template>
  <div class="p-6">
    <div class="w-full max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-1">Horário</h1>
      <p class="text-green-500 mb-6">Aqui pode consultar o horário que lhe foi atribuído!</p>

      <Timetable mode="student" :blocks="studentBlocks" />
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import Timetable from '../components/Timetable.vue';
  
  // Example data for the student view
  const studentBlocks = [
    {
      name: 'IPM - PL4',
      room: 'CP1 - 1.17',
      day: 0, // Monday
      startHour: '9:00',
      endHour: '11:00', // 2-hour class
      occupancy: {
        current: 31,
        total: 35,
        percentage: 88.57
      }
    },
    {
      name: 'CG - T1',
      room: 'CP1 - 0.08',
      day: 0, // Monday
      startHour: '11:00',
      endHour: '13:00', // 2-hour class
      occupancy: {
        current: 94,
        total: 95,
        percentage: 98.94
      }
    },
    {
      name: 'PL - PL6',
      room: 'CP1 - 0.17',
      day: 1, // Tuesday
      startHour: '9:00',
      endHour: '11:00', // 2-hour class
      occupancy: {
        current: 45,
        total: 45,
        percentage: 100.00
      }
    },
    {
      name: 'IPM - T1',
      room: 'CP1 - 0.08',
      day: 2, // Wednesday
      startHour: '11:00',
      endHour: '13:00', // 2-hour class
      occupancy: {
        current: 55,
        total: 95,
        percentage: 57.89
      }
    },
    {
      name: 'CG - PL3',
      room: 'CP2 - 2.09',
      day: 3, // Thursday
      startHour: '8:00',
      endHour: '10:00', // 2-hour class
      occupancy: {
        current: 30,
        total: 35,
        percentage: 85.71
      }
    },
    {
      name: 'SSI - PL1',
      room: 'CP1 - 2.21',
      day: 3, // Thursday
      startHour: '10:00',
      endHour: '12:00', // 2-hour class
      occupancy: {
        current: 84,
        total: 95,
        percentage: 88.42
      }
    },
    {
      name: 'PL - T1',
      room: 'CP1 - 0.08',
      day: 4, // Friday
      startHour: '9:00',
      endHour: '11:00', // 2-hour class
      occupancy: {
        current: 94,
        total: 95,
        percentage: 98.94
      }
    }
  ];
  </script>