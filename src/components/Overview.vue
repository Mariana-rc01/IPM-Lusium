<script setup lang="ts">
import { BarChart } from '@/components/ui/chart-bar'

import type { PropType } from 'vue'

interface CourseOccupancy {
  abreviatura: string
  percentagem: number
}

defineProps({
  CoursesOccupancy: {
    type: Array as PropType<CourseOccupancy[]>,
    required: false,
  },
})

const color = '#064e3b' // emerald-900
</script>

<template>
  <BarChart 
    :data="CoursesOccupancy || []"
    :categories="['percentagem']" 
    :index="'abreviatura'" 
    :rounded-corners="4" 
    :colors="[color]"
    :y-formatter="(value => value + '%')"
    :show-legend="false"
  />
</template>
