<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user';
import { ref } from 'vue';
import { authenticateUser } from '@/api/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ErrorAlert from '@/components/popup/ErrorAlert.vue';

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const userId = ref('');
const password = ref('');

async function onSubmit(event: Event) {
  event.preventDefault();
  isLoading.value = true;
  errorMessage.value = null;

  if (!userId.value || !password.value) {
    errorMessage.value = 'Credenciais inválidas! Por favor, introduza um ID e uma palavra-passe válidos.';
    isLoading.value = false;
    return;
  }

  try {
    // Authenticate user using the API
    const user = await authenticateUser(userId.value, password.value);

    // Store the user state globally
    const userStore = useUserStore();
    userStore.setUser(user);

    // Redirect based on the user type
    router.push('/home');
  } catch (error: any) {
    console.error('Erro na autenticação:', error);
    errorMessage.value = error.message || 'Erro ao iniciar sessão. Por favor, tente novamente mais tarde.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
    <div :class="cn('grid gap-6', $attrs.class ?? '')">
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
