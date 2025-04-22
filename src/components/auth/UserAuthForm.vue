<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user';
import { authenticateUser } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ErrorAlert from '@/components/popup/ErrorAlert.vue';

export default defineComponent({
  components: {
    Button,
    Input,
    ErrorAlert
  },
  data() {
    return {
      isLoading: false,
      errorMessage: null as string | null,
      userId: '',
      password: ''
    }
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async onSubmit(event: Event) {
      event.preventDefault();
      this.isLoading = true;
      this.errorMessage = null;

      if (!this.userId || !this.password) {
        this.errorMessage = 'Credenciais inválidas! Por favor, introduza um ID e uma palavra-passe válidos.';
        this.isLoading = false;
        return;
      }

      try {
        const user = await authenticateUser(this.userId, this.password);
        const userStore = useUserStore();
        userStore.setUser(user);

        this.router.push('/home');
      } catch (error: any) {
        console.error('Erro na autenticação:', error);
        this.errorMessage = error.message || 'Erro ao iniciar sessão. Por favor, tente novamente mais tarde.';
      } finally {
        this.isLoading = false;
      }
    }
  }
});
</script>

<template>
    <div :class="['grid gap-6', $attrs.class ?? ''].filter(Boolean).join(' ')">
        <form @submit="onSubmit">
            <div class="grid gap-4">
                <div class="grid gap-2">
                    <Input id="userId" v-model="userId" placeholder="Introduza o seu nome de utilizador"
                        type="text" :disabled="isLoading"
                        class="bg-zinc-50 border-zinc-300 text-zinc-500 placeholder:text-zinc-400 focus-visible:ring-[#059669]"/>
                </div>

                <div class="grid gap-2">
                    <Input id="password" v-model="password" placeholder="Introduza a sua palavra-passe"
                        type="password" :disabled="isLoading"
                        class="bg-zinc-50 border-zinc-300 text-zinc-500 placeholder:text-zinc-400 focus-visible:ring-[#059669]"/>
                </div>

                <ErrorAlert v-if="errorMessage" :message="errorMessage" @close="errorMessage = null" />

                <Button type="submit" :disabled="isLoading" class="bg-[#059669] hover:bg-[#047857] transition-colors">
                    Iniciar Sessão
                </Button>
            </div>
        </form>
    </div>
</template>
