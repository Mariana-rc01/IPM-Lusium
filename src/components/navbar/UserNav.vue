<script setup lang="ts">
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMarkedTicketStore } from '@/stores/markedTicket'
import { useSidebarStateStore } from '@/stores/sidebarState'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const sidebarStateStore = useSidebarStateStore()
const router = useRouter()
const markedTicket = useMarkedTicketStore()

function logout() {
  userStore.clearUser();
  sidebarStateStore.$reset();
  markedTicket.clearMarkedTicketId();
  router.push('/login');
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative h-8 w-8 rounded-full">
        <Avatar class="h-8 w-8">
          <AvatarImage src="/avatars/01.png" alt="@shadcn" />
          <AvatarFallback>DC</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuItem as-child>
        <router-link :to="`/profile/${userStore.user?.id}`">Perfil</router-link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="logout">
        Terminar Sessão
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>