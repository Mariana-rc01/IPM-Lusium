<template>
  <div class="container mx-auto p-4 max-w-7xl">
    <div v-if="isLoading" class="text-center py-20">Carregando perfil...</div>
    <div v-else>
      <div class="w-full grid grid-cols-1 lg:grid-cols-5">
        <h1 class="col-span-1 text-2xl text-center font-bold mb-12 lg:mb-1">Perfil</h1>
        <div class="col-span-4 flex-1 flex justify-center">
          <div class="grid grid-cols-1 lg:grid-cols-2 grid-rows-5 gap-10">
            <div class="flex items-start row-span-2 gap-10">
              <div class="flex flex-col items-start gap-3">
                <h2 class="text-xl font-bold text-emerald-500">Nome</h2>
                <h2 class="text-xl font-bold text-emerald-500">Email</h2>
                <h2 class="text-xl font-bold text-emerald-500">Idade</h2>
                <h2 class="text-xl font-bold text-emerald-500">Localização</h2>
                <h2 class="text-xl font-bold text-emerald-500">Profissão</h2>
              </div>
              <div class="flex flex-col items-start gap-3">
                <p class="text-xl">{{ profile.name }}</p>
                <p class="text-xl">{{ profile.email }}</p>
                <p class="text-xl">{{ profile.age }} anos</p>
                <p class="text-xl">{{ profile.location }}</p>
                <p class="text-xl">{{ profile.profession }}</p>
              </div>
            </div>

            <div class="grid grid-cols-4 row-span-4 gap-3 max-w-xl">
              <h2 class="text-xl font-bold text-emerald-500">Objetivos</h2>
              <p class="text-xl col-span-3">{{ profile.objectives }}</p>

              <h2 class="text-xl font-bold text-emerald-500">Desafios</h2>
              <p class="text-xl col-span-3">{{ profile.challenges }}</p>

              <h2 class="text-xl font-bold text-emerald-500">Soluções</h2>
              <p class="text-xl col-span-3">{{ profile.solutions }}</p>

              <h2 class="text-xl font-bold text-emerald-500">Citação</h2>
              <p class="text-xl col-span-3">"{{ profile.quote }}"</p>
            </div>

            <div class="row-span-3 mx-auto w-fit lg:mx-0">
              <Avatar class="h-64 w-64">
                <AvatarImage :src="profile.avatarUrl" alt="Avatar" />
                <AvatarFallback>{{ initials }}</AvatarFallback>
              </Avatar>
              <div class="w-full flex justify-center mt-4">
                <p v-if="profile.specialStatus" class="border border-emerald-500 rounded-xl px-2 py-1 text-xl">{{ profile.specialStatus }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="user?.type === 'student'" class="flex justify-center mt-24 lg:mt-0 lg:justify-end">
        <router-link :to="`/schedule/${user.id}`">
          <Button
            type="button"
            :disabled="isLoading"
            class="text-md bg-[#059669] hover:bg-[#047857] transition-colors"
          >
            Ver Horário
          </Button>
        </router-link>
      </div>
    </div>
    <div v-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useUserStore } from '@/stores/user';
import { getUserInfoById } from '@/api/api';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  age: number;
  location: string;
  profession: string;
  objectives: string;
  challenges: string;
  solutions: string;
  quote: string;
  avatarUrl: string;
  specialStatus: string | null;
}

export default defineComponent({
  name: 'ProfileView',
  components: {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
  },
  data() {
    const userStore = useUserStore();
    return {
      user: userStore.user,
      profile: {
        id: '',
        name: '',
        email: '',
        age: 0,
        location: '',
        profession: '',
        objectives: '',
        challenges: '',
        solutions: '',
        quote: '',
        avatarUrl: '',
        specialStatus: null,
      } as ProfileData,
      isLoading: false,
      error: '',
    };
  },
  computed: {
    initials(): string {
      return this.profile.name
        .split(' ')
        .map((n) => n[0])
        .join('');
    },
  },
  methods: {
    async loadProfile() {
      if (!this.user) {
        this.error = 'Utilizador não autenticado.';
        return;
      }

      this.isLoading = true;
      try {
        const data = await getUserInfoById(this.user.id);
        this.profile = {
          id: data.id,
          name: data.name,
          email: data.email,
          age: data.age,
          location: data.location,
          profession: data.profession,
          objectives: data.objectives,
          challenges: data.challenges,
          solutions: data.solutions,
          quote: data.quote,
          avatarUrl: '/avatars/01.png',
          specialStatus:
            data.specialStatus === '' || data.specialStatus == null
              ? null
              : data.specialStatus.charAt(0).toUpperCase() +
                data.specialStatus.slice(1).toLowerCase(),
        };
      } catch (err: any) {
        console.error('Erro ao carregar perfil:', err);
        this.error = 'Não foi possível carregar o perfil.';
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.loadProfile();
  },
});
</script>
