<script setup lang="ts">
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
const username = ref('')
const password = ref('')

async function onSubmit(event: Event) {
    event.preventDefault()
    isLoading.value = true
    errorMessage.value = null

    // TODO
    if (!username.value || !password.value) {
        errorMessage.value = 'Credenciais inválidas! Por favor, introduza um nome de utilizador e uma palavra-passe válidos.'
        isLoading.value = false
        return
    }

    // TODO
    setTimeout(() => {
        isLoading.value = false
        router.push('/aluno')
    }, 500)
}
</script>

<template>
    <div :class="cn('grid gap-6', $attrs.class ?? '')">
        <form @submit="onSubmit">
            <div class="grid gap-4">
                <div class="grid gap-2">
                    <Input id="username" v-model="username" placeholder="Introduza o seu nome de utilizador"
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
