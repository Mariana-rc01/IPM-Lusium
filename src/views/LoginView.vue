<script setup lang="ts">
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/registry/new-york/ui/button'
import UserAuthForm from '../components/auth/UserAuthForm.vue'
</script>

<template>
    <div class="min-h-screen w-full flex">
        <!-- Left Side -->
        <div class="hidden lg:flex flex-1 flex-col bg-[#059669] p-10 text-white relative">
            <div class="flex items-center gap-2 text-lg font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="h-6 w-6">
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                Lusium
            </div>

            <div class="mt-auto">
                <blockquote class="space-y-2">
                    <p class="text-lg">
                        Gestão de horários simplificada e eficiente. A ferramenta essencial para uma
                        organização académica mais ágil, flexível e sem complicações.
                    </p>
                </blockquote>
            </div>
        </div>

        <!-- Right Side (Forms) -->
        <div class="flex-1 flex items-center justify-center p-6">
            <div class="w-full max-w-md">
                <div class="flex flex-col space-y-4 text-center">
                    <h1 class="text-2xl font-semibold tracking-tight" style="color: #065F46; font-size: 24px;">
                        Iniciar Sessão
                    </h1>
                    <p class="text-sm text-muted-foreground" style="color: #059669; font-size: 14px;">
                        Insira o seu nome de utilizador e palavra-passe para iniciar sessão.
                    </p>
                </div>
                <UserAuthForm class="mt-6" />
            </div>
        </div>
    </div>
</template>
