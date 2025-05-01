<script setup lang="ts">
import {
  Avatar,
} from '@/components/ui/avatar'
import type { PropType } from 'vue'

interface Ticket {
  iniciais: string
  nome: string
  email: string
  dataTicket: string
  subject: string
}

defineProps({
  recentTickets: {
    type: Array as PropType<Ticket[]>,
    required: true,
  },
})
</script>

<template>
  <div class="space-y-8">
    <div v-for="ticket in recentTickets" class="flex items-center gap-4 justify-between">
      <div class="flex items-center gap-4">
        <Avatar class="h-9 w-9">{{ ticket.iniciais }}</Avatar>
        <div class="space-y-1">
          <p class="text-sm font-medium leading-none text-emerald-900">
            {{ ticket.nome }}
          </p>
          <p class="text-sm text-muted-foreground">
            {{ ticket.email }}
          </p>
        </div>
      </div>
      <div class="space-y-1 text-right">
        <p class="text-sm font-medium leading-none text-emerald-900">
          {{ ticket.subject }}
        </p>
        <p class="text-sm text-muted-foreground">
          {{ ticket.dataTicket }}
        </p>
      </div>
    </div>
  </div>
</template>