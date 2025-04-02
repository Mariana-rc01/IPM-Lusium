<script setup lang="ts">
import { BarChart } from '@/components/ui/chart-bar'

const data = [
  { name: 'POO', percentagem: Math.floor(Math.random() * 100) },
  { name: 'IPM', percentagem: Math.floor(Math.random() * 100) },
  { name: 'RC', percentagem: Math.floor(Math.random() * 100) },
  { name: 'CP', percentagem: Math.floor(Math.random() * 100) },
  { name: 'ArqC', percentagem: Math.floor(Math.random() * 100) },
  { name: 'CG', percentagem: Math.floor(Math.random() * 100) },
  { name: 'PL', percentagem: Math.floor(Math.random() * 100) },
  { name: 'EA', percentagem: Math.floor(Math.random() * 100) },
  { name: 'AC', percentagem: Math.floor(Math.random() * 100) },
  { name: 'SSI', percentagem: Math.floor(Math.random() * 100) },
  { name: 'ADI', percentagem: Math.floor(Math.random() * 100) },
  { name: 'AL', percentagem: Math.floor(Math.random() * 100) },
]

const color = '#064e3b' // emerald-900
</script>

<template>
  <BarChart 
    :data="data" 
    :categories="['percentagem']" 
    :index="'name'" 
    :rounded-corners="4" 
    :colors="[color]"
    :y-formatter="(value => value + '%')"
    :show-legend="false"
  />
</template>
