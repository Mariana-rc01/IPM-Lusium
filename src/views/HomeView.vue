<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
} from '@/components/ui/tabs'
import Overview from '@/components/Overview.vue'
import RecentTickets from '@/components/RecentTickets.vue'
import Timetable from '../components/Timetable.vue';
import { ref, onMounted } from 'vue'
import { list_Requests_from_s_and_t } from '@/api/api'
import { list_Requests_from_d } from '@/api/api'

const role = ref('aluno') // *****TEMP***** Pode ser 'aluno', 'diretor' ou 'docente'

interface Ticket {
  iniciais: string
  nome: string
  email: string
  dataTicket: string
  subject: string
}

const recentTickets = ref<Ticket[]>([]);

async function fetchTickets(role: string) {
  try {
    const tickets =
      role !== 'diretor'
        ? await list_Requests_from_d(5)
        : await list_Requests_from_s_and_t(5);

    recentTickets.value = tickets.map((t) => ({
      iniciais: t.name.charAt(0).toUpperCase(),
      nome: t.name,
      email: t.email,
      subject: t.subject,
      dataTicket: t.date, // already formatted
    }));
  } catch (error) {
    console.error('Erro ao buscar os tickets:', error);
  }
}

onMounted(() => {
  fetchTickets(role.value);
});

  // Example data for timetable
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

<template>
  <div class="hidden flex-col md:flex">
    <div class="flex-1 space-y-4 p-8 pt-6">
      <div class="flex items-center justify-between space-y-2">
        <h2
          class="text-3xl font-bold tracking-tight text-zinc-950"
          :class="{ 'mb-12': role !== 'diretor' }"
        >
          Página Principal
        </h2>
        <div v-if="role === 'diretor'" class="flex items-center space-x-2">
          <Button class="bg-emerald-900 hover:bg-emerald-400">Publicar Horários</Button>
        </div>
      </div>
      <Tabs default-value="overview" class="space-y-4">
        <TabsContent value="overview" class="space-y-4">
          <div v-if="role === 'diretor'" class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card class="border-2 border-emerald-200 text-emerald-900">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  Estado global de alocação
                </CardTitle>
                <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.1665 1.33341L1.83317 10.6667M4.49984 2.33341C4.49984 3.25389 3.75365 4.00008 2.83317 4.00008C1.9127 4.00008 1.1665 3.25389 1.1665 2.33341C1.1665 1.41294 1.9127 0.666748 2.83317 0.666748C3.75365 0.666748 4.49984 1.41294 4.49984 2.33341ZM11.8332 9.66675C11.8332 10.5872 11.087 11.3334 10.1665 11.3334C9.24603 11.3334 8.49984 10.5872 8.49984 9.66675C8.49984 8.74627 9.24603 8.00008 10.1665 8.00008C11.087 8.00008 11.8332 8.74627 11.8332 9.66675Z" stroke="#71717A" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  97.88%
                </div>
              </CardContent>
            </Card>
            <Card class="border-2 border-emerald-200 text-emerald-900">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  Número de alunos por alocar
                </CardTitle>
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.33333 1.33325V3.99992M9.66667 1.33325V3.99992M1 6.66659H13M8.33333 9.33325L5.66667 11.9999M5.66667 9.33325L8.33333 11.9999M2.33333 2.66659H11.6667C12.403 2.66659 13 3.26354 13 3.99992V13.3333C13 14.0696 12.403 14.6666 11.6667 14.6666H2.33333C1.59695 14.6666 1 14.0696 1 13.3333V3.99992C1 3.26354 1.59695 2.66659 2.33333 2.66659Z" stroke="#71717A" stroke-linecap="round" stroke-linejoin="round"/></svg>

              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  16
                </div>
              </CardContent>
            </Card>
            <Card class="border-2 border-emerald-200 text-emerald-900">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  Número de alunos total
                </CardTitle>
                <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.1665 12.9999V2.99992C1.1665 2.55789 1.3421 2.13397 1.65466 1.82141C1.96722 1.50885 2.39114 1.33325 2.83317 1.33325H11.8332V14.6666H2.83317C2.39114 14.6666 1.96722 14.491 1.65466 14.1784C1.3421 13.8659 1.1665 13.4419 1.1665 12.9999ZM1.1665 12.9999C1.1665 12.5579 1.3421 12.134 1.65466 11.8214C1.96722 11.5088 2.39114 11.3333 2.83317 11.3333H11.8332M6.49984 6.66659C7.23622 6.66659 7.83317 6.06963 7.83317 5.33325C7.83317 4.59687 7.23622 3.99992 6.49984 3.99992C5.76346 3.99992 5.1665 4.59687 5.1665 5.33325C5.1665 6.06963 5.76346 6.66659 6.49984 6.66659ZM6.49984 6.66659C7.03027 6.66659 7.53898 6.8773 7.91405 7.25237C8.28912 7.62744 8.49984 8.13615 8.49984 8.66659M6.49984 6.66659C5.9694 6.66659 5.4607 6.8773 5.08562 7.25237C4.71055 7.62744 4.49984 8.13615 4.49984 8.66659" stroke="#71717A" stroke-linecap="round" stroke-linejoin="round"/></svg>

              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  755
                </div>
              </CardContent>
            </Card>
            <Card class="border-2 border-emerald-200 text-emerald-900">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  Pedidos resolvidos
                </CardTitle>
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.00016 5.66667L5.3335 7L8.00016 4.33333M10.6668 13L6.00016 10.3333L1.3335 13V2.33333C1.3335 1.97971 1.47397 1.64057 1.72402 1.39052C1.97407 1.14048 2.31321 1 2.66683 1H9.3335C9.68712 1 10.0263 1.14048 10.2763 1.39052C10.5264 1.64057 10.6668 1.97971 10.6668 2.33333V13Z" stroke="#71717A" stroke-linecap="round" stroke-linejoin="round"/></svg>

              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  43
                </div>
              </CardContent>
            </Card>
          </div>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card v-if="role != 'aluno'" class="col-span-4 border-2 border-emerald-200 text-emerald-900">
              <CardHeader>
                <CardTitle>Ocupação dos turnos</CardTitle>
              </CardHeader>
              <CardContent class="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card v-else class="col-span-4 border-2 border-emerald-200 text-emerald-900 h-[500px] overflow-y-auto">
              <CardHeader>
                <CardTitle>Horário</CardTitle>
              </CardHeader>
              <CardContent class="pl-2">
                <Timetable mode="student" :blocks="studentBlocks" />
              </CardContent>
            </Card>
            <Card class="col-span-3 border-2 border-emerald-200">
              <CardHeader>
                <CardTitle class="text-emerald-900">Pedidos recentes</CardTitle>
                <CardDescription>
                  Estes são os últimos pedidos submetidos!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTickets :recentTickets=recentTickets />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>