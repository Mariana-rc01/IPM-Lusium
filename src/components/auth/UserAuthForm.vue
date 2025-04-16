<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user'
import axios from 'axios'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref } from 'vue'
import ErrorAlert from '@/components/popup/ErrorAlert.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const userId = ref('')
const password = ref('')

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
    // Faz a requisição ao db.json
    const response = await axios.get('/db/db.json');
    const data = response.data;

    // Verifica o tipo de usuário com base no ID
    let user = null;
    if (userId.value.startsWith('d')) {
      user = data.directors.find((u: any) => u.id === userId.value && u.password === password.value);
    } else if (userId.value.startsWith('t')) {
      user = data.teachers.find((u: any) => u.id === userId.value && u.password === password.value);
    } else if (userId.value.startsWith('a')) {
      user = data.students.find((u: any) => u.id === userId.value && u.password === password.value);
    }

    if (user) {
      // Armazena o estado globalmente
      const userStore = useUserStore();
      userStore.setUser({
        id: user.id,
        name: user.name,
        type: userId.value.startsWith('d') ? 'director' : userId.value.startsWith('t') ? 'teacher' : 'student',
      });

      // Redireciona com base no tipo de usuário
      router.push('/home');
    } else {
      errorMessage.value = 'Credenciais inválidas! Verifique o ID e a palavra-passe.';
    }
  } catch (error) {
    console.error('Erro na autenticação:', error);
    errorMessage.value = 'Erro ao iniciar sessão. Por favor, tente novamente mais tarde.';
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
