<script setup lang="ts">
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import type { PropType } from 'vue'

interface Ticket {
  iniciais: string
  nome: string
  email: string
  dataTicket: string
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
    <div v-for="ticket in recentTickets" class="flex items-center">
      <Avatar class="h-9 w-9">
        <AvatarImage src="/avatars/01.png" alt="Avatar" />
        <AvatarFallback>{{ ticket.iniciais }}</AvatarFallback>
      </Avatar>
      <div class="ml-4 space-y-1">
        <p class="text-sm font-medium leading-none text-emerald-900">
          {{ ticket.nome }}
        </p>
        <p class="text-sm text-muted-foreground">
          {{ ticket.email }}
        </p>
      </div>
      <div class="ml-auto font-medium">
        {{ ticket.dataTicket }}
      </div>
    </div>
  </div>
</template>