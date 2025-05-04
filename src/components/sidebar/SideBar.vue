<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Ticket from '@/components/ticket/Ticket.vue';
import { useMarkedTicketStore } from '@/stores/markedTicket';
import { useUserStore } from '@/stores/user';
import { useSidebarStateStore } from '@/stores/sidebarState';
import SuccessAlert from '@/components/popup/SuccessAlert.vue';

const sidebarStore = useSidebarStateStore();

// 🔁 Restaurar tab ativa do localStorage ou usar 'tab1'
const savedTab = localStorage.getItem('sidebarActiveTab') || 'tab1';
const activeTab = ref(savedTab);

// 🔁 Sempre que mudar, salvar no localStorage
watch(activeTab, (newVal) => {
  localStorage.setItem('sidebarActiveTab', newVal);
});

const showModal = ref(true);
const showModalSuccess = ref(false);
const modalMessageSuccess = ref('');

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && sidebarStore.isOpen) {
    sidebarStore.toggle();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
});

const handleCloseModal = () => {
  showModal.value = false;
};

const handleCreated = () => {
  showModalSuccess.value = true;
  modalMessageSuccess.value = 'Pedido enviado com sucesso!';
};

const markedTicketStore = useMarkedTicketStore();
const userStore = useUserStore();

const ticketId = ref(markedTicketStore.getMarkedTicketId || '-1');

watch(
  () => markedTicketStore.getMarkedTicketId,
  (newId) => {
    ticketId.value = newId || '-1';
    console.log('Atualizado ticketId:', ticketId.value);
  }
);

const userType = ref(userStore.user?.type || 'guest');
</script>

<template>
  <div>
    <aside
      :class="cn(
        'fixed top-0 left-0 z-20 h-full w-[340px] bg-white transition-transform duration-300 ease-in-out',
        sidebarStore.isOpen ? 'translate-x-0 border-r border-gray-200' : '-translate-x-full'
      )"
    >
      <div class="flex items-center justify-between p-4 border-b">
        <div class="flex items-center gap-2 text-lg font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="h-6 w-6">
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Lusium
        </div>
      </div>

      <div class="p-4 bg-green-50/50 h-[calc(100%-4rem-4rem)] overflow-y-auto">
        <SuccessAlert
          v-if="showModalSuccess"
          :message="modalMessageSuccess"
          @close="showModalSuccess = false"
          class="mb-4"/>

        <Tabs v-model="activeTab" class="w-full mb-4">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="tab1">Pedido Atual</TabsTrigger>
            <TabsTrigger value="tab2">Criar Pedido</TabsTrigger>
          </TabsList>

          <TabsContent value="tab1" class="mt-2">
            <Ticket
              :key="ticketId"
              :ticketId="ticketId"
              :userType="userType"
              :isSidebar="true"
              @close="handleCloseModal"
            />
          </TabsContent>

          <TabsContent value="tab2" class="mt-2">
            <Ticket
              :key="`create-${ticketId}`"
              :ticketId="ticketId"
              :userType="userType"
              :isCreate="true"
              :isSidebar="true"
              @close="handleCloseModal"
              @created="handleCreated"
            />
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  </div>
</template>
